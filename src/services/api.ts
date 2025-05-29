import axios from 'axios';
import type { RecordItem, CreateRecordFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const RECORDS_PER_PAGE = 10;

export const fetchRecordsPage = async (page: number): Promise<RecordItem[]> => {
    try {
        const response = await apiClient.get<RecordItem[]>('/records', {
            params: {
                _page: page,
                _limit: RECORDS_PER_PAGE,
                _sort: 'id',
                _order: 'desc',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
        throw error;
    }
};

export const createRecord = async (data: CreateRecordFormData): Promise<RecordItem> => {
    try {
        const response = await apiClient.post<RecordItem>('/records', data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании записи:', error);
        throw error;
    }
};