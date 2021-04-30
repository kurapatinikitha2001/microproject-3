const express=require('express')
const app=express()
const bodyParser =require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var s;
MongoClient.connect('mongodb://localhost:27017/icecream_parlour',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('icecream_parlour')
    app.listen(5000,()=>{
        console.log('Listening to port number 5000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    var mysort={icid:1}
    db.collection('icecream').find().sort(mysort).toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>{
    res.render('add.ejs')
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs')
})

app.post('/AddData',(req,res)=>{
    const newItem={
        "icid": req.body.icid,
       "flavour":req.body.flavour,
       "price":req.body.price,
       "stock":req.body.stock,
       "size":req.body.size
    }
    db.collection("icecream").insertOne(newItem
    ,(err,result)=>{
        if(err) return res.send(err)
        console.log(req.body.icid+" stock added")
        res.redirect('/')
    })
})
/*app.post('/AddData',(req,res)=>{
    db.collection('icecream').insertOne(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})*/
app.post('/update',(req,res)=>{
    db.collection('icecream').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].icid==req.body.icid){
                s=result[i].stock
                break
            }
        }
        db.collection('icecream').findOneAndUpdate({icid:req.body.icid},{
            $set:{stock:parseInt(s)+parseInt(req.body.stock)}},
            (err,result)=>{
                if(err) return res.send(err)
                console.log(req.body.icid+ ' stock updated')
                res.redirect('/')
            })
    })
})

app.post('/delete',(req,res)=>{
    db.collection('icecream').findOneAndDelete({icid:req.body.id},(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})