const mongoose = require('mongoose');

const ProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    cantidad:{
        type: Number,
        required: true
    },
    precio:{
        type: Number,
        required: true
    },
    disponibilidad:{
        type: Boolean,
        default: true
    },
    descuento: {
        type: Number,
        required: true
    },
    imagen:{
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Producto', ProductoSchema);