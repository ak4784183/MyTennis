module.exports=app=>{
    const express=require('express');
    const router=express.Router();
    const assert=require('http-assert');
    const bcrypt=require('bcryptjs');
    const User=require('../../model/User');
    const jwt=require('jsonwebtoken');
    app.use('/mobile/api',router);
    router.post('/register',async(req,res)=>{
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
    router.post('/login',async(req,res)=>{
        const {username,password}=req.body;       
        const user=await User.findOne({username}).select('+password');
        assert(user,422,'用户名错误');
        const flag=bcrypt.compareSync(password,user.password);
        assert(flag,422,'密码错误');
        const m_token=jwt.sign({id:user['_id']},app.get('SECRET'));
        res.send({
            m_token,
            name:user.username
        })
    })
    const Category=require('../../model/Category');
    const Article=require('../../model/Article');
    router.get('/categories',async(req,res)=>{
        const categories=await Category.find();    
        res.send(categories)
    })
    router.get('/articles/:id',async(req,res)=>{  
        const articles=await Category.findById(req.params.id).populate('articles').lean();
        res.send(articles)
    })

    const Ad=require('../../model/Ad');
    router.get('/ads',async(req,res)=>{
        const result=await Ad.find();
        res.send(result)
    })
}
