import { makeAutoObservable, runInAction } from 'mobx';
import { fetchRecordsPage, createRecord, RECORDS_PER_PAGE } from '../services/api';
import type { RecordItem, CreateRecordFormData } from '../types';

class TableStore {
    records: RecordItem[] = [];
    isLoading = false;
    isLoadingMore = false;
    isSubmitting = false;
    error: string | null = null;
    page = 1;
    hasMore = true;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchInitialRecords() {
        if (this.isLoading || this.records.length > 0) return;
        this.isLoading = true;
        this.error = null;
        this.page = 1;
        try {
            const newRecords = await fetchRecordsPage(this.page);
            runInAction(() => {
                this.records = newRecords;
                this.hasMore = newRecords.length === RECORDS_PER_PAGE;
                this.isLoading = false;
                if (this.hasMore) {
                    this.page++;
                }
            });
        } catch (e) {
            runInAction(() => {
                this.error = 'Не удалось загрузить данные.';
                this.isLoading = false;
            });
        }
    }

    async fetchMoreRecords() {
        if (this.isLoadingMore || !this.hasMore || this.isLoading) return;
        this.isLoadingMore = true;
        this.error = null;
        try {
            const newRecords = await fetchRecordsPage(this.page);
            runInAction(() => {
                this.records.push(...newRecords);
                this.hasMore = newRecords.length === RECORDS_PER_PAGE;
                if (this.hasMore) {
                    this.page++;
                }
                this.isLoadingMore = false;
            });
        } catch (e) {
            runInAction(() => {
                this.error = 'Не удалось загрузить больше данных.';
                this.isLoadingMore = false;
            });
        }
    }

    async addRecord(data: CreateRecordFormData) {
        this.isSubmitting = true;
        this.error = null;
        try {
            const newRecord = await createRecord(data);
            runInAction(() => {
                this.records = [newRecord, ...this.records];
                this.isSubmitting = false;
            });
            return true;
        } catch (e) {
            runInAction(() => {
                this.error = 'Не удалось добавить запись.';
                this.isSubmitting = false;
            });
            return false;
        }
    }
}

export const tableStore = new TableStore();