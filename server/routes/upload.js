module.exports=app=>{
    const multer=require('multer');
    const path=require('path');
    const Temp=require('../model/Temp');
    const fs=require('fs');
    const upload=multer({
        dest:path.resolve(__dirname,'../','uploads/imgs')
    });
    const video=multer({
        dest:path.resolve(__dirname,'../','uploads/video')
    });
    app.post('/admin/api/uploads',upload.single('file'),async(req,res)=>{
        const file=req.file;
        file.url='http://localhost:3000/uploads/imgs/'+file.filename;
        await Temp.create({type:true,filename:file.filename});
        res.send(file)
    })
    app.post('/admin/api/uploads/video',video.single('file'),async(req,res)=>{
        const file=req.file;
        file.url='http://localhost:3000/uploads/video/'+file.filename  
        await Temp.create({type:false,filename:file.filename});     
        res.send(file)
    })
    app.post('/mobile/api/uploads',upload.single('file'),async(req,res)=>{
        const file=req.file;
        file.url='http://localhost:3000/uploads/imgs/'+file.filename       
        res.send(file)
    })

    app.delete('/admin/api/uploads',async(req,res)=>{
        const temp=req.body;
        if(temp){
            await fs.unlinkSync(path.resolve(__dirname,'../',`uploads/${temp.type?'imgs':'video'}/${temp.filename}`));
            await Temp.findOneAndDelete({filename:temp.filename});
        }
        res.send({message:'sucess'})
    })   
}