(function () {
const mongoose = require('mongoose');
const statistical = mongoose.model('Statistical');

exports.createProduct = function (statistical, callback) {
    cate.findOne({cateId: product.cateId}, (err, cateId) => {
        if (cateId != null) {
            product.save(product).then((response) => {
                callback(null, response);
            }, (error) => {
                callback(error, null);
            });
        } else {
            callback("{err: Cate không tồn tại}", null);
        }
        if (err) {
            callback(err, null);
        }
    });
};
})();