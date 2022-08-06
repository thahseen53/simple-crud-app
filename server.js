const express = require('express');
const bodyParser=require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient

require('dotenv').config()


MongoClient.connect(process.env.MONGO_URI, {useUnifiedTopology: true})
    .then(client =>{
        console.log('connected DB')
        const db =client.db('yodas-quotes')
        const quotesCollection =db.collection('quotes')
        
        app.set('view engine','ejs')
        app.use(express.static('public'))
        app.use(bodyParser.urlencoded({ extended: true}))
        app.use(bodyParser.json())
        app.listen(process.env.PORT || 3000,function(){
            console.log('hi there!')
        })
        app.get('/', function(req, res){
            db.collection('quotes').find().toArray()
                .then(quotes => {
                    console.log(quotes)
                    res.render('index.ejs',{ quotes: quotes})
                })
                .catch(error => console.log(error))
                 
        })
        
        app.post('/quotes',(req, res)=>{
            quotesCollection.insertOne(req.body)
                .then(result =>{
                    res.redirect('/')
                })
                .catch(error => console.log(error))
            console.log('hellloooo posted')
        })
        app.put('/quotes',(req,res) =>{
            quotesCollection.findOneAndUpdate(
                { name: 'yoda'},
                {
                    $set : {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert:true
                }
            )
            .then(result =>{
                res.json('Success')
            })
            .catch(error => console.log(error))
        })
        app.delete('/quotes',(req,res)=>{
            quotesCollection.deleteOne(
                { name: req.body.name}
            )
            .then(result =>{
                if(result.deletedCount === 0){
                    return res.json('No quote to delete')
                }
                res.json('Deleted Darth Vaders Quote')
            })
            .catch(error => console.log(error))
        })
    })
    .catch(error => console.error(error))





