const mongoose = require('mongoose');
const {Schema} = mongoose;

const farmSchema = new Schema({

    name: {
        type:String,
        required: [true, 'Farm must have name']
    },
    city: {
        type:String
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

// Creating and exporting Farm model so that
// it can be used in other parts of the program
const Farm = mongoose.model('Farm', farmSchema);
module.exports = Farm;