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
    var product_id = req.param('product_id');
    var sql='select* from products';
        if(product_id){
            sql += ' where product_id ='+product_id +' order by product_id ASC';
        }
   db.any(sql+' order by product_id ASC')
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
    var time = moment().format();
    var sql = "select * from products where product_id =" + pid;
    db.any(sql, )
    .then(function(data){
        res.render('pages/product_edit',{product: data[0],time:time});
    })
    .catch(function(error){

        console.log('ERROR'+ error);

    })
 

});

app.get('/users/:user_id', function (req, res) {
    var user_id = req.param('user_id');
    var time = moment().format();
    var sql = 'select * from users';
    if(user_id){

        sql += ' where user_id = ' +user_id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users_edit', { users: data[0],time:time });

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//Update data
app.post('/product/update',function (req, res){
     var product_id = req.body.product_id;
     var title = req.body.title;
     var price = req.body.price;
     var sql = `update products set title = '${title}',price =${price} where product_id =${product_id}`;
     
     //do.none
     db.none(sql);
     console.log('UPDATE:'+ sql);
     res.redirect('/products');
});

// user 
app.get('/users', function (req, res) {
    var user_id = req.params.user_id;
    var sql = 'select * from users';
    if (user_id) {
        sql += ' where user_id =' + user_id;
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
    var product_id = req.body.product_id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (product_id,title,price)
    VALUES ('${product_id}', '${title}', '${price}')`;
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
    var product_id = req.params.pid;
    var sql = 'DELETE FROM products';
    if (product_id){
            sql += ' where product_id ='+ product_id;
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
 // add new user
 app.get('/insert_user', function (req, res) {
    var time = moment().format();
    res.render('pages/insert_user', { time: time});
});


 app.post('/users/insert_user', function (req, res) {
    var user_id = req.body.user_id;
    var email = req.body.email;
    var password = req.body.password;
    var time = req.body.time;
    var sql = `INSERT INTO users (user_id,email,password,created_at) 
    VALUES ('${user_id}', '${email}', '${password}', '${time}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//User_edit
app.get('/users/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    var sql = "select * from users where user_id =" + user_id;
    db.any(sql, )
        .then(function (data) {
            res.render('pages/users_edit', { user: data[0] });
        })
        .catch(function (error) {

            console.log('ERROR' + error);
        })
});
// update user
app.post('/users/update', function (req, res) {
    var user_id = req.body.user_id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `update users set email = '${email}',password = '${password}' where user_id = ${user_id} `;
    ////db.none
    db.none(sql);
    console.log('UPDATE:' + sql);
    res.redirect('/users');
});
// user delete
app.get('/user_delete/:pid', function (req, res) {
    var user_id = req.params.pid;
    var sql = 'DELETE FROM users';
    if (user_id) {
        sql += ' where user_id =' + user_id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
// report product
app.get('/report_product', function (req,res) {
 
    var sql ='select products.product_id,products.title,sum(purchase_items.quantity) as quantity,sum(purchase_items.price) as price from products inner join purchase_items on purchase_items.product_id=products.product_id group by products.product_id;select sum(quantity) as squantity,sum(price) as sprice from purchase_items';
    db.multi(sql)
    .then(function  (data) 
    {
 
        // console.log('DATA' + data);
        res.render('pages/report_product', { products: data[0],sum: data[1]});
    })
    .catch(function (data) 
    {
        console.log('ERROR' + error);
    })

});
// report user
app.get('/report_user', function (req,res) {
 
    var sql = 'select users.email,purchases.name,products.title,purchase_items.quantity,purchase_items.price*purchase_items.quantity as total  from users INNER JOIN purchases ON purchases.user_id = users.user_id INNER JOIN purchase_items ON purchase_items.purchase_id=purchases.purchase_id   INNER JOIN products ON products.product_id = purchase_items.product_id order by purchase_items.price*purchase_items.quantity DESC limit 25';
    
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' +data);
            res.render('pages/report_user', { users: data });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

}); 

var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});