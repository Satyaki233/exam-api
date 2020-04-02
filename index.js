const excel = require("xlsx")
const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const morgan=require('morgan');

const pg = require('pg')

const app = express()
app.use(bodyParser.json())
app.use(morgan('dev'));
app.use(cors())



const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
      host :'localhost',
      user : 'postgres',
      password :'test',
      database :'exam'
    }
  });


  knex.schema.hasTable('test').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('test', function(t) {
        t.increments('id').primary();
        t.text('name');
        t.integer('class');
        t.integer('roll');
        t.integer('score');
        
      });
    }
  });
  knex.schema.hasTable('test1').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('test1', function(t) {
        t.increments('id').primary();
        t.text('name');
        t.integer('fine');
        
        
      });
    }
  });

  knex.schema.hasTable('paper').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('paper', function(t) {
        t.increments('id').primary();
        t.string('Chapter',50)
        t.text('Question');
        t.text('A');
        t.text('B');
        t.text('C');
        t.text('D');
        t.text('Right');
        t.text('specification')   
        
        
      });
    }
  });

 


const wp = excel.readFile('book5.xlsx',{cellDates:true})

const ws = wp.Sheets['Sheet2']
const data = excel.utils.sheet_to_json(ws)
const data1 = JSON.stringify(data)

// const newDb = data.map(function(record){
//   console.log(record.Right)
// })

// console.log(data)


app.get('/',(req,res)=>{
 res.json({message:'it is working'})
})

app.post('/ok',(req,res)=>{
   const chapter = req.body.name
   knex('paper').where({
  Chapter:chapter
  }).select('*')
  .then(data=>{
    res.json(data)
  })
  .catch(err=>{
    res.json(err)
  })
 
   
})



const storage = multer.diskStorage({
  destination: function (req,file,cb) {
    cb(null,'./uploads/');
  },
  filename: function (req,file,cb) {
    cb(null,file.originalname);
  }
}) ;

const fileFilter =(req,file,cb)=>{
  if(file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
    cb(null,true);
  }
  else{
    cb(null,false);
  }
}

const upload = multer({
  storage:storage,
  fileFilter:fileFilter

})

app.post('/try',upload.single('file2'),(req,res)=>{
  console.log(req.file) 

  console.log(req.file.path)
  const wp3 = excel.readFile(req.file.path,{cellDates:true})
  const ws3  = wp3.Sheets[req.body.sheet]
  const data = excel.utils.sheet_to_json(ws3)
  console.log(data)
  data.map(function(record){
    knex('paper')
    .returning('*')
    .insert({
      Chapter:req.body.name,
      Question: record.Question,
      A:record.A,
      B:record.B,
      C:record.c,
      D:record.D,
      Right:record.Right,
      specification:record.Specifications
    })
    .then(data=>{
      console.log(data)

      
    })
    .catch(err=>{
      console.log(err)
    })
   
     
  })

  res.json('success')
       
})

app.listen('3001',()=>{
    console.log('server is running')
})