const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    single:{
        type:Boolean,
        require:true
    },
    match:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Match'
    },
    round:{
        type:Number,
        require:true
    },
    date:Date,
    host:[{  //关联球员
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Player'
    }],
    guest:[{ //关联球员
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Player'
    }],
    guestscore:{
        type:Number,
        default:0
    },
    hostscore:{
        type:Number,
        default:0
    },
    video:{ //关联视频
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Video'
    },

},{
    timestamps:true
})

module.exports=mongoose.model('Contest',Schema);