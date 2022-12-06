const express = require('express');
const cors = require('cors');
const port = 3065;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const passport = require('passport');
const db = require('./models');
const passportConfig = require('./passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const app =express();
const path=require('path');
const hpp = require('hpp');
const helmet = require('helmet');
dotenv.config();

db.sequelize.sync()
.then(()=>{
    console.log('db연결성공!!!!');
})
.catch(console.error);
passportConfig();

app.set('trust proxy',1)
if(process.env.NODE_ENV==='production'){
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helmet());
    
    app.use(cors({
        origin: 'bitfrommind.com',
        credentials:true,
    }));
}else{
    app.use(morgan('dev'));
    app.use(cors({
        origin: true,
        credentials:true,
    }));
    
}


app.use('/',express.static(path.join(__dirname,'uploads')))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:process.env.COOKIE_SECRET,
    proxy:true,
    cookie:{
        httpOnly:true,
        secure:false,
        domain: process.env.NODE_ENV==='production' &&'.bitfrommind.com'
    }
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/',(req,res)=>{
    res.send('heelo');
});




app.use('/posts',postsRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);
app.use('/hashtag',hashtagRouter);




app.listen(port,()=>{
    console.log(`server is running with port No.${port}`)
});