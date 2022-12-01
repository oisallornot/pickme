const { PrinterFilled } = require("@ant-design/icons");

module.exports=(sequelize,DataTypes)=>{
    const Hashtag = sequelize.define('Hashtag',{ //Mysql에는 user's' 테이블생성
        //id가 기본적으로 들어있다.
        name:{
            type: DataTypes.STRING(20), 
            allowNull: false, //필수
         
        },

    },{
        charset: 'utf8', //이모티콘까지 넣고싶으면 utf8mb4
        collate:'utf8_general_ci', //한글저장
    });
    Hashtag.associate = (db)=>{
        db.Hashtag.belongsToMany(db.Post,{through:'PostHashtag'});
    };
    return Hashtag;
};

