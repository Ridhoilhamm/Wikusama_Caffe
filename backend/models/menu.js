'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.detail_transaksi, {
        foreignKey: "id_menu", as: "order"
      })
    }
  }
  menu.init({
    id_menu : {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama_menu: DataTypes.STRING,
    jenis: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    gambar: DataTypes.STRING,
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'menu',
  });
  return menu;
};