require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db');
// const bodyParser = require('body-parser');

const app = express();
const PORT = 5000 || process.env.PORT; //for porting on online server 
 
connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//public folder for holding js, css, images, easy to access to ejs
app.use(express.static('public'));

// app.use(bodyParser.json());

//middleware to use express layout 
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');

app.use('/',require('./server/routes/main'));

// app.get('',(req,res)=>{
//     res.send("Hello World");
// });

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`);
});