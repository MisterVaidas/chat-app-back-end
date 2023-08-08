const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); 
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const roomsRouter = require('./routes/rooms');
const messagesRouter = require('./routes/messages');

app.use(cors());
app.use(express.json());

// Use the routes
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/rooms', roomsRouter);
app.use('/messages', messagesRouter);

app.get('/', (req, res) => {
  res.send('Hello, there!')
});

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

mongoose.connect(process.env.DATA_BASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connection established successfully"))
  .catch(err => console.log("Error in MongoDB connection: ", err));
