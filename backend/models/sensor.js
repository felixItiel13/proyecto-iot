'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sensor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sensor.init({
    valor: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'sensor',
  });
  return sensor;
};