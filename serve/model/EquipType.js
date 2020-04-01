const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
    title:{
        type:String
    },
    parent:{
        type:String,
        ref:'EquipType'
    }
})
Schema.virtual('childs',{
    ref:'EquipType',
    localField:'_id',
    foreignField:'parent',
    justOne:false
})
module.exports=mongoose.model('EquipType',Schema);