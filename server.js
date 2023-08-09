const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Message = require('./models/Message');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join room', (roomId) => {
        socket.join(roomId);
    });

    socket.on('chat message', async (data) => {
        const { content, sender, room } = data;

        const newMessage = new Message({ content, sender, room });
        try {
            await newMessage.save();
            io.to(room).emit('chat message', newMessage); // send message only to the specific room
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
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
