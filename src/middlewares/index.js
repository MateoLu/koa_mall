const { auth, adminPermission } = require("./auth.middleware");
const { verifyGoodsId } = require("./cart.middleware");
const { validator } = require("./common.middleware");
const { uploadOnlyImage, verifyUpload } = require("./upload.middleware");
const {
  userFormValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
} = require("./user.middleware");

module.exports = {
  userFormValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
  uploadOnlyImage,
  verifyUpload,
  validator,
  verifyGoodsId,
  auth,
  adminPermission,
};
