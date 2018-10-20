var express = require('express');

var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://zwaslnxvwfnveu:7860de60a514acb52e31c26b7b565c11ee777bacf204aae60ef668fb632a593b@ec2-23-21-171-249.compute-1.amazonaws.com:5432/d6bi7ljd0aj9qa?ssl=true');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/about', function (req, res) {
    var name = 'Noppadon kaewkong';
    var hobbies = ['Music', 'Movie', 'Programming'];
    var bdate = '09/10/2018';
    res.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });
});

//Display all products
app.get('/products', function(req, res) {
    var id = req.param('id');
    var sql='select* from products';
        if(id){
            sql += ' where id ='+id +' order by id ASC';
        }
   db.any(sql+' order by id ASC')
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/products',{products: data})
        })
    .catch(function(error){
        console.log('ERROR:'+error);
    })

});

app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id =" + pid;
    db.any(sql, )
    .then(function(data){
        res.render('pages/product_edit',{product: data[0]});
    })
    .catch(function(error){

        console.log('ERROR'+ error);

    })
 

});

app.get('/users/:id', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from users';
    if(id){

        sql += ' where id = ' +id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data });

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//Update data
app.post('/product/update',function (req, res){
     var id = req.body.id;
     var title = req.body.title;
     var price = req.body.price;
     var sql = `update products set title = '${title}',price =${price} where id =${id}`;
     
     //do.none
     db.none(sql);
     console.log('UPDATE:'+ sql);
     res.redirect('/products');
});
// user 
app.get('/users', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});

//Add New Product

app.post('/products/insert', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id,title,price)
    VALUES ('${id}', '${title}', '${price}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
app.get('/insert', function (req, res) {
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    res.render('pages/insert', { time: time});
});
//Delete products
app.get('/product_delete/:pid',function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM products';
    if (id){
            sql += ' where id ='+ id;
    }
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            res.redirect('/products');
    
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })
 });




var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});