module.exports=app=>{
    const express=require('express');
    const router=express.Router();
    const assert=require('http-assert');
    const bcrypt=require('bcryptjs');
    const User=require('../../model/User');
    const Category=require('../../model/Category');
    const Article=require('../../model/Article');
    const ArtCommend=require('../../model/ArtCommend');
    const ArtFabulou=require('../../model/ArtFabulou');
    const ArtCollection=require('../../model/ArtCollection');
    const Post=require('../../model/Post');
    const Ad=require('../../model/Ad');
    const autoMiddleWare=require('../../middleware/auto_user');
    const fs=require('fs');
    const path=require('path');

    app.use('/mobile/api',autoMiddleWare(),router);   //加权限判断的中间件
   
    
    router.get('/categories',async(req,res)=>{
        res.send(await Category.find())
    })
    router.get('/categories/all',async(req,res)=>{
        // 聚合方法
        // const categories=await Category.aggregate([
        //     {
        //         $lookup:{
        //             from:'articles',
        //             localField:'_id',
        //             foreignField:'category',
        //             as:'artList',        
        //         }            
        //     },
        //     {
        //         $addFields:{
        //             artList:{$slice:['$artList',5]}
        //         }
        //     }
        // ])
        const categories=await Category.find().populate('articles').populate({        
            path:'articles',
            select:'title createdAt cover reads commends',
            options: { 
                limit: 6 ,
                sort:{
                    '_id':-1
                    }
                },
            populate:{
                path:'commends',
                select:'_id'
            }
        }).lean();
        res.send(categories)
    })
    router.get('/categories/:id',async(req,res)=>{
        const limit=req.query.limit;
        const page=req.query.page;
        const match=req.query.match;
        const model=await Category.findById(req.params.id).populate({
            path:'articles',         
            match:{
                title:{$regex : match}
            },
            select:'title createdAt cover reads commends',
            options:{
                limit:limit,
                skip:page*limit,
                sort:{
                    '_id':-1
                }
            },
            populate:{
                path:'commends',
                select:'_id'
            }
        }).lean();
        
        res.send(model)
    })
    router.get('/articles/:id',async(req,res)=>{           
        const model=await Article.findById(req.params.id);
        await Article.findByIdAndUpdate(req.params.id,{reads:model.reads+1});// 增加阅读量
        const article=await Article.findById(req.params.id).populate({path:'category'}).populate({
            path:'commends',
            select:'_id'
        }).lean();       
        res.send(article)
    })
    router.get('/articles/commends/:id',async(req,res)=>{ 
        const limit=Number(req.query.limit);
        const page=Number(req.query.page);   
        const commends=await ArtCommend.find().where({'article':req.params.id,'to':null}).populate('fabulous').setOptions({
            limit:limit,
            skip:limit*page,       
            populate:{
                path:'from childs',
                populate:{                    
                    path:'from reply',
                    select:'nickname avatar'
                }
            },
            sort:{
                '_id':-1
            }
        }).lean();       
        res.send(commends);
    })    
    router.get('/art_commend/:id',async(req,res)=>{    
        const limit=Number(req.query.limit);
        const page=Number(req.query.page);        
        const model=await ArtCommend.findById(req.params.id).populate('from fabulous').populate({
            path:'childs',
            options:{
                limit:limit,
                skip:limit*page
            },
            populate:{
                path:'from reply fabulous'
            }
        }).lean();     
        res.send(model);     
    })
    router.post('/art_commend',async(req,res)=>{    
        const model=await ArtCommend.create(req.body);      
        res.send(model);     
    })
    router.post('/art_fabulous',async(req,res)=>{
        const isExist=await ArtFabulou.find(req.body);
        if(isExist.length===0){
            const model=await ArtFabulou.create(req.body);
            res.send({
                code:-1,
                message:'点赞成功',
                model:model
            })           
        }else{
            res.send({
                code:0,
                message:'您已点赞过了'
            })    
        }     
    })
    router.post('/art_colletion',async(req,res)=>{
        const isExist=await ArtCollection.find(req.body);
        if(isExist.length===0){
            const model= await ArtCollection.create(req.body);
            assert(model,500,'操作失败')
            res.send({
                code:-1,
                message:'收藏成功'
            })
        }else{          
            const id=isExist[0]['_id'];               
            const model= await ArtCollection.findByIdAndDelete(id);
            assert(model,500,'操作失败');
            res.send({
                code:1,
                message:'取消收藏'
            })
        }        
    })


    //修改个人密码
    router.put('/resetPwd/:id',async(req,res)=>{
        const {newPassword,oldPassword}=req.body;
        const user=await User.findById(req.params.id).select('+password');
        const flag=bcrypt.compareSync(oldPassword,user.password);
        assert(flag,403,'原密码验证错误');
        const model=await User.findByIdAndUpdate(req.params.id,{password:newPassword});
        assert(model,500,'操作失败');
        res.send({
            message:'重置完成'
        });
    })   
    // 获取同类型帖子的文档数
    router.get('/posts/layer/:id',async(req,res)=>{    
        const count=await Post.where({parent:req.params.id,
        reply:null}).count();
        res.send(count);
    })
    // 删除资源文件表
    router.delete('/storage',async(req,res)=>{
        const {imgarr}=req.body;   
        if(imgarr&&imgarr.length>0){
          imgarr.forEach(item=>{
            fs.unlinkSync(path.resolve(__dirname,'../../',`uploads/imgs/${item}`))
          })
        }
        res.send({
          message:'success'
        })
      })
    
    
}
