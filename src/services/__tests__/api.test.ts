import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchRecords, addRecord } from '../api';
import type { Record } from '../../types';

const API_URL = 'http://localhost:3001/records';

describe('API Service', () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    describe('fetchRecords', () => {
        it('should fetch records successfully with default parameters', async () => {
            const mockData: Record[] = [
                { id: 1, fullName: 'John Doe', department: 'IT', position: 'Developer', email: 'john@example.com', phone: '+79998887766', status: 'Активен' },
            ];
            mock.onGet(`${API_URL}?_start=0&_limit=5`).reply(200, mockData);

            const records = await fetchRecords();
            expect(records).toEqual(mockData);
            expect(mock.history.get[0].url).toBe(`${API_URL}?_start=0&_limit=5`);
        });

        it('should fetch records with specified start and limit', async () => {
            const mockData: Record[] = [
                { id: 2, fullName: 'Jane Smith', department: 'HR', position: 'Manager', email: 'jane@example.com', phone: '+79998887755', status: 'В отпуске' },
            ];
            mock.onGet(`${API_URL}?_start=10&_limit=20`).reply(200, mockData);

            const records = await fetchRecords(10, 20);
            expect(records).toEqual(mockData);
            expect(mock.history.get[0].url).toBe(`${API_URL}?_start=10&_limit=20`);
        });

        it('should handle network error when fetching records', async () => {
            mock.onGet(`${API_URL}?_start=0&_limit=5`).networkError();

            await expect(fetchRecords(0, 5)).rejects.toThrow();
        });

        it('should handle API error (e.g., 500) when fetching records', async () => {
            mock.onGet(`${API_URL}?_start=0&_limit=5`).reply(500, { message: 'Internal Server Error' });

            await expect(fetchRecords(0, 5)).rejects.toThrow('Request failed with status code 500');
        });
    });

    describe('addRecord', () => {
        const newRecordData: Omit<Record, 'id'> = {
            fullName: 'Test User',
            department: 'Test Dept',
            position: 'Tester',
            email: 'test@example.com',
            phone: '+79001112233',
            status: 'Активен',
        };

        it('should add a record successfully', async () => {
            const mockResponse: Record = { id: 100, ...newRecordData };
            mock.onPost(API_URL, newRecordData).reply(201, mockResponse);

            const result = await addRecord(newRecordData);
            expect(result).toEqual(mockResponse);
            expect(mock.history.post[0].data).toEqual(JSON.stringify(newRecordData));
        });

        it('should handle network error when adding a record', async () => {
            mock.onPost(API_URL, newRecordData).networkError();

            await expect(addRecord(newRecordData)).rejects.toThrow();
        });

        it('should handle API error (e.g., 400) when adding a record', async () => {
            mock.onPost(API_URL, newRecordData).reply(400, { message: 'Bad Request' });
            await expect(addRecord(newRecordData)).rejects.toThrow('Request failed with status code 400');
        });
    });
});