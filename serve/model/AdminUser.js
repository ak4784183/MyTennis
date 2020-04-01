const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
const Schema=new mongoose.Schema({
    username:{type:String},
    password:{
        type:String,
        select:false,
        set(value){
            return bcrypt.hashSync(value,10)
        }
    }
})

module.exports = mongoose.model('AdminUser',Schema)