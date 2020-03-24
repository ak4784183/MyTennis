module.exports=option=>{
    const assert=require('http-assert');
    const User=require('../model/User');
    const jwt=require('jsonwebtoken');
   return async(req,res,next)=>{  
        const token=String(req.headers.autorization||'').split(' ').pop();
        assert(token,401,'请先登录')
        const {id}=jwt.verify(token,req.app.get('SECRET'));
        assert({id},401,'请先登录') 
        const user=await User.findById(id);
        assert(user,401,'请先登录')
        await next();
      }
}