const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    player:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Player'
    },
    sum:{
        type:Number,
        require:true
    },
    type:{
        type:Boolean,
        require:true
    }
})

module.exports=mongoose.model('Rank',Schema);