const {Sequelize} = require('sequelize')
const sequelize = require('../util/database')

const Place = sequelize.define('Place',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true,
    },
    name: {type: Sequelize.STRING,allowNull:  false, unique:true},
    address : {type: Sequelize.STRING,allowNull:  false, unique:true},
    area : {type: Sequelize.STRING,allowNull:  false, unique:true},
    city : {type: Sequelize.STRING,allowNull:  false, unique:true},
}, {
    sequelize,
    modelName: 'Place'
});

module.exports  = Place