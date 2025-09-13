const http = require('http');

// Health check для Docker контейнера Хранителя
function healthCheck() {
  const options = {
    hostname: '127.0.0.1',
    port: process.env.KEEPER_OFFLINE_PORT || 3001,
    path: '/health',
    method: 'GET',
    timeout: 2000
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Keeper health check passed');
      process.exit(0);
    } else {
      console.log('❌ Keeper health check failed - Status:', res.statusCode);
      process.exit(1);
    }
  });

  req.on('error', (error) => {
    console.log('❌ Keeper health check failed - Error:', error.message);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('❌ Keeper health check failed - Timeout');
    req.destroy();
    process.exit(1);
  });

  req.end();
}

// Запуск health check
healthCheck();
