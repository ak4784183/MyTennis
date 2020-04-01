const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    cname:{
        type:String,
        require:true
    },
    ename:{
        type:String,
        // require:true
    },
    gender:{
        type:Boolean,
        default:false
    },
    age:{
        type:Number,
        // require:true
    },
    birthday:{
        type:String,
        // require:true
    },
    height:{
        type:Number,
        require:true
    },
    avatar:String,
    habithand:{
        type:Boolean,
        default:false
    },
    country:Array,
    backhand:{
        type:Boolean,
        default:false
    },
    integral:{
        type:Number,
        default:0
    },
    championships:{
        type:Number,
        default:0
    },
    grandslam:{
        type:Number,
        default:0
    },
    retire:{
        type:Boolean,
        default:false
    },
    articles:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Article'
    }],
    videos:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Video'
    }]
})

module.exports=mongoose.model('Player',Schema);