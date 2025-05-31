import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { observer } from 'mobx-react-lite';
import { recordSchema } from '../../utils/validationSchema';
import type { CreateRecordFormData } from '../../types';
import { RecordStatusOptions } from '../../types';
import { tableStore } from '../../stores/TableStore';
import styles from './CreateRecordForm.module.css';

const CreateRecordForm = observer(() => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting: isFormSubmitting },
        reset,
    } = useForm<CreateRecordFormData>({
        resolver: zodResolver(recordSchema),
        defaultValues: {
            fullName: '',
            department: '',
            position: '',
            email: '',
            phone: '',
            status: 'Активен',
            hireDate: new Date().toISOString().split('T')[0],
            officeLocation: '',
        },
    });

    const { isSubmitting: isStoreSubmitting, error: storeError, addRecord } = tableStore;
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const onSubmit = async (data: CreateRecordFormData) => {
        setShowSuccessMessage(false);
        const success = await addRecord(data);
        if (success) {
            reset();
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            console.log("запись успешно добавлена");
        } else {
            console.error("Ошибка добавления записи:", tableStore.error);
        }
    };

    const isLoading = isFormSubmitting || isStoreSubmitting;

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Добавить нового сотрудника</h2>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
                {storeError && !isStoreSubmitting && (
                    <div className={`${styles.serverError} ${styles.fullWidth}`}>
                        <span>{storeError}</span>
                        <button type="button" onClick={() => tableStore.error = null} className={styles.closeButton} aria-label="Закрыть ошибку">×</button>
                    </div>
                )}
                {showSuccessMessage && (
                    <div className={`${styles.serverError} ${styles.fullWidth}`} style={{ backgroundColor: '#e6ffed', color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
                        Запись успешно добавлена!
                    </div>
                )}

                <div className={styles.formField}>
                    <label htmlFor="fullName" className={`${styles.label} ${styles.labelRequired}`}>ФИО</label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="Иванов Иван Иванович"
                        {...register('fullName')}
                        className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                        aria-invalid={errors.fullName ? "true" : "false"}
                    />
                    {errors.fullName && <span className={styles.errorMessage}>{errors.fullName.message}</span>}
                </div>

                <div className={styles.formField}>
                    <label htmlFor="department" className={`${styles.label} ${styles.labelRequired}`}>Отдел</label>
                    <input
                        id="department"
                        type="text"
                        placeholder="Отдел разработки"
                        {...register('department')}
                        className={`${styles.input} ${errors.department ? styles.inputError : ''}`}
                        aria-invalid={errors.department ? "true" : "false"}
                    />
                    {errors.department && <span className={styles.errorMessage}>{errors.department.message}</span>}
                </div>

                <div className={styles.formField}>
                    <label htmlFor="position" className={`${styles.label} ${styles.labelRequired}`}>Должность</label>
                    <input
                        id="position"
                        type="text"
                        placeholder="Ведущий разработчик"
                        {...register('position')}
                        className={`${styles.input} ${errors.position ? styles.inputError : ''}`}
                        aria-invalid={errors.position ? "true" : "false"}
                    />
                    {errors.position && <span className={styles.errorMessage}>{errors.position.message}</span>}
                </div>

                <div className={styles.formField}>
                    <label htmlFor="email" className={`${styles.label} ${styles.labelRequired}`}>Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="example@vk.com"
                        {...register('email')}
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                </div>

                <div className={styles.formField}>
                    <label htmlFor="phone" className={`${styles.label} ${styles.labelRequired}`}>Телефон</label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 999-99-99"
                        {...register('phone')}
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        aria-invalid={errors.phone ? "true" : "false"}
                    />
                    {errors.phone && <span className={styles.errorMessage}>{errors.phone.message}</span>}
                </div>

                <div className={styles.formField}>
                    <label htmlFor="status" className={`${styles.label} ${styles.labelRequired}`}>Статус</label>
                    <select
                        id="status"
                        {...register('status')}
                        className={`${styles.select} ${errors.status ? styles.inputError : ''}`}
                        aria-invalid={errors.status ? "true" : "false"}
                    >
                        {RecordStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    {errors.status && <span className={styles.errorMessage}>{errors.status.message}</span>}
                </div>

                <div className={styles.formField}>
                    <label htmlFor="hireDate" className={styles.label}>Дата приема</label>
                    <input
                        id="hireDate"
                        type="date"
                        {...register('hireDate')}
                        className={`${styles.input} ${errors.hireDate ? styles.inputError : ''}`}
                        aria-invalid={errors.hireDate ? "true" : "false"}
                    />
                    {errors.hireDate && <span className={styles.errorMessage}>{errors.hireDate.message}</span>}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="officeLocation" className={styles.label}>Местоположение офиса</label>
                    <input
                        id="officeLocation"
                        type="text"
                        placeholder="Москва"
                        {...register('officeLocation')}
                        className={`${styles.input} ${errors.officeLocation ? styles.inputError : ''}`}
                        aria-invalid={errors.officeLocation ? "true" : "false"}
                    />
                    {errors.officeLocation && <span className={styles.errorMessage}>{errors.officeLocation.message}</span>}
                </div>

                <div className={`${styles.buttonGroup} ${styles.fullWidth}`}>
                    <button type="submit" disabled={isLoading} className={styles.submitButton}>
                        {isLoading ? 'Добавление...' : 'Добавить запись'}
                    </button>
                </div>
            </form>
        </div>
    );
});

export default CreateRecordForm;