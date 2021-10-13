const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Product = require('./models/product')
const Farm = require('./models/farm')

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
    console.log("MONGO CONNECTION OPEN!")
    })
    .catch(e => {
    console.log("ERROR", e)
    })

// Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

// Show index page of all products
app.get('/products', async (req,res) => {
    const {category}  = req.query // CHecks if there is a query for category
    if (category) {
        const products = await Product.find({category})
        res.render('products/index', {products, category})
    } else {
        // find everything asynchronously while waiting for mongoose operation
        const products = await Product.find({}) 
        res.render('products/index', {products, category: 'All'})
    }
})

/*--- FARM ROUTES --- */

// Shows all farms
app.get('/farms', async (req,res) => {
    const farms = await Farm.find({});
    res.render('farms/index', {farms})
})

// Serves form
app.get('/farms/new', (req,res) => {
    res.render('farms/new')
})

// submits new farm form
app.post('/farms', async (req,res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/farms')
})

// View specific farm
app.get('/farms/:id', async (req,res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id).populate('products');
    res.render('farms/show', {farm})
})

// New product form
app.get('/farms/:id/products/new', async (req,res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    // Pass in entire farm to get Id, name, etc
    res.render('products/new', {farm});
})

// POST product form data
app.post('/farms/:id/products', async (req,res) => {
    // first finds farm that is associated via id
    const {id} = req.params;
    const farm = await Farm.findById(id);

    // Singles out specific fields that are sent to body
    const {name, price, category} = req.body;

    // Passes into new product
    const product = new Product({name, price, category});
    
    // connects product to farm by pushing product to products array (that stores ID) in farm 
    farm.products.push(product);
    // farm found from await Farm.findById
    product.farm = farm; 

    await farm.save();
    await product.save(); 
    res.redirect(`/farms/${farm._id}`)
})


/* --- PRODUCT ROUTES --- */  

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
    const product = await Product.findById(id).populate('farm');
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