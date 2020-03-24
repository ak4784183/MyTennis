module.exports=option=>{
    const inflection=require('inflection');
    return async(req,res,next)=>{         
        const modelName=inflection.classify(req.params.resource);
        req.Model=require(`../model/${modelName}`);       
        next()
      }
}