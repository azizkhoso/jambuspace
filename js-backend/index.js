require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const compression = require('compression');
const { PORT, NODE_ENV } = require('./config');
const fs = require('fs');
const http = require('http');
const https = require('https');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const Notification = require('./models/Notification');
const mongoose = require('mongoose');
const FileManager = require('./helpers/FileManager');

app.use(bodyParser.json({ limit: '90mb', extended: false }));
app.use(bodyParser.urlencoded({ limit: '90mb', extended: false }));

const privateKey = fs.readFileSync(path.join(__dirname, 'privkey.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'cert.pem'), 'utf8');
const ca = fs.readFileSync(path.join(__dirname, 'chain.pem'), 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const server = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const isProduction = NODE_ENV === 'production';

if (!isProduction) {
  require('dotenv').config();
}
app.use(compression()); // gzip compress responses
require('./startup/logging')(); // logging to files
require('./startup/db')(); // database connection
require('./startup/session')(app); // Initialized session for authentication
require('./startup/securityHeaders')(app); // Setting security headers with helmet module
require('./startup/routes')(app); // Initializing all api routes

if (isProduction) {
  app.use(express.static('client/build'));

  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.use(express.static('../public'));
  app.get('/', (req, res) => {
    res.send('hello');
  });
  // Keeping track of endpoints in development
  const listendpionts = require('express-list-endpoints');
  console.log(
    listendpionts(app).map((r) => {
      const spaces = 22;
      const methods = r.methods.join();
      let remainingSpaces = '';
      for (let i = 0; i < spaces - methods.length; i += 1) {
        remainingSpaces += ' ';
      }
      return `${methods}${remainingSpaces}${r.path}`;
    }),
  );
}

server.listen(PORT, () => {
  console.log(`> 🚀 Server is running on port ${PORT}...`);
});

httpsServer.listen(4001, () => {
  console.log('HTTPS Server running on port 443');
});

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

const messagesNamespace = io.of('/messages');
const notificationsNamespace = io.of('/notifications');

const sendNotification = (payload, users) => {
  // find the socket with userId in sellers
  try {
    const userIds = users.map((u) => u._id.toString()); // making id string because it is ObjectId by default
    notificationsNamespace.sockets.forEach((socket) => {
      if (userIds.includes(socket.handshake.query.userId.toString())) {
        notificationsNamespace
          .to(socket.id)
          .emit('new-notification', { ...payload, user: socket.handshake.query.userId });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

notificationsNamespace.on('connection', (socket) => {
  // getting unread notifications
  socket.on('all-notifications', async () => {
    try {
      const notifications = await Notification.find({
        user: mongoose.Types.ObjectId(socket.handshake.query.userId),
        isRead: false,
      });
      socket.emit('all-notifications', notifications);
    } catch (e) {
      console.log(e);
    }
  });
});

messagesNamespace.on('connection', (socket) => {
  // get all conversations
  socket.on('get-conversations', async () => {
    try {
      const id = socket.handshake.query.userId; // the id of logged in user
      const allConversations = await Conversation.find({ 'users.id': id });
      socket.emit('all-conversations', allConversations);
    } catch (e) {
      console.log(e);
      socket.emit('error', { message: e.message });
    }
  });
  // getting all messages
  socket.on('get-all-messages', async (userId /* messages sent and recieved from */) => {
    try {
      const id = socket.handshake.query.userId; // the id of logged in user
      if (!id || !userId) throw new Error('User ID not supplied');
      // find all messages that are sent from or sent to the user
      const allMessages = await Message.find({
        $and: [
          { $or: [{ 'from.id': id }, { 'from.id': userId }] },
          { $or: [{ 'to.id': id }, { 'to.id': userId }] },
        ],
      }).lean();
      socket.emit('all-messages', allMessages);
    } catch (e) {
      console.log(e);
      socket.emit('error', { message: e.message });
    }
  });
  // getting new message
  socket.on('new-message', async (msg) => {
    try {
      const newMsg = await Message.create(msg);
      socket.emit('new-message', newMsg);
      // find the socket with userId === msg.to.id
      messagesNamespace.sockets.forEach((value) => {
        if (value.handshake.query.userId === msg.to.id) {
          messagesNamespace.to(value.id).emit('new-message', newMsg);
        }
      });
      // creating a new conversation if already does not exist
      const foundConversation = await Conversation.findOne({
        'users.id': { $in: [msg.from.id, msg.to.id] },
      }).lean();
      if (!foundConversation) {
        await Conversation.create({
          users: [msg.from, msg.to],
        });
      }
    } catch (e) {
      socket.emit('error', { message: e.message });
    }
  });
});

module.exports = {
  messagesNamespace,
  sendNotification,
};
