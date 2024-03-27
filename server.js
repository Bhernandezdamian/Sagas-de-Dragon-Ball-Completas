require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const { Client } = require('pg');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Conexión a la base de datos
client.connect()
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch(err => console.error('Error al conectar a PostgreSQL', err));

// Configurar la ubicación de los archivos estáticos
app.use(express.static(path.join(__dirname)));

// Endpoint para obtener todos los capítulos de Dragon Ball
app.get('/capitulos', (req, res) => {
  const consulta = 'SELECT * FROM capitulos_dragon_ball';

  client.query(consulta)
    .then(result => {
      const capitulos = result.rows;
      res.json(capitulos);
    })
    .catch(err => {
      console.error('Error al obtener los capitulos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
