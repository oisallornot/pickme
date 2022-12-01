
module.exports=(sequelize,DataTypes)=>{
    const Post = sequelize.define('Post',{ //Mysql에는 user's' 테이블생성
        //id가 기본적으로 들어있다.
        content:{
            type: DataTypes.TEXT,
            allowNull: false,
        },

    },{
        charset: 'utf8', //이모티콘까지 넣고싶으면 utf8mb4
        collate:'utf8_general_ci', //한글저장
    });
    Post.associate = (db)=>{
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag,{through:'PostHashtag'});
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post,{as:'Retweet'});
        db.Post.belongsToMany(db.User,{through:'Like', as :'Likers'});
        
    };
    return Post;
};