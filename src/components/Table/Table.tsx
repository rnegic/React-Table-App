import { useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { recordsStore } from '../../store/RecordsStore';
import styles from './Table.module.css';

const statusClass = (status: string) => {
    switch (status) {
        case 'Активен': return styles.statusActive;
        case 'В отпуске': return styles.statusOnLeave;
        case 'Больничный': return styles.statusSickLeave;
        case 'В командировке': return styles.statusBusinessTrip;
        default: return '';
    }
};

const Table = observer(() => {
    const loader = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && recordsStore.hasMore && !recordsStore.isLoading) {
            recordsStore.fetchNext();
        }
    }, []);

    useEffect(() => {
        recordsStore.reset();
        recordsStore.fetchNext();
    }, []);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [handleObserver]);

    return (
        <div className={styles.tableContainer}>
            <div className={styles.title}>Список сотрудников</div>
            <div className={styles.scrollArea}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ФИО</th>
                            <th>Отдел</th>
                            <th>Должность</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Статус</th>
                            <th>Дата найма</th>
                            <th>Локация</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordsStore.records.map(record => (
                            <tr key={record.id}>
                                <td>{record.fullName}</td>
                                <td>{record.department}</td>
                                <td>{record.position}</td>
                                <td>{record.email}</td>
                                <td>{record.phone}</td>
                                <td>
                                    <span className={styles.statusBadge + ' ' + statusClass(record.status)}>
                                        {record.status}
                                    </span>
                                </td>
                                <td>{record.hireDate}</td>
                                <td>{record.officeLocation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {recordsStore.isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <span className={styles.loaderText}>Загрузка...</span>
                </div>
            )}
            <div ref={loader} />
            {!recordsStore.hasMore && (
                <div className={styles.messageCenter}>Все записи загружены</div>
            )}
            {recordsStore.error && (
                <div className={styles.errorMessage}>{recordsStore.error}</div>
            )}
        </div>
    );
});

export default Table;
