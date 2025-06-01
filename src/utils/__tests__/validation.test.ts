// src/utils/__tests__/validation.test.ts
import { recordSchema } from '../validationSchema';
import type { FormValues } from '../../types';

describe('recordSchema validation', () => {
    const validBaseData: FormValues = {
        fullName: 'Иванов Иван Иванович',
        department: 'Отдел Разработки',
        position: 'Разработчик',
        email: 'ivan.ivanov@example.com',
        phone: '+79991234567',
        status: 'Активен',
    };

    it('should validate a record with all valid required fields', () => {
        const result = recordSchema.safeParse(validBaseData);
        expect(result.success).toBe(true);
    });

    it('should validate a record with all valid fields, including optional ones', () => {
        const fullValidData: FormValues = {
            ...validBaseData,
            hireDate: '2023-01-15',
            officeLocation: 'Офис А, Кабинет 10',
        };
        const result = recordSchema.safeParse(fullValidData);
        expect(result.success).toBe(true);
    });

    it('should fail validation if fullName is too short', () => {
        const invalidData = { ...validBaseData, fullName: 'Ива' };
        const result = recordSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('ФИО должно содержать не менее 5 символов');
        }
    });

    it('should fail validation if department is too short', () => {
        const invalidData = { ...validBaseData, department: 'От' };
        const result = recordSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('Отдел должен содержать не менее 3 символов');
        }
    });

    it('should fail validation if position is too short', () => {
        const invalidData = { ...validBaseData, position: 'Р' };
        const result = recordSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('Должность должна содержать не менее 2 символов');
        }
    });

    it('should fail validation if email is invalid', () => {
        const invalidData = { ...validBaseData, email: 'invalid-email' };
        const result = recordSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('Некорректный формат email');
        }
    });

    it('should fail validation if phone is invalid', () => {
        const invalidData = { ...validBaseData, phone: '123' };
        const result = recordSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('Некорректный формат номера телефона (например, +7 999 999 99 99)');
        }
    });

    it('should fail validation if status is not one of the allowed values', () => {
        const invalidData = { ...validBaseData, status: 'Неизвестен' };
        const result = recordSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('Необходимо выбрать статус');
        }
    });

    it('should fail validation if hireDate is invalid', () => {
        const invalidData = { ...validBaseData, hireDate: 'invalid-date' };
        const result = recordSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('Некорректная дата');
        }
    });

    it('should pass validation if optional fields are missing', () => {
        const dataWithoutOptional: Omit<FormValues, 'hireDate' | 'officeLocation'> = {
            fullName: 'Тест Тестович',
            department: 'Тест',
            position: 'Тест',
            email: 'test@test.com',
            phone: '+79001112233',
            status: 'Активен',
        };
        const result = recordSchema.safeParse(dataWithoutOptional);
        expect(result.success).toBe(true);
    });
});