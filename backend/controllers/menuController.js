const menu = require("../models/index").menu;
const upload = require("./upload-menu").single("gambar");
const Op = require("sequelize").Op;
const path = require("path");
const fs = require("fs");

exports.getAllMenu = async (request, response) => {
  menu
  .findAll()
  .then((result) => {
    response.json({
      success: true,
      data: result,
      message: "all menus have been loaded",
    });
  });
};

exports.searchMenu = async (request, response) => {
  let keyword = request.body.keyword;
  menu
    .findAll({
      where: {
        [Op.or]: [
          { nama_menu: { [Op.like]: "%" + keyword + "%" } } || 
          { deskripsi: { [Op.like]: "%" + keyword + "%" } },
        ],
      },
    })
    .then((result) => {
      if (result.length > 0) {
        response.status(200).json({
          success: true,
          message: "menu berhasil ditemukan",
          data: result,
        });
      } else {
        response.status(400).json({
          success: false,
          message: "menu not found",
        });
      }
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.getById = async (request, response) => {
  menu
    .findByPk(request.params.id)
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          data: result,
        });
      } else {
        response.status(404).json({
          success: false,
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      response.status(404).json({
        success: false,
        message: error.message,
      });
    });
};

exports.addMenu = (request, response) => {
  upload(request, response, async (error) => {
    const dataMenu = {
      nama_menu: request.body.nama_menu,
      jenis: request.body.jenis,
      deskripsi: request.body.deskripsi,
      gambar: request.file.filename,
      harga: request.body.harga,
    };
    menu
      .findOne({ where: { nama_menu: dataMenu.nama_menu } })
      .then((result) => {
        if (result) {
          response.status(404).json({
            success: false,
            message: "nama menu sudah ada",
          });
        } else {
          menu
            .create(dataMenu)
            .then((result) => {
              response.status(200).json({
                success: true,
                data: result,
                message: "new menu has been added",
              });
            })
            .catch((error) => {
              response.status(400).json({
                success: false,
                message: error.message,
              });
            });
        }
      });
  });
};

exports.deleteMenu = async (request, response) => {
  const id_menu = request.params.id;
  const dataMenu = await menu.findOne({ where: { id_menu: id_menu } });
  const oldImage = dataMenu.gambar;
  const pathImage = path.join(__dirname, `../image`, oldImage);

  if (fs.existsSync(pathImage)) {
    fs.unlink(pathImage, (error) => console.log(error));
  }
  menu
    .destroy({ where: { id_menu: id_menu } })
    .then((result) => {
      response.status(200).json({
        success: true,
        message: "menu with id " + id_menu + " has been deleted",
      });
    })
    .catch((error) => {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.editMenu = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }
    let id_menu = request.params.id;
    let dataMenu = {
      nama_menu: request.body.nama_menu,
      jenis: request.body.jenis,
      deskripsi: request.body.deskripsi,
      gambar: request.file.filename,
      harga: request.body.harga,
    };
    if(request.file){
        const selectedMenu = await menu.findOne({
            where: {id_menu: id_menu}
        })
        const oldImage = selectedMenu.gambar
        const pathImage = path.join(__dirname, '../image', oldImage)
        if(fs.existsSync(pathImage)){
            fs.unlink(pathImage, error => console.log(error))
        }
        dataMenu.gambar = request.file.filename
    }
    menu
    .update(dataMenu, {where: {id_menu: id_menu}})
    .then((result) => {
        response.status(200).json ({
            success: true,
            data: dataMenu,
            message: "the data has been updated"
        })
    })
    .catch((error) => {
        response.status(400).json({
            success: false,
            message: error.message
        })
    })
  });
};
