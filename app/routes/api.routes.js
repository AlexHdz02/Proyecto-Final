const express = require('express');
const user = require('../controllers/user.controller');
const product = require('../controllers/product.controller');
const payment = require('../controllers/payment.controller');
const favorite = require('../controllers/favorite.controller');
const calification = require('../controllers/calification.controller');

const router = express.Router();

// Rutas para usuarios
router.post('/api/user', user.create);
router.post('/api/login', user.login);

//Rutas para los productos
router.post('/api/product', product.create);
router.put('/api/product/:id', product.update);
router.get('/api/product', product.findAll);
router.get('/api/product/:id', product.findOne);
router.delete('/api/product/:id', product.delete);
router.post('/api/product/filter', product.findAllFilter);
router.post('/api/product/removeAvailable', product.removeAvailable);

//Rutas para los métodos de pago
router.post('/api/payment', payment.create);
router.get('/api/payment', payment.findAll);
router.delete('/api/payment/:id', payment.delete);

//Rutas para los favoritos
router.post('/api/favorite', favorite.create);
router.get('/api/favorite/:id', favorite.findAll);
router.delete('/api/favorite/:id', favorite.remove);

//Rutas para las calificaciones
router.post('/api/calification', calification.create);
router.get('/api/calification/:productId', calification.findAll);

module.exports = router;
