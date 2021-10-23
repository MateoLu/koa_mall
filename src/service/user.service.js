const User = require("../model/user.model");

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

  async updateById({ id, username, password, is_admin }) {
    const newUser = {};
    username && Object.assign(newUser, { username });
    password && Object.assign(newUser, { password });
    is_admin && Object.assign(newUser, { is_admin });
    
    const res = await User.update(modifyBody, { where: { id } });
    return res[0];
  } 
}

module.exports = new UserService();
