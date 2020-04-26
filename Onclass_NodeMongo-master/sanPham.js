const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';
var url = 'mongodb+srv://binhdq:abc@123@cluster0-lkrga.mongodb.net/test?retryWrites=true&w=majority';

router.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    let results = await dbo.collection("SanPham").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

router.get('/edit', async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    let result = await dbo.collection("SanPham").findOne({"_id" : ObjectID(id)});
    res.render('editSanPham',{sanPham:result});

})
//update SP
router.post('/edit', async(req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let price = req.body.gia;
    let newValues ={$set : {TenSP: name,Price:price}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    await dbo.collection("SanPham").updateOne(condition,newValues);
    //
    let results = await dbo.collection("SanPham").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

//sanpham/insert->browser
router.get('/insert',(req,res)=>{
    res.render('insertProduct');
})
router.post('/insert',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    let name = req.body.tenSP;
    let gia = req.body.giaSP;
    let newSP = {TenSP : name, Gia:gia};
    await dbo.collection("SanPham").insertOne(newSP);
   
    let results = await dbo.collection("SanPham").find({}).toArray();
    res.render('allSanPham',{sanPham:results});
})

//sanpham/search->browser
router.get('/search',(req,res)=>{
    res.render('searchSanPham');
})

//sanpham/search ->post
router.post('/search',async (req,res)=>{
    let searchSP = req.body.tenSP;
    let client= await MongoClient.connect(url);
    let dbo = client.db("NoSQLBoosterSamples");
    let results = await dbo.collection("SanPham").find({"TenSP":searchSP}).toArray();
    res.render('allSanPham',{sanPham:results});
})

module.exports = router;