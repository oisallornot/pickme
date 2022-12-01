
 module.exports=(sequelize,DataTypes)=>{
    const Comment = sequelize.define('Comment',{ //Mysql에는 user's' 테이블생성
        //id가 기본적으로 들어있다.
        content:{
            type: DataTypes.TEXT,
            allowNull: false,

        },

    },{
        charset: 'utf8', //이모티콘까지 넣고싶으면 utf8mb4
        collate:'utf8_general_ci', //한글저장
    });
    Comment.associate = (db)=>{
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    };
    return Comment;
};