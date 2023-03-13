const { connection } = require('./database/connection')
const express = require('express');
const cors = require('cors');

// Start APP
console.log('Hello, World')

// Connect to database
connection()

// Create Server Node
const app = express();
const port = 3001;

// Cors
 app.use(cors()); 

// Convert body to JS object
app.use(express.json());

// Create Rutes

// Create server and listen requests HTTP
app.listen(port, () => {
    console.log(`Server run on port ${port}`)
})