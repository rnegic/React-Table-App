import styles from './App.module.css'
import CreateRecordForm from './components/Form/CreateRecordForm';
import Table from './components/Table/Table';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>Управление сотрудниками VK</header>
      <section>
        <CreateRecordForm />
      </section>
      <section>
        <Table />
      </section>
    </div>
  )
}

export default App
