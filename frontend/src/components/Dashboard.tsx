// src/components/Dashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css'; // Crie um arquivo CSS para estilizar o dashboard
import * as XLSX from 'xlsx'; // Instale a biblioteca XLSX

interface Coleta {
  id: number;
  numero_nf: string;
  transportadora: string;
  volumes: number;
  motorista: string;
  placa: string;
  status: string;
}

const Dashboard = () => {
  const [coletas, setColetas] = useState<Coleta[]>([]);

  const fetchColetas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/coletas');
      setColetas(response.data);
    } catch (error) {
      const errorMessage = (error as any).response 
        ? (error as any).response.data.message || (error as any).response.statusText 
        : (error as any).message;
      console.error('Erro ao buscar coletas:', errorMessage);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(coletas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Coletas');
    XLSX.writeFile(wb, 'coletas.xlsx');
  };

  useEffect(() => {
    fetchColetas();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard de Coletas Pendentes</h2>
      <button onClick={exportToExcel} className={styles.exportButton}>Exportar para Excel</button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Número da NF</th>
            <th>Transportadora</th>
            <th>Volumes</th>
            <th>Motorista</th>
            <th>Placa</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {coletas.length > 0 ? (
            coletas.map((coleta) => (
              <tr key={coleta.id}>
                <td>{coleta.numero_nf}</td>
                <td>{coleta.transportadora}</td>
                <td>{coleta.volumes}</td>
                <td>{coleta.motorista}</td>
                <td>{coleta.placa}</td>
                <td>{coleta.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Nenhuma coleta encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
