const mongoose=require('mongoose')
const Schema=new mongoose.Schema({
    title:{
        type:String
    },
    url:{
        type:String
    },
    link:{
        type:String
    }
},
{
    timestamps:true
})

module.exports=mongoose.model('Ad',Schema)