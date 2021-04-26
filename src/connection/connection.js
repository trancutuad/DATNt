let mongoose = require('mongoose');

// We need to difine the URL
// let URL = 'mongodb+srv://Tu123456:Tuan123456@cluster0.ezh7x.mongodb.net/qlbh?retryWrites=true&w=majority';
// mongodb+srv://admin:admin@cluster0.w0h8u.mongodb.net/test?retryWrites=true&w=majority
// let URL = "mongodb+srv://severadmin:admin@cluster0.jo73i.mongodb.net/test?retryWrites=true&w=majority";

let URL = "mongodb+srv://severadmin:admin@cluster0.jo73i.mongodb.net/test?retryWrites=true&w=majority";

mongoose.set('useFindAndModify', false);

//Connection establishment
mongoose.connect(process.env.MONGODB_URI || URL, {
    useNewUrlParser: true,
    useCreateIndex: true
});
//Modelsfalse
let db = mongoose.connection;

db.on('error', () => {
    console.error('Error occured in db connection');
});

db.on('open', () => {
    console.log('DB Connection established successfully');
});
