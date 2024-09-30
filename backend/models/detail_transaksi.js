"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.transaksi, { foreignKey: "id_transaksi", as: "detail_transaksi"}),
      this.belongsTo(models.menu, { foreignKey: "id_menu", as:"menu" });
    }
  }
  detail_transaksi.init(
    {
      id_detail_transaksi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id_transaksi: DataTypes.INTEGER,
      id_menu: DataTypes.INTEGER,
      jumlah: DataTypes.INTEGER,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "detail_transaksi",
    }
  );
  return detail_transaksi;
};
