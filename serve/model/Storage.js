const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    parent:{
        type:mongoose.SchemaTypes.ObjectId
    },
    type:Boolean, //false 是视频  ，true  是图片
    filename:String
})

module.exports=mongoose.model('Storage',Schema);