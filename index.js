const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
    console.log("MONGO CONNECTION OPEN!")
    })
    .catch(e => {
    console.log("ERROR". e)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

// Show indedx page of all products
app.get('/products', async (req,res) => {
    const products = await Product.find({}) // find everything asynchronously while waiting for mongoose operation
    res.render('products/index', {products})
})

// Serves form
app.get('/products/new', (req, res) => {
    res.render('products/new');
})

// Submits form and creates new product
app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})

// Show details of specific product
app.get('/products/:id', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id)
    res.render('products/show', {product})
})



app.listen(3000, () => {
    console.log("APP LISTENING ON PORT 3000")
})