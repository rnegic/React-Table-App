import { runInAction } from 'mobx';
import { recordsStore } from '../RecordsStore';
import * as api from '../../services/api';
import type { Record } from '../../types';

jest.mock('../../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('RecordsStore', () => {
    const mockRecord1: Record = { id: 1, fullName: 'John Doe', department: 'IT', position: 'Dev', email: 'j@d.com', phone: '123', status: 'Активен' };
    const mockRecord2: Record = { id: 2, fullName: 'Jane Smith', department: 'HR', position: 'Mgr', email: 'j@s.com', phone: '456', status: 'В отпуске' };
    const mockRecordsPage1: Record[] = [mockRecord1, mockRecord2];
    const newRecordPayload: Omit<Record, 'id'> = { fullName: 'New Guy', department: 'Support', position: 'Agent', email: 'n@g.com', phone: '789', status: 'Активен' };
    const newRecordResponse: Record = { id: 3, ...newRecordPayload };

    beforeEach(async () => {
        mockedApi.fetchRecords.mockClear();
        mockedApi.addRecord.mockClear();
        await runInAction(() => {
            recordsStore.reset();
            recordsStore.limit = 2;
        });
    });

    describe('fetchNext', () => {
        it('should fetch and append records, update page and hasMore', async () => {
            mockedApi.fetchRecords.mockResolvedValueOnce(mockRecordsPage1);

            expect(recordsStore.isLoading).toBe(false);
            await recordsStore.fetchNext();
            expect(mockedApi.fetchRecords).toHaveBeenCalledWith(0, recordsStore.limit);
            expect(recordsStore.isLoading).toBe(false);
            expect(recordsStore.records).toEqual(mockRecordsPage1);
            expect(recordsStore.page).toBe(1);
            expect(recordsStore.hasMore).toBe(true);
            expect(recordsStore.error).toBeNull();

            const mockRecordsPage2: Record[] = [{ id: 3, fullName: 'Alice', department: 'Magic', position: 'Dreamer', email: 'a@w.com', phone: '000', status: 'Активен' }];
            mockedApi.fetchRecords.mockResolvedValueOnce(mockRecordsPage2);

            await recordsStore.fetchNext();
            expect(mockedApi.fetchRecords).toHaveBeenCalledWith(recordsStore.limit, recordsStore.limit);
            expect(recordsStore.records).toEqual([...mockRecordsPage1, ...mockRecordsPage2]);
            expect(recordsStore.page).toBe(2);
            expect(recordsStore.hasMore).toBe(false);
        });

        it('should handle fetch error and set error message', async () => {
            const errorMessage = 'Network error';
            mockedApi.fetchRecords.mockRejectedValueOnce(new Error(errorMessage));

            await recordsStore.fetchNext();

            expect(recordsStore.isLoading).toBe(false);
            expect(recordsStore.error).toBe(errorMessage);
            expect(recordsStore.records).toEqual([]);
            expect(recordsStore.page).toBe(0);
        });

        it('should not fetch if already loading or no more records', async () => {
            runInAction(() => { recordsStore.isLoading = true; });
            await recordsStore.fetchNext();
            expect(mockedApi.fetchRecords).not.toHaveBeenCalled();

            mockedApi.fetchRecords.mockClear();
            runInAction(() => { recordsStore.isLoading = false; recordsStore.hasMore = false; });
            await recordsStore.fetchNext();
            expect(mockedApi.fetchRecords).not.toHaveBeenCalled();
        });
    });

    describe('addRecord', () => {
        it('should add a record and prepend it to the list', async () => {
            mockedApi.addRecord.mockResolvedValueOnce(newRecordResponse);
            runInAction(() => { recordsStore.records = [...mockRecordsPage1]; });

            expect(recordsStore.isAdding).toBe(false);
            await recordsStore.addRecord(newRecordPayload);

            expect(mockedApi.addRecord).toHaveBeenCalledWith(newRecordPayload);
            expect(recordsStore.isAdding).toBe(false);
            expect(recordsStore.records).toEqual([newRecordResponse, ...mockRecordsPage1]);
            expect(recordsStore.error).toBeNull();
        });

        it('should handle add error and set error message', async () => {
            const errorMessage = 'Failed to add record';
            mockedApi.addRecord.mockRejectedValueOnce(new Error(errorMessage));

            await recordsStore.addRecord(newRecordPayload);

            expect(recordsStore.isAdding).toBe(false);
            expect(recordsStore.error).toBe(errorMessage);
            expect(recordsStore.records).toEqual([]);
        });
    });

    describe('reset', () => {
        it('should reset store state to initial values', async () => {

            mockedApi.fetchRecords.mockResolvedValueOnce(mockRecordsPage1);
            await recordsStore.fetchNext();

            runInAction(() => {
                recordsStore.error = 'Some error';
                recordsStore.hasMore = false;
            });

            expect(recordsStore.records.length).toBeGreaterThan(0);
            expect(recordsStore.page).toBe(1);
            expect(recordsStore.hasMore).toBe(false);
            expect(recordsStore.error).not.toBeNull();

            recordsStore.reset();

            expect(recordsStore.records).toEqual([]);
            expect(recordsStore.page).toBe(0);
            expect(recordsStore.hasMore).toBe(true);
            expect(recordsStore.error).toBeNull();
            expect(recordsStore.isLoading).toBe(false);
            expect(recordsStore.isAdding).toBe(false);
        });
    });
});