'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserMovie.belongsTo(models.User, {foreignKey: "UserId"})
    }
  }
  UserMovie.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty :{
          msg: 'title is required'
        },
        notNull :{
          msg: 'title is required'
        }
      }
    },
    synopsis:{
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty :{
          msg: 'synopsis is required'
        },
        notNull :{
          msg: 'synopsis is required'
        }
      }
    }, 
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty :{
          msg: 'image URL is required'
        },
        notNull :{
          msg: 'image URL is required'
        },
        isUrl :{
          msg: 'image URL must be a URL with https protocol.',
          args: [{ 
            protocols: ['https'],
            require_valid_protocol: true,
            require_protocol: true
          }]  
        }
      }
    },
trailerUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty :{
          msg: 'trailer URL is required'
        },
        notNull :{
          msg: 'trailer URL is required'
        },
        isUrl :{
          msg: 'trailer URL must be a URL with https protocol.',
          args: [{ 
            protocols: ['https'],
            require_valid_protocol: true,
            require_protocol: true
          }]  
        }
      }
    },
    ImdbId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty :{
          msg: 'Imdb id is required'
        },
        notNull :{
          msg: 'Imdb id is required'
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        
        notEmpty: {
          msg: 'user is required'
        },
        notNull: {
          msg: 'user cannot be null'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'UserMovie',
  });
  return UserMovie;
};