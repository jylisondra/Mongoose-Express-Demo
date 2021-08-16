const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser:true}), {useUnifiedTopology: true};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/products', async (req,res) => {
    const products = await Product.find({}) // find everything
    res.send('ALL PRODUCTS HERE');
})

app.listen(3000, () => {
    console.log("APP LISTENING ON PORT 3000")
})