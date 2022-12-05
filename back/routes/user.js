const express = require('express');
const bcrypt = require('bcrypt');
const {User,Post,Image,Comment,Hashtag} =require('../models');
const { default: next } = require('next');
const passport = require('passport');
const {Op} =require('sequelize')
const {isLoggedIn,isNotLoggedIn} = require('./middlewares')
const router = express.Router();

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',(err,user,info)=>{
        if(err){
            console.error(err);
           return  next(err);
        }
        if(info){
            return res.status(401).send(info.reason);
        }
        return req.login(user,async(loginErr)=>{
            if(loginErr){
                console.error(loginErr);
                return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where:{id:user.id},
                attributes:{
                    exclude:['password']
                },
                include:[{
                    model:Post,
                },{
                    model:User,
                    as:'Followings',
                },{
                    model:User,
                    as:'Followers',
                }]
            })
            return res.status(200).json(fullUserWithoutPassword);
        })
    })(req,res,next);
});




router.get('/', async (req, res, next) => { // GET /user
    try {
      if (req.user) {
        const fullUserWithoutPassword = await User.findOne({
          where: { id: req.user.id },
          attributes: {
            exclude: ['password']
          },
          include: [{
            model: Post,
            attributes: ['id'],
          }, {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          }, {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          }]
        })
        res.status(200).json(fullUserWithoutPassword);
      } else {
        res.status(200).json(null);
      }
    } catch (error) {
      console.error(error);
     next(error);
    }
  });

router.post('/',isNotLoggedIn,async (req,res,next)=>{ //POST?user/
    try {
       const exUser = await User.findOne({
            where:{
                email:req.body.email,
            }
        });
        if(exUser){
         return res.status(403).send('이미 사용중인 아이디입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password,12);
        await User.create({
            email:req.body.email,
            nickname:req.body.nickname,
            password:hashedPassword,
        });
        res.status(200).send('잘들어왔습니다');

    }catch(error){
        console.error(error);
        next(error); //status 500
    }


});





router.post('/logout',isLoggedIn,(req,res,next)=>{
    console.log('로그아웃안되?')
    // req.logout();
    req.session.destroy();
    res.send('ok');
})



router.patch('/nickname',isLoggedIn,async(req,res,next)=>{
try{
    await User.update({
        nickname:req.body.nickname,
    },{
        where:{id:req.user.id}
    })
    res.status(200).json({nickname:req.body.nickname})
}catch(error){
    console.error(error);
    next(error);
}

})


        router.get('/followers',isLoggedIn,async(req,res,next)=>{
            try{
                const user = await User.findOne({where:{id:req.user.id}})
                if(!user){
                    res.status(403).send('없는 사람입니다.')
                }
                
                const followers = await user.getFollowers({
                    limit:parseInt(req.query.limit,10)
                });
        
                res.status(200).json(followers)
            }catch(error){
                console.error(error);
                next(error);
            }
            
            })


            router.get('/followings',isLoggedIn,async(req,res,next)=>{
                try{
                    const user = await User.findOne({where:{id:req.user.id}})
                    if(!user){
                        res.status(403).send('없는 사람입니다.')
                    }
                    
                    const followings = await user.getFollowings({
                        limit:parseInt(req.query.limit,10)
                    });
            
                    res.status(200).json(followings)
                }catch(error){
                    console.error(error);
                    next(error);
                }
                
                })

                router.delete('/follower/:userId',isLoggedIn,async(req,res,next)=>{
                    try{
                        const user = await User.findOne({where:{id:req.params.userId}})
                        if(!user){
                            res.status(403).send('없는 사람입니다.')
                        }
                        await user.removeFollowings(req.user.id);
            
                        res.status(200).json({UserId:parseInt(req.params.userId,10)})
                    }catch(error){
                        console.error(error);
                        next(error);
                    }
                    
                    })




                    router.patch('/:userId/follow',isLoggedIn,async(req,res,next)=>{
                        try{
                            const user = await User.findOne({where:{id:req.params.userId}})
                            if(!user){
                                res.status(403).send('없는 사람입니다.')
                            }
                            
                            await user.addFollowers(req.user.id);
                    
                            res.status(200).json({UserId:parseInt(req.params.userId,10)})
                        }catch(error){
                            console.error(error);
                            next(error);
                        }
                        
                        })
                    
                        router.delete('/:userId/follow',isLoggedIn,async(req,res,next)=>{
                            try{
                                const user = await User.findOne({where:{id:req.params.userId}})
                                if(!user){
                                    res.status(403).send('없는 사람입니다.')
                                }
                                await user.removeFollowers(req.user.id);
                    
                                res.status(200).json({UserId:parseInt(req.params.userId,10)})
                            }catch(error){
                                console.error(error);
                                next(error);
                            }
                            
                            })


                    router.get('/:userId/posts',async(req,res,next)=>{
                        try{
                            const where = {UserId:req.params.userId};
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


                    router.get('/:userId',async(req,res,next)=>{

                        try{
                     
                                
                                const fullUserWithoutPassword = await User.findOne({
                                    where:{id:req.params.userId},
                                    attributes:{
                                        exclude:['password']
                                    },
                                    include:[{
                                        model:Post,
                                        attributes:['id']
                                    },{
                                        model:User,
                                        as:'Followings',
                                    },{
                                        model:User,
                                        as:'Followers',
                                    }]
                                })
                            if(fullUserWithoutPassword){
                                const data = fullUserWithoutPassword.toJSON();
                                data.Posts = data.Posts.length;
                                data.Followers = data.Followers.length;
                                data.Followings = data.Followings.length;
                                res.status(200).json(data);
                    
                            }else{
                                res.status(404).json('존재하지 않는 사용자 입니다');
                            }
                            
                    
                        }catch(error){
                            console.error(error);
                            next(error);
                    
                        }
                    })


module.exports = router;
