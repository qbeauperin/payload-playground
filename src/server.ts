import express from 'express';
import payload from 'payload';

require('dotenv').config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })
  
  // app.listen(3000);

  const http = require('http');
  const server = http.createServer(app);
  server.listen(3000, () => {
    console.log(`HTTP Server running on port ${3000}`);
  });

  // Socket.io
  // Now pass the server instance to socket io, to create a websocket server on the same port
  const io = require('socket.io')(server, {
    cors: {
      origin: 'locahost',
    }
  });

  // io.on('connection', (socket) => {
  //   console.log('New client connected');

  //   socket.on('disconnect', () => {
  //     console.log('Client disconnected')
  //   });
  // })

  // You can't call io.emit directly from the payload hooks, it throws errors. 
  // As a workaround, you can set up a simple endpoint that emits the update 
  app.post('/updateMessages/:docId/', (req, res) => {
    // Check if docId param is provided
    const docId = req?.params?.docId;
    if (!docId) {
      res.sendStatus(404);
      return;
    }
    // Check if authorization header contains PAYLOAD_SECRET
    if (req.headers.authorization !== process.env.PAYLOAD_PUBLIC_SERVER_SECRET) {
      res.sendStatus(401);
      return;
    }
    console.log(`Emitting on ${docId}`);
    io.emit(docId);
  })
}

start();
