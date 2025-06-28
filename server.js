const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let connections = [];

wss.on('connection', ws => {
  console.log('🔌 Cliente conectado');
  connections.push(ws);

  ws.on('message', msg => {
    console.log('📨 Mensagem recebida:', msg.toString());
    // Reenvia para todos os outros clientes
    connections.forEach(conn => {
      if (conn !== ws && conn.readyState === WebSocket.OPEN) {
        conn.send(msg);
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ Cliente desconectado');
    connections = connections.filter(conn => conn !== ws);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
  console.log('✅ Servidor rodando em http://localhost:3000');
});
