module.exports = app =>{
  const express = require('express');
  const router = express.Router({
    mergeParams:true
  });
  const autoMiddleWare=require('../middleware/auto');
  const resourceMiddleWare=require('../middleware/resource');
  const Storage=require('../model/Storage');
  const Temp=require('../model/Temp');
  const assert=require('http-assert');
  const fs=require('fs');
  const path=require('path');
  /* 管理端通用接口 */
  app.use('/admin/api/rest/:resource',autoMiddleWare(),resourceMiddleWare(),router)
  
  
  router.get('/', async(req, res) =>{
    let queryOption={};
    let condition={}
    
    if(req.query.query){
      condition.title=new RegExp(req.query.title,'i')       
    }
    // 搜索
    if(req.query.match){
      const obj=JSON.parse(req.query.match);
      condition[obj.key]=new RegExp(obj.val,'i');   
    }
    // 搜索
    if(req.query.where){
      queryOption.where=JSON.parse(req.query.where);   
    }
    
    if(req.query.name){
      condition.name=new RegExp(req.query.name,'i')          
    }
    if(req.query.page &&req.query.limit){
      queryOption.limit=Number(req.query.limit)
      queryOption.skip=Number(req.query.page)*Number(req.query.limit)  
    }
    if(req.query.populate){
      queryOption.populate=JSON.parse(req.query.populate);    
    }
    
    const items=await req.Model.find(condition).setOptions(queryOption).lean();  
    
    res.send(items)
  });
  router.get('/:id', async(req, res) =>{
    let queryOption={}
    if(req.query.populate){
      queryOption.populate=JSON.parse(req.query.populate);    
    }
    const model=await req.Model.findById(req.params.id).setOptions(queryOption).lean();
    
    res.send(model);
  });
  router.get('/count/page', async(req, res) =>{
    const amount=await req.Model.find().countDocuments();
    res.send(amount)
  });
  router.post('/', async(req, res) =>{
    const model=await req.Model.create(req.body);
    const temp=await Temp.find();
    if(temp){
      await Storage.create(temp.map(v=>{
        return {
          parent:model['_id'],
          type:v.type,
          filename:v.filename,
        }
      }));
      await Temp.remove({});
    }
    res.send(model)
  });
  router.put('/:id', async(req, res) =>{
    const model=await req.Model.findByIdAndUpdate(req.params.id,req.body);
    const temp=await Temp.find();
    if(temp.length>0){
      const flag=await Storage.create(temp.map(v=>{
        return {
          parent:model['_id'],
          type:v.type,
          filename:v.filename,
        }
      }));
      assert(flag,500,'操作失败');
      await Temp.remove({});
    }   
    res.send( model)
  });  
  router.delete('/:id', async(req, res) =>{ 
    const flag= await req.Model.findByIdAndDelete(req.params.id);
    assert(flag,500,'操作失败');
    const arr=await Storage.find().where({parent:req.params.id});
    if(arr.length>0){
      arr.forEach(item=>{
        fs.unlinkSync(path.resolve(__dirname,'../',`uploads/${item.type?'imgs':'video'}/${item.filename}`));
      })
      await Storage.remove({parent:req.params.id});
    }
    res.send({
      success:'删除成功'
    })
  });
} 
  