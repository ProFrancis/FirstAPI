const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// API DATA
var data = getDataApi()

app.get('/', function(req,res){
  res.send('Hello')
  res.status(200)
})

app.get('/country/:name', function(req,res){
  const array = []
  data.map(country => {
    if(req.params.name.toUpperCase() == country.name.toUpperCase())
      array.push(country)
  })
  checkArray(array, req.params.name, res)
  res.status(200).send(array)
})

app.get('/regions/:regionName', function(req, res){
  const array = []
  data.map(country => {
    if(req.params.regionName.toUpperCase() == country.region.toUpperCase())
      array.push(country.name)
  })
  checkArray(array, req.params.regionName, res)
  res.status(200).send(array)
})

app.get('/subregion/:subregionName', function(req, res){
  const array = []
  data.map(country => {
    if(req.params.subregionName.toUpperCase() == country.subregion.toUpperCase()){
      array.push(country.name)
    }
  })
  checkArray(array, req.params.subregionName, res)
  res.status(200).send(array)
})

app.get('/currencies/:currency', function(req, res){
  const array = []
  data.map(country => {
    country.currencies.map(currency => {
      if(req.params.currency == currency.name) array.push(country.name)
    })
  })
  checkArray(array, req.params.currency, res)
  res.status(200).send(array)
})

app.put('/countries/:countryName', function(req, res){
  let checkParams = false
  data.forEach(country => {
    Object.keys(req.body).forEach(keysBody => {
      if(req.params.countryName.toUpperCase() == country.name.toUpperCase()){
        checkParams = true
        Object.keys(country).forEach(countrykeys => {
          if(keysBody == countrykeys){
           country[keysBody] = req.body[keysBody]
          }
        })
      }
    }) 
  });
  if(!checkParams) return res.status(404).send("COUNTRY " + req.params.countryName + " NOT FOUND IN FILE JSON!")
  const newDataApi = stringIfyJson(data)
  writeFile(newDataApi)
  res.status(200).send(newDataApi)
})

app.delete('/countries/:countryName', function(req, res){
  const array = []
  let checkParams = false
  for(let i = 0; i < data.length; i++){
    array.push(data[i])
    if(req.params.countryName.toUpperCase() == data[i].name.toUpperCase()){
      checkParams = true
      array.splice(i, 1)
    }
  }
  if(!checkParams) return res.status(404).send("CANNOT FIND " + req.params.countryName + " IN FILE JSON IS DELETED!")
  const newDataApi = stringIfyJson(array)
  writeFile(newDataApi)
  res.status(200).send(req.params.countryName + " IS DELETE IN FILE JSON NOW" )
})

app.post('/countries/:countryName', function(req, res){
  const newCountry = req.body
  data.map(country => {
    if(country.name.toUpperCase() == req.body.name.toUpperCase()){
      return res.status(404).send("this country " + req.body.name +  " already exists!")
    }else if(req.body.name == ""){
      return res.status(404).send(" CANNOT CREAT COUNTRY WITH VALUE NAME EMPTY")
    }
  })
  data.push(newCountry)
  const dataTried = trieArrayByName(data)
  const newDataApi = stringIfyJson(dataTried)
  writeFile(newDataApi)
  res.status(200).send(req.body)
})

app.use(function(req, res) {
  res.type('text/plain')
  res.status(400).send('404 PAGE NOT FOUND');
});

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
      console.log('Successfully write file')
    }
  })
}

function getDataApi(){
  const contentFile = fs.readFileSync('country.json', 'utf-8', function(err){
    if(err){
      console.log(err)
    }else {
      console.log(' SUCCESS READ FILE! ')
    }
  })
  let data = JSON.parse(contentFile)
  return data
}

function checkArray(array, params, res, req){
  if(array.length == 0) return res.status(404).send("STATUS 404 => " + params + " NOT FOUND IN DATA API.")
}