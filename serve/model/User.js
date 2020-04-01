const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const Schema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        select:false,
        set(val){
            return bcrypt.hashSync(val,10)
        },
        required:true
    },
    nickname:{type:String,required:true},
    gender:{type:Number,default:0},
    avatar:{type:String},
    email:{type:String,required:true},
    tel:{type:String,default:''},
    declaration:{type:String,default:''},
    birthday:{type:Date}
},{
    timestamps:{
        createdAt:'register_time'
    }
})
module.exports=mongoose.model('User',Schema)