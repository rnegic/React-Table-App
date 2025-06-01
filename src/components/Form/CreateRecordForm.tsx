import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recordSchema } from '../../utils/validationSchema';
import { recordsStore } from '../../store/RecordsStore';
import type { FormValues } from '../../types';
import { observer } from 'mobx-react-lite';
import styles from './CreateRecordForm.module.css';

const defaultValues: FormValues = {
    fullName: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    status: 'Активен',
    hireDate: '',
    officeLocation: '',
};

const CreateRecordForm = observer(() => {
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({
        resolver: zodResolver(recordSchema),
        mode: 'onChange',
        defaultValues,
    });

    const onSubmit = async (data: FormValues) => {
        await recordsStore.addRecord(data);
        reset();
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.title}>Добавить сотрудника</div>
            {recordsStore.isAdding && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}
            <form className={styles.form} id='form' onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formField}>
                    <label className={styles.label + ' ' + styles.labelRequired}>ФИО</label>
                    <input {...register('fullName')} className={styles.input + (errors.fullName ? ' ' + styles.inputError : '')} placeholder="ФИО" />
                    <span className={styles.errorMessage}>{errors.fullName?.message}</span>
                </div>
                <div className={styles.formField}>
                    <label className={styles.label + ' ' + styles.labelRequired}>Отдел</label>
                    <input {...register('department')} className={styles.input + (errors.department ? ' ' + styles.inputError : '')} placeholder="Отдел" />
                    <span className={styles.errorMessage}>{errors.department?.message}</span>
                </div>
                <div className={styles.formField}>
                    <label className={styles.label + ' ' + styles.labelRequired}>Должность</label>
                    <input {...register('position')} className={styles.input + (errors.position ? ' ' + styles.inputError : '')} placeholder="Должность" />
                    <span className={styles.errorMessage}>{errors.position?.message}</span>
                </div>
                <div className={styles.formField}>
                    <label className={styles.label + ' ' + styles.labelRequired}>Email</label>
                    <input {...register('email')} className={styles.input + (errors.email ? ' ' + styles.inputError : '')} placeholder="Email" />
                    <span className={styles.errorMessage}>{errors.email?.message}</span>
                </div>
                <div className={styles.formField}>
                    <label className={styles.label + ' ' + styles.labelRequired}>Телефон</label>
                    <input {...register('phone')} className={styles.input + (errors.phone ? ' ' + styles.inputError : '')} placeholder="Телефон" />
                    <span className={styles.errorMessage}>{errors.phone?.message}</span>
                </div>
                <div className={styles.formField}>
                    <label className={styles.label + ' ' + styles.labelRequired}>Статус</label>
                    <select {...register('status')} className={styles.select + (errors.status ? ' ' + styles.inputError : '')}>
                        <option value="Активен">Активен</option>
                        <option value="В отпуске">В отпуске</option>
                        <option value="Больничный">Больничный</option>
                        <option value="В командировке">В командировке</option>
                    </select>
                    <span className={styles.errorMessage}>{errors.status?.message}</span>
                </div>
                <div className={styles.formField}>
                    <label className={styles.label}>Дата найма</label>
                    <input {...register('hireDate')} type="date" className={styles.input + (errors.hireDate ? ' ' + styles.inputError : '')} />
                    <span className={styles.errorMessage}>{errors.hireDate?.message}</span>
                </div>
                <div className={styles.formField}>
                    <label className={styles.label}>Локация офиса</label>
                    <input {...register('officeLocation')} className={styles.input + (errors.officeLocation ? ' ' + styles.inputError : '')} placeholder="Локация офиса" />
                    <span className={styles.errorMessage}>{errors.officeLocation?.message}</span>
                </div>
            </form>
            <div className={styles.buttonGroup}>
                <button type="submit" form='form' className={styles.submitButton} disabled={!isValid || recordsStore.isAdding}>
                    {recordsStore.isAdding ? 'Добавление...' : 'Добавить'}
                </button>
            </div>
        </div>
    );
});

export default CreateRecordForm;
