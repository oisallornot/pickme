const express = require('express');
const {Op} = require('sequelize')
const router = express.Router();
const {Post,User,Image,Comment} = require('../models')

router.get('/',async(req,res,next)=>{
    try{
        const where = {};
        console.log('라스트아이디')
        console.log(req.query.lastId)
       if( parseInt(req.query.lastId,10)){
        console.log('여기로오는거아니지?')
        where.id= {[Op.lt]: parseInt(req.query.lastId,10)}
       }
        const posts = await Post.findAll({
           where,
            limit:10,
            order:[
                ['createdAt','DESC'],
            [Comment,'createdAt','DESC']
        ],
            include:[{
                model:User,
                attributes:['id','nickname']
            },{
        model:Image,
       },{
        model:Comment,
        include:[{
            model:User,
            attributes:['id','nickname'],
            
        }]
        },{
            model:User,
            as:'Likers',
            attributes:['id']
            
        },{
            model:Post,
            as:'Retweet',
            include:[{
                model:User,
                attributes:['id','nickname']
            },{
                model:Image,
            }]
   
       }],
        
    });
    console.log('게시물들가져오지')
    console.log(posts)
     res.status(200).json(posts);

    }catch(error){
        console.log('에러?')
        console.error(error);
        next(error);
    }

}) ;


module.exports = router;
