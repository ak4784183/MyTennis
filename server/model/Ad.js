const mongoose=require('mongoose')
const Schema=new mongoose.Schema({
    title:{
        type:String
    },
    url:{
        type:String
    }
},
{
    timestamps:{
        createdAt:'create_at',
        updatedAt:'update_at'
    }
})

module.exports=mongoose.model('Ad',Schema)