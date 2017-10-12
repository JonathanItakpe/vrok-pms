/**
 * ResponseService.js
 */

module.exports = {  
  json: function (status, statusText, res, message, data, meta) {
    var response = {
      message: message
    };
    if (typeof data !== 'undefined') {
      response.data = data;
    }
    if (typeof meta !== 'undefined') {
      response.meta = meta;
    }
    if (typeof statusText !== 'undefined') {
      response.status = statusText;
    }

    return res.status(status).json(response);
  }
};