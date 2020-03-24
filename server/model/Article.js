const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    title:{type:String},
    author:{type:String},
    content:{type:String},
    category:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Category'
    },
    cover:{type:String},
    reads:{type:Number,default:0}
},{
    timestamps:true
})
Schema.virtual('commends',{
    ref:'ArtCommend',
    localField:'_id',
    foreignField:'article',
    justOne:false
})


module.exports=mongoose.model('Article',Schema)