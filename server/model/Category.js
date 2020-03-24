const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    title:{
        type:String
    }
},{
    toJSON:{
        virtual:true
    }
})
Schema.virtual('articles',{
    ref:'Article',
    localField:'_id',
    foreignField:'category',
    justOne:false
})
module.exports=mongoose.model('Category',Schema);