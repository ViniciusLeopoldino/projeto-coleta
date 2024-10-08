// src/components/NovaEntrada.tsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from './NovaEntrada.module.css';

const NovaEntrada: React.FC = () => {
  const [numero_nf, setNumeroNF] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [volumes, setVolumes] = useState<number>(0);
  const [motorista, setMotorista] = useState('');
  const [placa, setPlaca] = useState('');
  const [status, setStatus] = useState<string>('PENDENTE');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const data = {
      numero_nf,
      transportadora,
      volumes,
      motorista,
      placa,
      status,
    };
  
    setLoading(true); // Inicia o carregamento
    try {
      const response = await axios.post('http://localhost:5000/nova-coleta', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert(response.data.message); // Exibe a mensagem de sucesso
      // Limpa os campos após o registro
      setNumeroNF('');
      setTransportadora('');
      setVolumes(0);
      setMotorista('');
      setPlaca('');
      setStatus('PENDENTE'); // Reseta o status para PENDENTE
    } catch (error) {
      console.error('Erro ao inserir coleta:', error);
      alert('Erro ao inserir coleta: ' + ((error as any).response?.data?.message || (error as any).message));
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Registrar Nova Coleta</h2>
      <input
        type="text"
        placeholder="Número da NF"
        value={numero_nf}
        onChange={(e) => setNumeroNF(e.target.value)}
        required // Torna o campo obrigatório
      />
      <input
        type="text"
        placeholder="Transportadora"
        value={transportadora}
        onChange={(e) => setTransportadora(e.target.value)}
        required // Torna o campo obrigatório
      />
      <input
        type="number"
        placeholder="Quantidade de Volumes"
        value={volumes}
        onChange={(e) => setVolumes(Number(e.target.value))}
        required // Torna o campo obrigatório
      />
      <input
        type="text"
        placeholder="Nome do Motorista"
        value={motorista}
        onChange={(e) => setMotorista(e.target.value)}
        required // Torna o campo obrigatório
      />
      <input
        type="text"
        placeholder="Placa"
        value={placa}
        onChange={(e) => setPlaca(e.target.value)}
        required // Torna o campo obrigatório
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="PENDENTE">Pendente</option>
        <option value="FINALIZADA">Finalizada</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar Coleta'}
      </button>
    </form>
  );
};

export default NovaEntrada;
