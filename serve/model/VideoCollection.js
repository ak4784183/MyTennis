const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    collect:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Video'
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
})

module.exports=mongoose.model('VideoCollection',Schema);