(function () {
    const mongoose = require('mongoose');
    const gift = mongoose.model('Gifts');
    const orderDetail = mongoose.model('OrderDetails');
    const orderUser = mongoose.model('Orders');
    const orders = require('../model/OrderDetailsModel');


    exports.createOrderDetails = function (order, callback) {
        orders.insertMany(order).then((response) => {
            callback(null, response);
        }, (error) => {
            callback(error, null);
        });
    };

    exports.createGift = function (gift, callback) {
        gift.save(gift).then((response) => {

            callback(null, response);
        }, (error) => {
            callback(error, null);
        });
    };

        //tuta
    exports.selectAllForOrder = async function (query, callback) {
        orderUser.find({
            delete_at: null, userId: query
        }, (err, data) => {
            // console.log(data)
            if (err) callback(err, null)
            if (data) {
                callback(err, data)
            }
        })
    }

    //tuta
    exports.selectAllBillOrder = async function (query, callback) {
        orderDetail.find({
            delete_at: null, idOrder: query
        }, (err, data) => {
            // console.log(data)
            if (err) callback(err, null)
            if (data) {
                callback(err, data)
            }
        })
    }

    exports.checkGift = async function (query, callback) {
        // const nDateCurrent = new Date();
        // console.log(nDateCurrent)

        await gift.findOne({
            codeGift: query
        }, (err, data) => {
            callback(err, data);
        });
    }

})();
