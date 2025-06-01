import axios from 'axios';
import type { Record } from '../types';

const API_URL = 'http://localhost:3001/records';

export const fetchRecords = async (start = 0, limit = 5): Promise<Record[]> => {
    const response = await axios.get<Record[]>(`${API_URL}?_start=${start}&_limit=${limit}`);
    return response.data;
};

export const addRecord = async (record: Omit<Record, 'id'>): Promise<Record> => {
    const response = await axios.post<Record>(API_URL, record);
    return response.data;
}; 