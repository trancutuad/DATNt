const Gifts = require('../model/GiftModel');
const Orders = require('../model/OrderModel');
const product = require('../model/ProductModel');

const OrdersDetails = require('../model/OrderDetailsModel');
const orderService = require('../services/order');
const Product = require('../services/product');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('../helpers/jwt');


exports.addOrder = function  (req, response, next) {
    // const nDate = new Date().toLocaleString('en-US', {
    //     timeZone: 'Asia/Ho_Chi_Minh'
    // });

    var today = new Date();
    var nDate =  today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear() + " / " + today.getHours() +":" + today.getMinutes() ;
    var nBuyDate =  (today.getDate()+3) +'-'+(today.getMonth()+1) +'-'+today.getFullYear();


    var orderReq = JSON.parse(req.body.order);
    var orderDetailsReq = JSON.parse(req.body.order_details);
    var order = Orders();
    console.log(orderDetailsReq);


    order.idOrder = orderReq.orderId;
    order.totalAmount = orderReq.totalAmount;
    order.totalPrice = orderReq.totalPrice;
    order.status = "Chờ xác nhận";
    order.userId = req.userId;
    order.created_at = nDate;
    order.update_at = nBuyDate;


    Orders.create(order, (err, res) => {
        if(err){
            response.status(401).json({statusCode: 401, data: "Có lỗi xảy ra !!!"})
        }else{
            orderService.createOrderDetails(orderDetailsReq, (err, res1) => {
                if(err){
                    response.status(401).json({statusCode: 401, data: "Có lỗi xảy ra !!!"})
                }else{
                    response.status(200).json({statusCode: 200, data: "Đặt hàng thành công !!!"})
                    // Thêm mới
                    for(let i=0;i<orderDetailsReq.length;i++){
                        Product.deleteProduct(orderDetailsReq[i] ,async (err,res2)=>{
                            if(err){
                                response.status(401).json({statusCode: 401, data: "Có lỗi xảy ra !!!"})
                                console.log(err.message);
                            }
                            else{
                                console.log("Thành công");
                            }
                        })
                    }
                   
                //     for(let i=0;i<orderDetailsReq.length;i++){
                //     let amount1 = Product.findOne({productId:orderDetailsReq[i].productId}).lean();
                //     console.log(amount1);

                    
            }
            })
        }

    });


};

 //tuta
exports.listOderDetail = function (req, res) {
    orderService.selectAllForOrder(req.params.id, function (err, data) {
        if (data) {
            // console.log(data);
            res.status(200).json({statusCode: res.statusCode, data: data});
        } else if (data.isEmpty()) {
            res.status(401).send({statusCode: res.statusCode, err: 'Không có hoa don'});

        } else if (err) {
            res.status(400).send({statusCode: res.statusCode, data: err});
        }
    })

};
    //tuta
exports.billOrderDetail = function (req, res) {
    orderService.selectAllBillOrder(req.params.id, function (err, data) {
        if (data) {
            res.status(200).json({statusCode: res.statusCode, data: data});
            // console.log(data);
        } else if (data.isEmpty()) {
            res.status(401).send({statusCode: res.statusCode, err: 'Không có hoa don chi tiet'});

        } else if (err) {
            res.status(400).send({statusCode: res.statusCode, data: err});
        }
    })

};

exports.addGift = (req, res, next) => {


    orderService.createGift(gift, (err, data) => {
        if (err) {
            res.status(401).send({statusCode: res.statusCode, err: 'Có lỗi xảy ra! ' + err})
        }
        res.status(200).send({statusCode: res.statusCode, data: data})

    })
}
exports.checkGift = (req, res, next) => {

    orderService.checkGift(req.params.id, (err, data) => {
        if (err) {
            res.status(401).send({statusCode: res.statusCode, err: 'Có lỗi xảy ra! ' + err})
        }
        if (!data) {
            res.status(404).send({statusCode: res.statusCode, err: 'Mã khuyến mãi không tồn tại!'})
            return;
        }
        res.status(200).send({statusCode: res.statusCode, data: data})

    })
}
