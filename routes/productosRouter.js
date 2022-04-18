const express = require('express');
const router = express.Router();

// importacion e instancia de la clase Productos
const optProd = require('../options/mariaDB');
const Productos = require('../js/productos');
const producto = new Productos('productos',optProd);

router.post('/', ( req , res ) => {
    producto.newTable();
    producto.addProduct(req.body);
    res.render('pages/index');
});

module.exports = router;