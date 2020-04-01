module.exports=app=>{
    const bcrypt=require('bcryptjs');
    const assert=require('http-assert');
    const User=require('../../model/User');
    const jwt=require('jsonwebtoken');
    //登录注册
    app.post('/mobile/api/register',async(req,res)=>{
        const {username}=req.body;
        const result=await User.findOne({username})       
        if(!result){
            await User.create(req.body)
            res.send({
                code:-1,
                message:'注册成功'
            })
        }else{
            res.send({
                code:1,
                message:'账户名已存在'
            })
        }      
    })
    app.post('/mobile/api/login',async(req,res)=>{
        const {username,password}=req.body;       
        const user=await User.findOne({username}).select('+password');
        assert(user,422,'用户名错误');
        const flag=bcrypt.compareSync(password,user.password);
        assert(flag,422,'密码错误');
        const m_token=jwt.sign({id:user['_id']},app.get('SECRET'));
        
        res.send({
            m_token:m_token,
            name:user.username,
            id:user['_id']
        })
    }) 
    
}