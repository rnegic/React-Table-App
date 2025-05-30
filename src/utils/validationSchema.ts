import { z } from 'zod';

const phoneRegex = new RegExp(
    /^(\+7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/
);

export const recordSchema = z.object({
    fullName: z.string().min(5, { message: "ФИО должно содержать не менее 5 символов" }),
    department: z.string().min(3, { message: "Отдел должен содержать не менее 3 символов" }),
    position: z.string().min(2, { message: "Должность должна содержать не менее 2 символов" }),
    email: z.string().email({ message: "Некорректный формат email" }),
    phone: z.string().regex(phoneRegex, { message: "Некорректный формат номера телефона (например, +7 999 999 99 99)" }),
    status: z.enum(['Активен', 'В отпуске', 'Больничный', 'В командировке'], {
        errorMap: () => ({ message: "Необходимо выбрать статус" }),
    }),
    hireDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
        message: "Некорректная дата",
    }),
    officeLocation: z.string().optional(),
});