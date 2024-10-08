const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: "rm557047", // seu nome de usuário
  password: "280595", // sua senha
  connectString: "oracle.fiap.com.br:1521/orcl" // string de conexão
};

let pool;

async function initialize() {
  console.log("Iniciando conexão com o banco de dados...");
  try {
    pool = await oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      poolMin: 1, // Número mínimo de conexões no pool
      poolMax: 10, // Número máximo de conexões no pool
      poolIncrement: 1, // Número de conexões a serem adicionadas ao pool quando necessário
    });
    console.log('Pool de conexões criada com sucesso.');
  } catch (error) {
    console.error('Erro ao criar pool de conexões:', error.message); // Loga a mensagem de erro
    throw error; // Lança o erro para que possa ser tratado em outro lugar
  }
}

async function close() {
  try {
    if (pool) {
      await pool.close(0); // Força o fechamento da pool de conexões
      console.log('Pool de conexões fechada com sucesso.');
    }
  } catch (error) {
    console.error('Erro ao fechar pool de conexões:', error.message); // Loga a mensagem de erro
  }
}

// Função para obter uma conexão do pool
async function getConnection() {
  if (!pool) {
    throw new Error("Pool de conexões não inicializada. Por favor, chame initialize() primeiro.");
  }
  
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Erro ao obter conexão:', error.message); // Loga a mensagem de erro
    throw error; // Lança o erro para que possa ser tratado em outro lugar
  }
}

// Função para obter coletas do banco de dados
async function obterColetasDoBancoDeDados() {
  let connection;

  try {
    connection = await getConnection(); // Obtém a conexão do pool
    console.log("Conexão ao banco de dados estabelecida.");

    const result = await connection.execute('SELECT * FROM Coletas'); // Realiza a consulta
    console.log("Resultado da consulta:", result.rows);

    return result.rows; // Retorna apenas as linhas
  } catch (error) {
    console.error('Erro ao executar consulta:', error.message); // Loga a mensagem de erro
    throw new Error('Erro ao executar a consulta no banco de dados'); // Lança um erro simples
  } finally {
    if (connection) {
      try {
        await connection.close(); // Fecha a conexão
        console.log("Conexão ao banco de dados fechada.");
      } catch (closeError) {
        console.error('Erro ao fechar a conexão:', closeError.message); // Loga a mensagem de erro
      }
    }
  }
}

// Exportar as funções
module.exports = {
  initialize,
  close,
  getConnection, // Exporta a função para obter conexão
  obterColetasDoBancoDeDados, // Exporta a função para obter coletas
};
