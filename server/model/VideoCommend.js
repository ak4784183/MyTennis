const mongoose=require('mongoose')
const Schema=new mongoose.Schema({
    parent:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Video'
    },
    user:{       //评论的用户
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    },
    content:{    //发帖内容
        type:String,
        required:true
    },
    commend:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'VideoCommend'
    },
    reply:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
})
// 帖子回复
Schema.virtual('childs',{
    ref:'VideoCommend',
    localField:'_id',
    foreignField:'commend',
    justOne:false
})
Schema.virtual('fabulous',{
    ref:'VideoFabulou',
    localField:'_id',
    foreignField:'from',
    justOne:false
})
module.exports=mongoose.model('VideoCommend',Schema)