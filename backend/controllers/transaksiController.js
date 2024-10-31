const transaksi = require(`../models/index`).transaksi;
const Op = require("sequelize").Op;
const model = require("../models/index");
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const user = model.user;
const meja = model.meja;
const detail = model.detail_transaksi;
const menu = model.menu;
// const easyinvoice = require('easyinvoice')

exports.getAll = async (request, response) => {
  try {
    let result = await transaksi.findAll({
      include: [
        'meja',
        'user',
        {
          model: detail,
          as: 'detail',
          include: ['menu'],
        },
      ],
      order: [['id_transaksi', 'DESC']],
    });
  

    const totalTransaksi = result.length;
    return response.json({
      status: true,
      data: result,
      totalTransaksi
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.getID = async (request, response) => {
  transaksi
    .findByPk(request.params.id, {
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          data: result,
        });
      } else {
        response.status(404).json({
          success: false,
          message: "not found",
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

exports.getIdUser = async (request, response) => {
  transaksi
    .findAll({
      where: { id_user: request.params.id_user },
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          data: result,
        });
      } else {
        response.status(404).json({
          success: false,
          message: "not found",
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


//menambahkan trnsaksi
exports.addTransaksi = async (request, response) => {
  try {
    let status = request.body.status || 'belum_bayar';
    let idMeja = request.body.id_meja;

    // Cek apakah meja dikirim dari request body
    if (idMeja) {
      let checkMeja = await meja.findOne({
        where: { id_meja: idMeja, status: 'kosong' },
      });

      // Jika meja ada tapi statusnya bukan 'kosong', return error
      if (!checkMeja) {
        return response.json({
          status: false,
          message: 'Meja yang dipilih sedang terisi atau tidak ada',
        });
      }
    } else {
      // Jika id_meja tidak dikirim, cari meja yang kosong secara otomatis
      let availableMeja = await meja.findOne({
        where: { status: 'kosong' },
      });

      if (!availableMeja) {
        return response.json({
          status: false,
          message: 'Tidak ada meja kosong yang tersedia',
        });
      }

      idMeja = availableMeja.id_meja;
    }

    let transaksis = {
      tgl_transaksi: new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta',
      }),
      id_user: request.body.id_user,
      id_meja: idMeja,
      nama_pelanggan: request.body.nama_pelanggan,
      harga: request.body.harga,
      status: status,
    };

    let insertTransaksi = await transaksi.create(transaksis);

    let transaksiID = insertTransaksi.id_transaksi;
    let arrayDetail = request.body.detail_transaksi;

    if (arrayDetail) {
      for (let i = 0; i < arrayDetail.length; i++) {
        arrayDetail[i].id_transaksi = transaksiID;
      }

      await detail.bulkCreate(arrayDetail);
    }

    if (status === 'belum_bayar') {
      await meja.update(
        { status: 'terisi' },
        { where: { id_meja: idMeja } }
      );
    }

    return response.json({
      status: true,
      insertTransaksi,
      message:
        'Data transaksi berhasil ditambahkan dengan harga pada detail_transaksi',
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

// melakukan delete transaksi
exports.deleteTransaksi = async (request, response) => {
  const param = { id_transaksi: request.params.id };
  detail
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          message: "deleted",
        });
      } else {
        response.status(404).json({
          success: false,
          message: "not found",
        });
      }
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
  transaksi
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          message: "deleted",
        });
      } else {
        response.status(404).json({
          success: false,
          message: "not found",
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


//mengupdate transaksi
exports.editTransaksi = async (request, response) => {
  const param = { id_transaksi: request.params.id };
  const dataTransaksi = {
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status,
  };
  transaksi.findOne({ where: param }).then((result) => {
    if (result) {
      transaksi
        .update(dataTransaksi, { where: param })
        .then((result) => {
          response.status(200).json({
            success: true,
            data: {
              id_transaksi: param.id_transaksi,
              ...dataTransaksi,
            },
          });

          if (request.body.status === "lunas") {
            meja.update(
              { status: "kosong" },
              { where: { id_meja: request.body.id_meja } }
            );
          }
        })
        .catch((error) => {
          response.status(400).json({
            success: false,
            message: error.message,
          });
        });
    } else {
      response.status(404).json({
        success: false,
        message: "not found",
      });
    }
  });
};


// melakukan filtering by tanggal
exports.filtertanggal = async (request, response) => {
  const { startDate, endDate } = request.params;

  // Validasi parameter
  if (!startDate || !endDate) {
    return response.status(400).json({
      success: false,
      message: "Start date and end date are required.",
    });
  }

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  try {
    const transactions = await transaksi.findAll({
      where: {
        tgl_transaksi: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: meja,
          as: "meja",
        },
        {
          model: detail, // menambahkan relasi detail ke transaksi
          as: "detail",
          include: [
            {
              model: menu, // pastikan model `menu` juga di-include untuk mendapatkan nama menu, harga, dll.
              as: "menu",
            },
          ],
        },
      ],
    });

    if (transactions.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No transactions found in the given date range.",
      });
    }

    return response.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: "An error occurred while fetching transactions: " + error.message,
    });
  }
};
// Pastikan ini ada di bagian atas file

// exports.filtertanggal = async (request, response) => {
//   // Mendapatkan tanggal hari ini
//   const today = new Date();
//   const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//   const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) - 1; // 23:59:59

//   try {
//     const transactions = await transaksi.findAll({
//       where: {
//         tgl_transaksi: {
//           [Op.between]: [startOfDay, endOfDay],
//         },
//       },
//       include: [
//         {
//           model: user,
//           as: "user",
//         },
//         {
//           model: model.meja,
//           as: "meja",
//         },
//       ],
//     });

//     if (transactions.length === 0) {
//       return response.status(404).json({
//         success: false,
//         message: "No transactions found for today.",
//       });
//     }

//     return response.status(200).json({
//       success: true,
//       data: transactions,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       success: false,
//       message: "An error occurred while fetching transactions: " + error.message,
//     });
//   }
// };


//melakukan filterNama 
exports.filterNamaUser = async (request, response) => {
  const param = { nama_user: request.body.nama_user };
  user
    .findAll({
      where: {
        nama_user: param.nama_user,
      },
    })
    .then((result) => {
      if (result === null) {
        response.status(404).json({
          success: false,
          message: "not found",
        });
      } else {
        transaksi
          .findAll({
            where: {
              id_user: result[0].id_user,
            },
          })
          .then((result) => {
            if (result.length === 0) {
              response.status(404).json({
                success: false,
                message: "not found",
              });
            } else {
              response.status(200).json({
                success: true,
                data: result,
              });
            }
          })
          .catch((error) => {
            response.status(400).json({
              success: false,
              message: error.message,
            });
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


//melakukan filtering bulan
exports.filterBulan = async (request, response) => {
  const param = { bulan_transaksi: request.params.bulan_transaksi };
  transaksi
    .findAll({
      where: {
        tgl_transaksi: {
          [Op.like]: param.bulan_transaksi + "%",
        },
      },
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      if (result.length === 0) {
        response.status(404).json({
          success: false,
          message: "not found",
        });
      } else {
        response.status(200).json({
          success: true,
          data: result,
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

exports.orderHistory = async (request, response) => {
  try {
    let data = await transaksi.findAll({
      include: [
        {
          model: detail,
          as: "detail",
        },
      ],
    });
    return response.status(200).json({
      status: true,
      data: data,
      message: "Order list has been loaded",
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.receipt = async (request, response) => {
  let param = request.params.id_transaksi;
  try {
    const dataTransaksi = await transaksi.findOne({
      where: { id_transaksi: param },
      include: [
        {
          model: user,
          attributes: ["nama_user"],
          as: "user",
        },
        {
          model: detail,
          as: "detail",
          include: {
            model: menu,
            attributes: ["nama_menu", "harga"],
            as: "menu",
          },
        },
      ],
    });
    if (!dataTransaksi) {
      return response.status(404).json({
        success: false,
        message: "not found",
      });
    }
    const transactionDetails = dataTransaksi.detail || [];
    const receiptItems = transactionDetails.map((detail) => {
      return {
        menuName: detail.menu ? detail.menu.nama_menu : "Unknown",
        quantity: detail.jumlah,
        pricePerMenu: detail.harga,
        totalPerMenu: detail.jumlah * detail.harga,
      };
    });
    const total = receiptItems.reduce(
      (sum, item) => sum + item.totalPerMenu,
      0
    );
    const struk = {
      kasir: dataTransaksi.user.nama_user,
      pelanggan: dataTransaksi.nama_pelanggan,
      tanggal: dataTransaksi.tgl_transaksi,
      pembelian: receiptItems,
      total,
    };

  const printstruk = (struk) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
      .store-info { text-align: center; margin-bottom: 20px; }
      .store-info h2 { margin: 10px 0 5px; }
      .store-info p { margin: 4px 0; }
      .logo { display: block; margin: 0 auto 10px; max-width: 80px; }
      
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 8px 12px; border-bottom: 1px solid #ddd; text-align: center; }
      th { background-color: #f4f4f4; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      
      h2, h3 { text-align: center; }
      h3 { margin-top: 20px; color: #333; }
    </style>
  </head>
  <body>
    <div class="store-info">
      <img src="public/assets/logo.png" alt="Logo" class="logo" />
      <h2>Caffe</h2>
      <p>Malang, Indonesia</p>
      <p><strong>Date:</strong> ${struk.tanggal}</p>
    </div>

    <p><strong>Cashier:</strong> ${struk.kasir}</p>
    <p><strong>Customer:</strong> ${struk.pelanggan}</p>
    
    <table>
      <thead>
        <tr>
          <th>Menu</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
      ${
        struk.pembelian && struk.pembelian.length > 0 
        ? struk.pembelian.map(item => `
          <tr>
            <td>${item.menuName || 'Unknown'}</td>
            <td>${item.quantity}</td>
            <td>${item.pricePerMenu}</td>
            <td>${item.totalPerMenu}</td>
          </tr>
        `).join('') 
        : `<tr><td colspan="4">No items found</td></tr>`
      }
      </tbody>
    </table>
    <h3>Grand Total: ${struk.total}</h3>
  </body>
  </html>
`;


const strukHTML = printstruk(struk)
const directory = path.join(__dirname, '../receipt')
if(!fs.existsSync(directory)) {
  fs.mkdirSync(directory)
}
const file = path.join(directory, `receipt_${param}.pdf`)
const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setContent(strukHTML)

await page.pdf({
  path: file,
  format: 'A4',
  printBackground: true
})
await browser.close()

response.json({
  success: true,
  message: 'receipt generated successfully', file
})

  } catch (error) {
    response.status(500).json({
      message: error.message,
    });
  }
};

exports.totalPenjualan = async (request, response) => {
  try {
    const totalPenjualan = await transaksi.findAll({
      include: [
        {
          model: detail,
          as: 'detail',
          include: ['menu'],
        },
      ],
    });

    // Menghitung total penjualan dari semua transaksi
    let total = 0;
    totalPenjualan.forEach((transaksi) => {
      transaksi.detail.forEach((detail) => {
        total += detail.harga * detail.jumlah; // harga per item dikalikan jumlah
      });
    });

    response.status(200).json({
      success: true,
      totalPenjualan: total,
      message: 'Total penjualan berhasil dihitung',
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//melakukan gruping menu 
exports.getMostTransactedMenu = async (request, response) => {
  try {
    // Menghitung jumlah transaksi per id_menu
    let mostTransactedMenus = await detail.findAll({
      attributes: [
        'id_menu',
        [sequelize.fn('COUNT', sequelize.col('id_menu')), 'jumlah_terjual'],
      ],
      group: ['id_menu'],
      order: [[sequelize.literal('jumlah_terjual'), 'DESC']],
      limit: 1, // Mengambil menu dengan transaksi terbanyak
      include: [
        {
          model: menu, // Asosiasikan dengan tabel menu untuk mendapatkan detail menu
          attributes: ['nama_menu', 'harga'], // Sesuaikan atribut yang ingin ditampilkan
        },
      ],
    });

    return response.json({
      status: true,
      data: mostTransactedMenus,
      message: 'Menu dengan transaksi terbanyak berhasil ditampilkan',
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};
