const mongoose=require('mongoose')
const Schema=new mongoose.Schema({
    parent:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Post'
    },
    user:{       //发帖人
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    },
    content:{       //发帖内容
        type:String,
        required:true
    },
    reads:{
        type:Number,
        default:0
    },
    layer:{
        type:Number,
        default:0
    },
    to:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Post'
    },
    reply:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
})
// 帖子数量
Schema.virtual('counts',{
    ref:'Post',
    localField:'_id',
    foreignField:'parent',
    justOne:false
})
// 帖子回复
Schema.virtual('childs',{
    ref:'Post',
    localField:'_id',
    foreignField:'to',
    justOne:false
})
// 评论点赞
Schema.virtual('fabulous',{
    ref:'PostFabulou',
    localField:'_id',
    foreignField:'from',
    justOne:false
})

module.exports=mongoose.model('Post',Schema)