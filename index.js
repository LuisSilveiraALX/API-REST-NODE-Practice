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
app.use(express.json()); // receive data with content-type app /json
app.use(express.urlencoded({extended:true})) // conversor form-urlencoded to json object

// Routes
const routes_articles = require('./routes/article')

// Load Routes
app.use('/api', routes_articles);

//  Rutes test
app.get('/test', (request, response) => {

    console.log('Ejecute endpoint test')
    return response.status(200).send({
        autor: "Luis Silveira"
    });
})
app.get('/', (request, response) => {
    return response.status(200).send(
        "<h1>Create api rest with NodeJS</h1>"
    );
})

// Create server and listen requests HTTP
app.listen(port, () => {
    console.log(`Server run on port ${port}`)
})