const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const roomsRouter = require('./routes/rooms');

app.use(cors());
app.use(express.json());

// Use the users routes
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/rooms', roomsRouter);

app.get('/', (req, res) => {
  res.send('Hello, there!')
});

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

mongoose.connect(process.env.DATA_BASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connection established successfully"))
  .catch(err => console.log("Error in MongoDB connection: ", err));
