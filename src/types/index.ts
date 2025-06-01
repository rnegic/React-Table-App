export interface Record {
    id: number;
    fullName: string;
    department: string;
    position: string;
    email: string;
    phone: string;
    status: 'Активен' | 'В отпуске' | 'Больничный' | 'В командировке';
    hireDate?: string;
    officeLocation?: string;
}

export type FormValues = Omit<Record, 'id'>;