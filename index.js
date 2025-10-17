// index.js
const { app } = require("./src/app.js");
const { conn } = require("./src/db.js");

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

async function startServer() {
  try {
    // PASO 1: Inicia el servidor INMEDIATAMENTE
    const server = app.listen(PORT, HOST, () => {
      console.log(`✅ Server listening on http://${HOST}:${PORT}`);
      console.log(`📚 API Docs available at http://${HOST}:${PORT}/api-doc`);
    });

    // PASO 2: Intenta conectar a la base de datos en background
    console.log('🔄 Attempting database connection...');
    
    // Primero verifica la conexión
    await conn.authenticate();
    console.log('✅ Database connection established');
    
    // Luego sincroniza las tablas
    await conn.sync({ alter: true });
    console.log('✅ Database models synced');

    // Manejo de errores del servidor
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    
    // Si es error de base de datos, el servidor puede seguir corriendo
    if (error.name === 'SequelizeConnectionError') {
      console.warn('⚠️  Server running but database connection failed');
      console.warn('Database operations will not work until connection is established');
    } else {
      // Para otros errores, salir
      process.exit(1);
    }
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();