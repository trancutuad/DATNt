const express = require("express");
const routerWeb = express();
const Products = require("../model/ProductModel");
const Orders = require("../model/OrderModel");
const multer = require("multer");
const OrderDetail = require("../model/OrderDetailsModel");
const Statistic = require("../model/StatisticModel");

const abc = require("../controllers/abc");
const uuid = require("uuid");

const mongoose = require("mongoose");
const products = mongoose.model("Products");
const cates = mongoose.model("Cates");
const review = mongoose.model("Reviews");
const Passport = require("passport");
var cate = require("../model/CateModel");
var gift = require("../model/GiftModel");
const images = require("../model/ImagesModel");

//handlebars

const multerStorage = multer.diskStorage({
  destination: (res, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    let ext = file.originalname.split(".").pop();
    cb(null, `photo-${Math.random().toString(16).substring(2)}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadDefault = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
});
routerWeb.use(Passport.initialize());
routerWeb.use(Passport.session());
routerWeb.get("/", function (req, res) {
  res.render("signin", { layout: false });
});
routerWeb.post(
  "/login",
  Passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/",
  })
);

routerWeb.get("/index", abc.getAllProduct);
routerWeb.get("/delete_product/:id", abc.deleteProduct);
routerWeb.get("/delete_cate/:id", abc.deleteCate);
routerWeb.get("/delete_gift/:id", abc.deleteGift);
routerWeb.get("/delete_users/:id", abc.deleteUser);
routerWeb.post("/accept_order-details", (req, res1) => {
  console.log(req.body.idOrder);
  Orders.findOneAndUpdate(
    { idOrder: req.body.idOrder },
    { status: "Đang giao hàng" },
    (err, res) => {
      res1.redirect("list_order");
    }
  );
});
//tuta
routerWeb.post("/btn_success", (req, res1) => {
  console.log(req.body.idOrder);
  Orders.findOneAndUpdate(
    { idOrder: req.body.idOrder },
    { status: "Giao hàng thành công" },
    (err, res) => {
      res1.redirect("list_order");
    }
  );
});
routerWeb.get("/list_cate", abc.getAllCate);
routerWeb.get("/list_user", abc.getAllUser);
routerWeb.get("/list_order", abc.getAllOrders);
routerWeb.get("/get_order-details/:id", abc.getOrderDetails);
routerWeb.get("/list_gift", abc.getAllGift);
routerWeb.get("/add_product", abc.addProduct);
routerWeb.get("/add_banner", (err, res) => {
  res.render("add_banner");
});
// routerWeb.get("/statistical", abc.getAllProduct2);
routerWeb.get("/add_gift", (req, res) => {
  res.render("add_gift", { layout: false });
});
routerWeb.get("/add_cate", (req, res) => {
  res.render("add_cate", { layout: false });
});

routerWeb.post("/create_gift", (req, res) => {
  console.log(req.body);
  let r = Math.random().toString(36).substring(7);
  // console.log("random", r);
  var gifts = gift();
  gifts.idGift = uuid.v1();
  const nDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  gifts.codeGift = req.body.code;
  // gift.amount = req.body.amount; // so luong gift
  gifts.number = req.body.number; // % giam
  // gift.expiration_at = req.body.expiration_at; // ngay het han
  gifts.created_at = nDate;
  gifts.update_at = nDate;
  gift.create(gifts, (err, data) => {
    if (err) console.log(err);
    res.redirect("/list_gift");
  });
});

routerWeb.get("/edit_product/:id", abc.getProduct);
routerWeb.get("/edit_cate/:id", abc.getCate);

routerWeb.get("/deletesp/:id", async (req, res) => {
  try {
    const stt = await Orders.findByIdAndDelete(req.params.id);
    let sanpham = await Orders.find({});
    try {
      res.redirect("/list_order");
    } catch (e) {
      res.send("co loi xay ra", e.message);
    }
  } catch (e) {}
});

routerWeb.get("/statistical", async (req, res) => {
  const product = await products.find({}).lean();
  let listSta = {};
  let arrList = [];
  for (let i = 0; i < product.length; i++) {
    console.log(product[i]);
    let od = await OrderDetail.find({ productId: product[i].productId });
    console.log(od);
    let dem = 0;
    od.forEach((item1, index1) => {
      dem = dem + Number(item1.amount);
      // console.log(index1 + item1);
    });
    // console.log(dem);
    listSta = {
      image: product[i].image,
      productId: product[i].productId,
      name: product[i].name,
      amount: Number(product[i].amount) + dem,
      sold: dem,
      rest: product[i].amount,
    };
    arrList.push(listSta);
  }

  console.log("List");
  console.log(arrList.size);
  // tạo list
  res.render("statistical", {
    data: arrList,
  });
});

// routerWeb.get("/statistical", async (req, res) => {
//   const product = await products.find({}).lean();
//   let name = "";

//   product.forEach(async (item, index, array) => {
//     let od = await OrderDetail.find({ productId: item.productId });
//     let dem = 0;
//     od.forEach((item1, index1) => {
//       dem = dem + Number(item1.amount);
//       console.log(index1 + item1);
//     });

//     Statistic.updateOne(
//       { productId: item.productId },
//       {
//         $set: {
//           sold: dem,
//           rest: item.amount - dem,
//         },
//       },
//       (err, doc) => {
//         if (!err) {
//           console.log(dem);
//         } else {
//           console.log("Edit Failed" + err.message);
//         }
//       }
//     );
//   });
//   const statistic = await Statistic.find({}).lean();
//   res.render("statistical", { statistic: statistic });
// });

routerWeb.get("/remove", async (req, res) => {
  const stt = await Statistic.findByIdAndDelete("60859a5b467cdf333ce976f4");
});

routerWeb.post(
  "/create_product",
  uploadDefault.array("files"),
  async (req, res1) => {
    const productId = uuid.v1();
    const nDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    var image;
    req.files.forEach(async (item, index, array) => {
      image = array[0].filename;
      var imageProduct = images();
      imageProduct.imageId = uuid.v1();
      imageProduct.url = item.filename;
      imageProduct.productId = productId;
      await images.create(imageProduct, (err, res) => {
        if (err)
          res.status(404).json({ statusCode: 404, err: "Có lỗi xảy ra!" });
      });
    });

    console.log(req.body);
    const product = new products(req.body);
    product.productId = productId;
    product.name = req.body.name;
    product.description = req.body.description;
    // product.price = req.body.price;
    product.image = image;
    product.cateId = req.body.cateId;
    product.delete_at = null;
    product.created_at = nDate;
    product.update_at = nDate;

    const statistic = new Statistic({
      productId: productId,
      amount: Number(req.body.amount),
      name: req.body.name,
    });
    try {
      await statistic.save();
      console.log("Chạy vào lưu");
    } catch (e) {
      console.log("Không chạy vào lưu" + e.message);
    }

    products.create(product, (err, res) => {
      if (err) console.log(err);
      res1.redirect("/index");
    });
  }
);
routerWeb.post("/create_cate", uploadDefault.single("file"), (req, res1) => {
  const cate = new cates(req.body);
  cate.cateId = uuid.v1();
  cate.name = req.body.name;
  cate.images = req.file.filename;
  const nDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  cate.created_at = nDate;
  cate.update_at = nDate;
  cate.delete_at = null;

  cates.create(cate, (err, res) => {
    if (err) console.log(err);
    res1.redirect("/list_cate");
  });
});
routerWeb.post("/update_product", uploadDefault.single("file"), (req, res) => {
  var image;
  try {
    image = req.file.filename;
  } catch (e) {
    image = req.body.image;
  }

  products.updateOne(
    { _id: req.body.id },
    {
      $set: {
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        size: req.body.size,
        description: req.body.description,
        image: image,
        cateId: req.body.cateId,
      },
    },
    (err, doc) => {
      if (!err) {
        res.redirect("/index");
      } else {
        console.log("Edit Failed");
      }
    }
  );
  Statistic.updateOne(
    { productId: req.body.productId },
    {
      $set: {
        amount: Number(req.body.amount),
      },
    },
    (err, doc) => {
      if (!err) {
      } else {
        console.log("Edit Failed" + err.message);
      }
    }
  );
});
routerWeb.post("/update_cate", uploadDefault.single("file"), (req, res) => {
  var image;
  try {
    image = req.file.filename;
  } catch (e) {
    image = req.body.image;
  }

  cate.updateOne(
    { _id: req.body.id },
    { $set: { name: req.body.name, images: image } },
    (err, doc) => {
      if (!err) {
        res.redirect("/list_cate");
      } else {
        console.log("Edit Failed");
      }
    }
  );
});

module.exports = routerWeb;
