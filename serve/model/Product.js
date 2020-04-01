const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    name:{
        type:String
    },
    cover:{
        type:String
    },
    specification:{
        type:String
    },
    parent:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'EquipType'
    }],
    price:{
        type:Number
    },
    content:{
        type:String
    },
    recommend:{
        type:String
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Product',Schema);
