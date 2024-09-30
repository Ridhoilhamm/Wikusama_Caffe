'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksis', {
      id_transaksi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tgl_transaksi: {
        type: Sequelize.DATE
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id_user"
        }
      },
      id_meja: {
        type: Sequelize.INTEGER,
        references: {
          model: "mejas",
          key: "id_meja"
        }
      },
      nama_pelanggan: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('belum_bayar','lunas')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaksis');
  }
};