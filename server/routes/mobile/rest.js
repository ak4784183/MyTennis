module.exports=app=>{
    const express=require('express');
    const router=express.Router({
        mergeParams:true
    })
    const autoMiddleWare=require('../../middleware/auto_user');
    const resourceMiddleWare=require('../../middleware/resource')
    const assert=require('http-assert');
    const xss=require('node-xss').clean;
    const Storage=require('../../model/Storage');
    const fs=require('fs');
    const path=require('path');
  /* 移动端通用接口  */
  app.use('/mobile/api/rest/:resource',autoMiddleWare(),resourceMiddleWare(),router)

  
  router.get('/find',async(req,res)=>{
    const model=await req.Model.find(req.query);
    res.send(model);
  })
  // 获取全部
  router.get('/', async(req, res) =>{
    let queryOption={};
    let condition={}
    // 搜索
    if(req.query.match){
      const obj=JSON.parse(req.query.match);
      condition[obj.key]=new RegExp(obj.val,'i');   
    }
    //上一级
    if(req.query.parent){
      condition.parent=req.query.parent;
    }
    //分页
    if(req.query.page &&req.query.limit){
      queryOption.limit=Number(req.query.limit)
      queryOption.skip=Number(req.query.page)*Number(req.query.limit)  
    }
    //填充
    if(req.query.populate){
      queryOption.populate=JSON.parse(req.query.populate);    
    }
    // 匹配条件
    if(req.query.where){
      queryOption.where=JSON.parse(req.query.where)
    }
    // 排序
    if(req.query.sort){
      queryOption.sort=JSON.parse(req.query.sort);         
    }
    if(req.query.select){
      queryOption.select=req.query.select;         
    }
    const items=await req.Model.find(condition).setOptions(queryOption).lean();  
    
    res.send(items)
  });
  // 按id获取
  router.get('/:id',async(req,res)=>{
    let queryOption={};  
    if(req.query.populate){
      queryOption.populate=JSON.parse(req.query.populate);       
    }
      const model=await req.Model.findById(req.params.id).setOptions(queryOption).lean();
      res.send(model)
  })
  // 提交
  router.post('/', async(req, res) =>{
    // 过滤带有content提交的信息，防止跨脚本攻击
    if(req.body.content){
      req.body.content=xss(req.body.content)
    }
    const model=await req.Model.create(req.body);
    assert(model,500,'操作失败');
    // imgarr 帖子的本地存有服务器发送的插入富文本的图片数组
    if(req.body.imgarr){
      await Storage.create(req.body.imgarr.map(v=>{
        return {
          parent:model['_id'],
          type:true,
          filename:v
        }
      }))
    }
    res.send(model)
  });
  // 按id修改
  router.put('/:id', async(req, res) =>{
    const model=await req.Model.findByIdAndUpdate(req.params.id,req.body);
    assert(model,500,'操作失败');
    //只有用户的数据才带有avatar，以此来判断是否为头像上传
    if(req.body.avatar){    
      await Storage.create({
        parent:req.params.id,
        type:true,
        filename:req.body.avatar.split('/').pop()
      })
    }
    res.send(model)
  });
  // 按id删除 
  router.delete('/:id', async(req, res) =>{ 
    const model= await req.Model.findByIdAndDelete(req.params.id);
    assert(model,500,'操作失败');
    const imgs=await Storage.find().where({parent:req.params.id});
    if(imgs.length>0){
      imgs.forEach(item=>{
        fs.unlinkSync(path.resolve(__dirname,'../../',`uploads/imgs/${item.filename}`))
      })
      await Storage.remove({parent:req.params.id})
    }
    res.send({
      code:-1,
      message:'操作成功',
    })
  });
  // 增加阅读量  
  router.put('/reads/:id',async(req,res)=>{
      // 先找一遍再加一遍阅读量，否者多个人同一时间打开页面，数据不对
      const {reads}=await req.Model.findById(req.params.id);
      const model=await req.Model.findByIdAndUpdate(req.params.id,{reads:reads+1})
      res.send(model)
  })
  // 添加收藏 
  router.post('/collect',async(req,res)=>{
    const isExist=await req.Model.find(req.body);
    if(isExist.length===0){
        const model= await req.Model.create(req.body);
        assert(model,500,'操作失败')
        res.send({
            code:-1,
            message:'收藏成功'
        })
    }else{          
        const id=isExist[0]['_id'];               
        const model= await req.Model.findByIdAndDelete(id);
        assert(model,500,'操作失败');
        res.send({
            code:1,
            message:'取消收藏'
        })
    }        
  })
  // 获取用户收藏 
  router.get('/collections/:userid',async(req,res)=>{
    const condition={
      user:req.params.userid,
    };
    
    const queryOptions={
      sort:{createdAt:-1} //按收藏时间排序,新的在前，旧的在后
    };
    let temp=req.query;
    
    
    if(temp.limit&&temp.page){
      queryOptions.limit=Number(temp.limit);
      queryOptions.skip=Number(temp.limit)*Number(temp.page);
    }
    if(temp.populate){
      queryOptions.populate=JSON.parse(temp.populate);
    }
    const list=await req.Model.find(condition).setOptions(queryOptions).lean();
    res.send(list);
  })
  // 添加视频，文章，帖子等类型的评论
  router.post('/fabulous',async(req,res)=>{
    const isExist=await req.Model.find(req.body);
        if(isExist.length===0){
            const model= await req.Model.create(req.body);
            assert(model,500,'操作失败')
            res.send({
                code:-1,
                message:'点赞成功'
            })
        }else{          
            const id=isExist[0]['_id'];               
            const model= await req.Model.findByIdAndDelete(id);
            assert(model,500,'操作失败');
            res.send({
                code:1,
                message:'取消点赞'
            })
        }        
  })
  // 移除视频，文章，帖子等类型的点赞
  router.delete('/remove_fabulou/:id',async(req,res)=>{
    await req.Model.remove({from:req.params.id});
    res.send({
      message:'success'
    })
  })
  
}