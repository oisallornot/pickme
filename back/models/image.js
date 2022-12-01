module.exports=(sequelize,DataTypes)=>{
    const Image = sequelize.define('Image',{ //Mysql에는 user's' 테이블생성
        //id가 기본적으로 들어있다.
        src:{
            type: DataTypes.STRING(200), 
            allowNull: false, //필수

        },

    },{
        charset: 'utf8', //이모티콘까지 넣고싶으면 utf8mb4
        collate:'utf8_general_ci', //한글저장
    });
    Image.associate = (db)=>{
        db.Image.belongsTo(db.Post)
    };
    return Image;
};