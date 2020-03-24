const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    collect:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Product'
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
})

module.exports=mongoose.model('ProductCollection',Schema);