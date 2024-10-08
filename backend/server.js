const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');  

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Iniciar conexão com Oracle DB
db.initialize();

// Rota para inserir nova coleta (sem a assinatura)
app.post('/nova-coleta', async (req, res) => {
  const { numero_nf, transportadora, volumes, motorista, placa, status } = req.body;

  try {
    const connection = await db.getConnection(); // Use a função correta para obter a conexão
    const result = await connection.execute(
      `INSERT INTO Coletas (numero_nf, transportadora, volumes, motorista, placa, status)
       VALUES (:numero_nf, :transportadora, :volumes, :motorista, :placa, :status)`,
      [numero_nf, transportadora, volumes, motorista, placa, status],
      { autoCommit: true }
    );
    res.status(200).send({ message: "Coleta inserida com sucesso!" });
  } catch (error) {
    console.error('Erro ao registrar coleta:', sanitizeError(error)); // Loga o erro no servidor
    res.status(500).send({ message: 'Erro ao registrar coleta.' });
  }
});

// Função para obter coletas do banco de dados
const obterColetasDoBancoDeDados = async () => {
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(`SELECT * FROM Coletas`);
    return result.rows.map(row => ({
      id: row[0],
      numero_nf: row[1],
      transportadora: row[2],
      volumes: row[3],
      motorista: row[4],
      placa: row[5],
      status: row[6],
    }));
  } catch (error) {
    console.error('Erro ao obter coletas:', sanitizeError(error));
    throw error; // Re-throw the error for handling in the route
  }
};

// Função para sanitizar erros
const sanitizeError = (error) => {
  const { name, message, stack } = error; // Exclui propriedades que podem causar referência circular
  return { name, message, stack }; // Retorna apenas informações essenciais
};

// Rota para listar coletas do dia
app.get('/coletas', async (req, res) => {
  try {
    const coletas = await obterColetasDoBancoDeDados();
    res.json(coletas);
  } catch (error) {
    console.error('Erro ao buscar coletas:', sanitizeError(error));
    res.status(500).json({ message: 'Erro ao buscar coletas', error: error.message });
  }
});

// Finalizar conexão ao encerrar o app
process.on('SIGINT', async () => {
  await db.close(); // Fechar a pool de conexões
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
