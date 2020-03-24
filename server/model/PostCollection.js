const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    post:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Post'
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
})

module.exports=mongoose.model('PostCollection',Schema);