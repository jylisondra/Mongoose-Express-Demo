const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser:true}), {useUnifiedTopology: true};

// const p = new Product( {
//     name: 'Ruby Grapefruit',
//     price: 1.99,
//     category: 'fruit'
// })

// p.save().then(p => {
//     console.log(p)
// })
// .catch(e => {
//     console.log(e)
// })

const seedProducts = [
    {
        name: 'Banana',
        price: 1.99,
        category: 'fruit'
    },
    {
        name: 'Raspberry',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Peach',
        price: 2.99,
        category: 'fruit'
    },
    {
        name: 'Spinach',
        price: 1.99,
        category: 'vegetable'
    }, 
    {
        name: 'Green Beans',
        price: 2.50,
        category: 'vegetable'
    },
    {
        name: 'Milk',
        price: 2.99,
        category: 'dairy'
    },
    {
        name: 'Cheese',
        price: 1.99,
        category: 'dairy'
    }
]
Product.insertMany(seedProducts)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})