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
const path=require('path')
dotenv.config();

db.sequelize.sync()
.then(()=>{
    console.log('db연결성공!!!!');
})
.catch(console.error);
passportConfig();

app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true,
}));

app.use('/',express.static(path.join(__dirname,'uploads')))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());


// app.get('/',(req,res)=>{
//     res.send('heelo');
// });




app.use('/posts',postsRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);
app.use('/hashtag',hashtagRouter);




app.listen(port,()=>{
    console.log(`server is running with port No.${port}`)
});