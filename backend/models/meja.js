'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.transaksi, {
        foreignKey: "id_meja", as:"seat"
      })
    }
  }
  meja.init({
    id_meja : {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nomor_meja: DataTypes.INTEGER,
    status: DataTypes.ENUM("kosong", "terisi"),
  }, {
    sequelize,
    modelName: 'meja',
  });
  return meja;
};