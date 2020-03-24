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
    host:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Player'
    }],
    guest:[{ 
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
    winner:{ 
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Player'
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Contest',Schema);