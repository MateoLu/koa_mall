module.exports = {
  ResponseFail(satatusCode, message) {
    return {
      code: satatusCode,
      message,
      success: false
    }
  },
  ResponseSuccess(message, data) {
    const responseBody = { code: 200, message, success: true };
    data && Object.assign(responseBody, { data: data });
    return responseBody;
  }
}