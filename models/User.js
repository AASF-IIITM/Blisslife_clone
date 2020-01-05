const mongoose =require('mongoose');
// creating a schema
const UserSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  phonenumber:{
    type:Number,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});
// creating a model
const User=mongoose.model('User',UserSchema);

module.exports=User;
