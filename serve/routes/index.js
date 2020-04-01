module.exports=app=>{
    const bcrypt=require('bcryptjs');
    const assert=require('http-assert');
    const AdminUser=require('../model/AdminUser');
    const jwt=require('jsonwebtoken');
    app.use('/admin/api/login',async(req,res)=>{       
        const {username,password}=req.body;       
        const user= await AdminUser.findOne({username}).select('+password')   
        assert(user,422,'用户名输入错误')
        const flag=bcrypt.compareSync(password,user.password)
        assert(flag,422,'密码错误')
        const token=jwt.sign({id:user['_id']},app.get('SECRET'));
        res.send({token,username:user.username})       
   })  
}