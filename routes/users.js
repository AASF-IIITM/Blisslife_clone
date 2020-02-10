const express=require("express");
const router=express.Router();
const bcrypt=require("bcryptjs");
const passport=require('passport');
const { forwardAuthenticated } = require('../config/auth');

// requiring a model
const User=require("../models/User");
// defining the login Page
router.get("/login",forwardAuthenticated, (req,res)=>res.render('login'));

//defining the register page
router.get("/register",forwardAuthenticated, (req,res)=>res.render('register'));

// register handle
router.post("/register",function(req,res){
const {name,email,phonenumber,password,password2}=req.body;
console.log(req.body)
let errors=[];
// check required fields
  if(!name||!email||!phonenumber||!password||!password2)
  errors.push({msg: "please fill in all the fields"});
  if(password!=password2)
  errors.push({msg:"password do not match"});
  if(password.length<6)
  errors.push({msg:"password length should be greater then 6 character"});
  if(errors.length>0)
  {
    res.render('register',{errors,name,email,phonenumber,password,password2});
  }
  else{
  // validation passes
  User.findOne({email:email},function(err,user){
    if(user){
      //User exist
      errors.push({msg:"Email already exist"});
      res.render('register',{
        errors:errors,
        name:name,
        email,
        phonenumber,
        password,
        password2
      });
    }
    else{
      const newUser=new User({
        name,
        email,
        phonenumber,
        password,
        password2
      });
    // hash password
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
          if(err) throw err;
          // set password to hashed
          newUser.password=hash;
          // save user
          newUser.save()
            .then(user =>{
              req.flash('success_msg','you are now registered and can logged in');
              res.redirect('/users/login');
            })
            .catch(err=> console.log(err));
          })
        });
    }
  });
  }
});

// Login handle
router.post("/login",function(req,res,next){
  passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
});

// Logouthandle
router.get("/logout",function(req,res){
   req.logout();
   req.flash('success_msg','you are logged out');
   res.redirect('/users/login');
});

module.exports=router;
