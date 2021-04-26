const express = require('express');
const routerStatistical = express.Router();
const staticstical = require('../controllers/StatisticalController');
const AuthMiddleWare = require('../middleware/auth_middleware');


routerProduct.use(AuthMiddleWare.isAuth);

routerProduct.get('/list', staticstical.list);

module.exports = { routerStatistical };