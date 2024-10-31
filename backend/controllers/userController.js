const user = require("../models/index").user;
const jwt = require("jsonwebtoken");
const Op = require("sequelize").Op;
const md5 = require("md5");
const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "ridho";
const Sequelize = require('sequelize')
const sequelize = new Sequelize("cafe_ukk", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

exports.addUser = async (request, response) => {
  //buat user baru yang belum pernah punya akun
  let newUser = {
    //datanya user baru
    nama_user: request.body.nama_user,
    username: request.body.username,
    password: md5(request.body.password),
    role: request.body.role,
  };

  let existingUser = await user.findAll({
    where: {
      //cari, udah ada apa blm data lamanya
      [Op.or]: [{ nama_user: newUser.nama_user }, { username: newUser.username }],
    },
  });

  if (
    newUser.nama_user === "" ||
    newUser.username === "" ||
    newUser.password === "" ||
    newUser.role === ""
  ) {
    return response.status(400).json({
      success: false,
      message: "Harus diisi semua",
    });
  } else {
    //dia udah punya akun dan login nya pake data yg sama
    if (existingUser.length > 0) {
      return response.status(400).json({
        success: false,
        message: "Cari nama atau username lain",
      });
    } else {
      //ini dia murni bikin akun baru, prosesnya kayak add user biasa
      console.log(newUser);
      user
        .create(newUser)
        .then((result) => {
          return response.json({
            success: true,
            data: result,
            message: `New User has been added`,
          });
        })
        .catch((error) => {
          return response.status(400).json({
            success: false,
            message: error.message,
          });
        });
    }
  }
};

exports.Login = async (request, response) => {
  try {
    const params = {
      //masukin email sm password buat value nya
      username: request.body.username,
      password: md5(request.body.password),
    };
    console.log(params);
    const findUser = await user.findOne({ where: params }); //nemuin user sesuai email dan password
    if (findUser == null) {
      //kalo ga ada
      return response.status(400).json({
        message: "username and password wrong!", //ga bisa log in
      });
    }
    let tokenPayLoad = {
      //bikin payload buat token
      id_user: findUser.id_user,
      username: findUser.username,
      role: findUser.role,
      nama_user: findUser.nama_user,
    };
    tokenPayLoad = JSON.stringify(tokenPayLoad);
    let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY);//payload yang udah ada di sign in pake library jwt
    response.cookie('token', token, {
      // httpOnly: true, // Mencegah akses dari JavaScript (XSS protection)
      // secure: process.env.NODE_ENV === 'production', // Hanya kirim cookie di HTTPS (secure flag)
    });

    return response.status(200).json({
      success: true, //klo bisa, muncul pesan "hore uhuy bisa"
      message: "logged in",
      logged: true,
      data: {
        //yang login siapa
        token: token,
        id_user: findUser.id_user,
        nama_user: findUser.nama_user,
        username: findUser.username,
        role: findUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      message: error,
    });
  }
};


exports.refreshToken = async(req, res) =>{
  try {
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken) return res.sendStatus(401);
      const user = await user.findAll({
          where: {
              refresh_token : refreshToken,
          }
      });
      if(!user[0]) return res.sendStatus(403);
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
          if(err) return res.sendStatus(403);
          const id = user[0].id;
          const nama_user = user[0].nama_user;
          const username = user[0].username;
          const role= user[0].role;
          const accessToken = jwt.sign({id, nama_user, username, role}, process.env.ACCESS_TOKEN_SECRET,{
              expiresIn: '5s'
          });
          res.json({accessToken});
      });
  } catch (error) {
      console.log(error);
    }
}

exports.Logout = (request, response) => {
  try {
    response.clearCookie('token');

    return response.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: 'Error logging out',
    });
  }
};



exports.updateUser = async (request, response) => {
  let id_user = request.params.id; //user mana yang mau di update

  let getId = await user.findAll({
    //dicari usernya
    where: {
      [Op.and]: [{ id_user: id_user }],
    },
  });

  if (getId.length === 0) {
    //klo ga nemu
    return response.status(400).json({
      success: false,
      message: "User dengan id tersebut tidak ada",
    });
  }

  let dataUser = {
    //data terbaru yang udah di update
    nama_user: request.body.nama_user,
    username: request.body.username,
    role: request.body.role,
  };

  if (
    //kalo ada yang kosong
    dataUser.nama_user === "" ||
    dataUser.username === "" ||
    dataUser.password === "" ||
    dataUser.role === ""
  ) {
    return response.status(400).json({
      success: false,
      message:
        "Harus diisi semua.Kalau tidak ingin merubah, isi dengan value sebelumnya",
    });
  }

  let existingUser = await user.findAll({
    where: {
      [Op.and]: [
        { id_user: { [Op.ne]: id_user } },
        {
          [Op.or]: [
            { nama_user: dataUser.nama_user }, //cek, nama sama emailnya udah dipake orang lain apa belum
            { username: dataUser.username },
          ],
        },
      ],
    },
  });

  if (existingUser.length > 0) {
    //kalo ternyata udah dipake
    return response.status(400).json({
      status: false,
      message: "Cari nama atau username lain",
    });
  }

  user
    .update(dataUser, { where: { id_user: id_user } })
    .then((result) => {
      return response.json({
        success: true,
        data: dataUser,
        message: `Data user has been updated`,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.getAllUser = async (request, response) => {
  let users = await user.findAll();
  if (users.length === 0) {
    return response.status(400).json({
      success: false,
      message: "no user to show",
    });
  }
  const userCount = users.length;
  return response.json({
    status: true,
    success: users,
    totalUsers: userCount,  
    message: `All user have been loaded`,
  });
};

exports.searchUser = async (req, res) => {
  user
    .findAll({
      // query untuk mencari data user berdasarkan nama user
      where: {
        [Op.or]: [
          // query untuk mencari data user berdasarkan nama user
          { nama_user: { [Op.like]: "%" + req.body.nama_user + "%" } },
          { username: { [Op.like]: "%" + req.body.username + "%" } },
        ],
      },
    })
    .then((result) => {
      // jika berhasil
      if (result.length > 0) {
        // jika data user ditemukan
        res.status(200).json({
          // mengembalikan response dengan status code 200 dan data user
          success: true,
          message: "user berhasil ditemukan",
          data: result,
        });
      } else {
        // jika data user tidak ditemukan
        res.status(400).json({
          // mengembalikan response dengan status code 400 dan pesan error
          success: false,
          message: "user not found",
        });
      }
    })
    .catch((error) => {
      // jika gagal
      res.status(400).json({
        // mengembalikan response dengan status code 400 dan pesan error
        success: false,
        message: error.message,
      });
    });
};

exports.deleteUser = async (request, response) => {
  let id_user = request.params.id; //cari user berdasarkan ID
  user
    .destroy({ where: { id_user: id_user } })
    .then((result) => {
      return response.json({
        success: true,
        message: `data has been delete where id :` + id_user,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.resetpassword = async (req, res) => {
  let id_user = req.params.id;
  const users = await sequelize.query(
    `SELECT * from users where id_user = '${id_user}'`
  );

  let dataUser = {
    passwordlama: req.body.oldPassword,
  };
  if (users.passwordlama == dataUser.password) {
    dataUser.password = md5(req.body.NewPassword);
    user
      .update(dataUser, { where: { id_user: id_user } })
      .then((result) => {
        return res.json({
          success: true,
          data: dataUser,
          message: "Password has been updated",
        });
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  } else {
    return res.json({
      success: false,
      message: "The old password doesn't match, please try again",
    });
  }
};

exports.getById = async (request, response) => {
    user
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
}