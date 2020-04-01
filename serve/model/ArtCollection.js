const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    article:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Article',
        require:true
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        require:true
    }
},{
    timestamps:true
})
module.exports=mongoose.model('ArtCollection',Schema);