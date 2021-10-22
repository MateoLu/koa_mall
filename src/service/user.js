const User = require("../model/user");

class UserService {
  async create({ username = "", password = "", is_admin = 0 }) {
    const user = await User.create({
      username,
      password,
      is_admin
    });
    return user;
  }

  async findAll() {
    const users = await User.findAll();
    return users;
  }

  async getUserInfo({ username = '', id = '' }) {
    const whereObj = {};
    username && Object.assign(whereObj, { username });
    id && Object.assign(whereObj, { id });

    const userInfo = await User.findOne({
      attributes: ['id', 'username', 'password', 'is_admin'],
      where: whereObj
    });

    return userInfo ? userInfo.dataValues : null;
  }
}

module.exports = new UserService();
