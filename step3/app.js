const express = require('express')
const app = express()
const fs = require('fs')
// const bodyParser = require('body-parser');
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// VARIABLES 
var data = getDataApi()
var array = []

app.get('/', function(req,res){
  res.send('Hello')
  res.status(200)
})

app.get('/country/:name', function(req,res){
  data.map(country => {
    if(req.params.name == country.name){
      array.push(country)
    }
  })
  res.status(200)
})

app.get('/regions/:regionName', function(req, res){
  data.map(country => {
    if(req.params.regionName.toUpperCase() == country.region.toUpperCase()){
      array.push(country.name)
    }
  })
  res.send(array)
  res.status(200)
})

app.get('/subregion/:subregionName', function(req, res){
  data.map(country => {
    if(req.params.subregionName.toUpperCase() == country.subregion.toUpperCase()){
      array.push(country.name)
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
    Object.keys(req.body).forEach(keysBody => {
      if(req.params.countryName.toUpperCase() == country.name.toUpperCase()){
        Object.keys(country).forEach(countrykeys => {
          if(keysBody == countrykeys){
           country[keysBody] = req.body[keysBody]
          }
        })
      }
    }) 
  });
  const newDataApi = stringIfyJson(data)
  writeFile(newDataApi)
  res.send()
  res.status(200)
})

app.delete('/countries/:countryName', function(req, res){
  for(let i = 0; i < data.length; i++){
    array.push(data[i])
    if(data[i].name.toUpperCase() == req.params.countryName.toUpperCase()){
      array.splice(i, 1)
    }
  }
  const newDataApi = stringIfyJson(data)
  writeFile(newDataApi)
  res.send()
  res.status(200)
})

app.post('/countries/:countryName', function(req, res){
  const newCountry = req.body
  data.push(newCountry)
  const dataTried = trieArrayByName(data)
  const newDataApi = stringIfyJson(dataTried)
  writeFile(newDataApi)
  res.send()
  res.status(200)
})

app.listen(8000, () => {
  console.log('the serve turn on localhost 8000 ! ')
})

function trieArrayByName(array){
  const arrayTried = [...array].sort((a,b) => a.name.localeCompare(b.name))
  return arrayTried
}

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