const express = require('express')
const app = express()

app.get('/', function(req,res) {
    res.send('Simple Text')
})

app.get('/teachersName', function(req,res) {
    res.json( {thomas: "Thomas Jamais", alban: "Alban Meurice"})
    res.status(200)
})

app.listen(8000, function(){
    console.log('serve turn on localhost:8000 !')
})