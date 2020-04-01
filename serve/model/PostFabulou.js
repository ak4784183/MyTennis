const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    from:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Post'
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }
})
module.exports=mongoose.model('PostFabulou',Schema);