module.exports=option=>{
    const assert=require('http-assert');
    const AdminUser=require('../model/AdminUser');
    const jwt=require('jsonwebtoken');
   return async(req,res,next)=>{  
        const token=String(req.headers.autorization||'').split(' ').pop();
        assert(token,401,'请先登录')
        const {id}=jwt.verify(token,req.app.get('SECRET'));
        assert({id},401,'请先登录') 
        req.user=await AdminUser.findById(id);
        assert(req.user,401,'请先登录')
        await next();
      }
}