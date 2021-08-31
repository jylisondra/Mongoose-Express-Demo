const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
    console.log("MONGO CONNECTION OPEN!")
    })
    .catch(e => {
    console.log("ERROR". e)
    })

// Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

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
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/products/${product._id}`)
})

// Edits form
app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product});
})

// PUT request to override object with updated info
app.put('/products/:id', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    console.log(req.body)
    res.redirect(`/products/${product._id}`);
})

// Show details of specific product
app.get('/products/:id', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id)
    res.render('products/show', {product})
})

// Delete specific product
app.delete('/products/:id', async (req,res) => {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products')
})

app.listen(3000, () => {
    console.log("APP LISTENING ON PORT 3000")
})