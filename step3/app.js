const express = require('express')
const app = express()
const fs = require('fs')
// const bodyParser = require('body-parser');
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.urlencoded({ extended: true })) // support encoded bodies

// VARIABLES 
var data = getDataApi()
var find = false 
var array = []

app.get('/', function(req,res){
  res.send('Hello')
})

app.get('/country/:name', function(req,res){
  const countryName = req.params.name
  data.map(item => {
    if(countryName == item.name){
      find = true
      array.push(item)
    }
  })
})


app.get('/regions/:regionName', function(req, res){
  data.map(val => {
    if(req.params.regionName.toUpperCase() == val.region.toUpperCase()){
      array.push(val.name)
    }
  })
  res.send(array)
  res.status(200)
})

app.get('/subregion/:subregionName', function(req, res){
  data.map(val => {
    if(req.params.subregionName.toUpperCase() == val.subregion.toUpperCase()){
      array.push(val.name)
    }
  })
  res.send(array)
  res.status(200)
})

app.get('/currencies/:currency', function(req, res){
  data.map(country => {
    country.currencies.map(currency => {
      if(req.params.currency === currency.code)
      array.push(country.name)
    })
  })

  const uniqueSet = new Set(array)
  const backToArray = [...uniqueSet]

  res.send(backToArray)
  res.status(200)
})

app.put('/countries/:countryName', function(req, res){
  data.forEach(country => {
    Object.keys(req.body).forEach(allKeys => {
      if(req.params.countryName.toLowerCase() == country.name.toLowerCase()){
        Object.keys(country).forEach(countrykeys => {
          if(allKeys == countrykeys){
           country[allKeys] = req.body[allKeys]
          }
        })
      }
    }) 
  });
  const newDataApi = stringIfyJson(data)
  writeFile(newDataApi)
  res.send()
})

app.delete('/countries/:countryName', function(req, res){
  for(let i = 0; i < data.length; i++){
    array.push(data[i])
    if(data[i].name.toLowerCase() == req.params.countryName.toLowerCase()){
      array.splice(i, 1)
    }
  }
  const newDataApi = stringIfyJson(data)
  writeFile(newDataApi)
  res.send()
})

app.post('/countries/:countryName', function(req, res ){

})

app.listen(8000, () => {
  console.log('the serve turn on localhost 8000 ! ')
})

function stringIfyJson(obj){
  const data = JSON.stringify(obj)
  return data
}

function writeFile(data){
  fs.writeFile('./country.json', data, err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      console.log('Successfully wrote file')
    }
  })
}

function getDataApi(){
  const contentFile = fs.readFileSync('country.json', 'utf-8')
  let data = JSON.parse(contentFile)
  return data
}