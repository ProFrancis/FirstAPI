const express = require('express')
const fs = require('fs')
const app = express()
var array = []
var contentFile = fs.readFileSync('country.json', 'utf-8')
var data = JSON.parse(contentFile)

app.get('/', function(req,res) {
    res.send('Step 2')
    res.status(200)
})

app.get('/all', function(req, res) {
    res.sendFile(__dirname + '/country.json')
    res.status(200)
})
app.get('/name/all', function(req,res) {
    // for(var i = 0; i < data.length; i++){
    //     array.push(data[i].name)
    // }
    const nameCountry = data.map(getName)

    function getName(item){
        return item.name
    }
    res.send(nameCountry)
    res.status(200)
})

app.get('/capitals/all', function(req, res){
    const nameCapital = data.map(getCapital)

    // for(var i = 0; i < data.length; i++){
    //     array.push(data[i].capital)
    // }
    function getCapital(item){
        return item.capital
    }
    res.send(nameCapital)
    res.status(200)
})


app.listen(8000, function() {
    console.log("the server turn on localhost:8000")
})