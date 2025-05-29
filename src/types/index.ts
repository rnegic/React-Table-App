export interface RecordItem {
    id: string;
    fullName: string;
    department: string;
    position: string;
    email: string;
    phone: string;
    status: 'Активен' | 'В отпуске' | 'Больничный' | 'В командировке';
    hireDate?: string;
    officeLocation?: string;
}

export type CreateRecordFormData = Omit<RecordItem, 'id'>;

export const RecordStatusOptions = [
    { value: 'Активен', label: 'Активен' },
    { value: 'В отпуске', label: 'В отпуске' },
    { value: 'Больничный', label: 'Больничный' },
    { value: 'В командировке', label: 'В командировке' },
];