const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    from:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'ArtCommend'
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }
})
module.exports=mongoose.model('ArtFabulou',Schema);