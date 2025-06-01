import { makeAutoObservable, runInAction } from 'mobx';
import type { Record } from '../types';
import * as api from '../services/api';

class RecordsStore {
    records: Record[] = [];
    isLoading = false;
    isAdding = false;
    hasMore = true;
    error: string | null = null;
    page = 0;
    limit = 5;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchNext() {
        if (this.isLoading || !this.hasMore) return;
        this.isLoading = true;
        try {
            const newRecords = await api.fetchRecords(this.page * this.limit, this.limit);
            runInAction(() => {
                this.records = [...this.records, ...newRecords];
                this.hasMore = newRecords.length === this.limit;
                this.page += 1;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.message || 'Ошибка загрузки';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async addRecord(record: Omit<Record, 'id'>) {
        this.isAdding = true;
        try {
            const newRecord = await api.addRecord(record);
            runInAction(() => {
                this.records = [newRecord, ...this.records];
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.message || 'Ошибка добавления';
            });
        } finally {
            runInAction(() => {
                this.isAdding = false;
            });
        }
    }

    reset() {
        this.records = [];
        this.page = 0;
        this.hasMore = true;
        this.error = null;
    }
}

export const recordsStore = new RecordsStore(); 