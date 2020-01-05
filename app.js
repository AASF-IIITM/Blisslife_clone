const express=require("express");
const bodyParser=require("body-parser");
const expresslayout=require("express-ejs-layouts");
const mongoose=require("mongoose");
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const app=express();

// passport config (passing passport to passport.js)
require('./config/passport')(passport);
//EJS
// app.use(expresslayout);
app.set("view engine",'ejs');

app.use(bodyParser.urlencoded({extended:true}));
// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
// passport middileware
app.use(passport.initialize());
app.use(passport.session());
// connect flash
app.use(flash());

// global vars
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  app.locals.error_msg=req.flash('error_msg');
  app.locals.error=req.flash('error');
  next();
});

// To server static files to client
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB",{useNewUrlParser :true,useUnifiedTopology: true },function(err,db){
  if(err)
  console.log(err)
  else
  console.log("succesfully connected to mongoDB");
});  //connecting with database
// Routes
app.use("/",require('./routes/index'));
app.use("/users",require('./routes/users'));

app.listen(process.env.port||4000,function(){
  console.log("server started on port 4000");
});
