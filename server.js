const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, there!')
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

mongoose.connect(process.env.DATA_BASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connection established successfully"))
  .catch(err => console.log("Error in MongoDB connection: ", err));
