const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    parent:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Match'
    },
    title:{
        type:String,
        require:true
    },           
    sitetype:{   //场地类型
        type:String,
        require:true
    },           
    place:{     //举办地
        type:String
    },
    bonus:{     //奖金
        type:Number
    }
})

module.exports=mongoose.model('Match',Schema);