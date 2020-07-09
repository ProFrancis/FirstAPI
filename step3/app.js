const express = require('express')
const app = express()
const fs = require('fs')
var data = getDataApi()
var obj = []
var currency = []
var find = false 


app.get('/', function(req,res){
    res.send('Hello')
})

app.get('/country/:name', function(req,res){
    const urlName = req.params.name

    data.map(item => {
      if(urlName == item.name){
        find = true
        obj.push(item)
      }
    })
    if(find == true){
      res.send(obj)
      res.status(200)
      console.log("SUCESS => ", find)
    }else{
      res.send({ error: 404, message: "Not country"})
    }
})

app.get('/regions/:regionName', function(req, res){
    data.map(val => {
      if(req.params.regionName.toUpperCase() == val.region.toUpperCase()){
        obj.push(val.name)
      }
    })
    res.send(obj)
    res.status(200)
})

app.get('/subregion/:subregionName', function(req, res){
  data.map(val => {
    if(req.params.subregionName.toUpperCase() == val.subregion.toUpperCase()){
      obj.push(val.name)
    }
  })
  res.send(obj)
  res.status(200)
})

app.get('/currencies/:currency', function(req, res){
  
  data.map(val => {
      val.currencies.map(j => {
        if(req.params.currency === j.code)
        obj = []
        obj.push(val.name)
      })
  })
  const uniqueSet = new Set(obj)
  const backToArray = [...uniqueSet]

  res.send(backToArray)
  res.status(200)
})

app.listen(8000, () => {
    console.log('the serve turn on localhost 8000 ! ')
})

function getDataApi(){
    const contentFile = fs.readFileSync('country.json', 'utf-8')
    let data = JSON.parse(contentFile)
    return data
}