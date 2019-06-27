require('dotenv').config();

const Router = require('koa-router');
const multer = require('koa-multer');

const {
  UPLOAD_PATH: uploadPath
} = process.env;

let upload = multer({
  dest: uploadPath
});

const fileApi = new Router();

fileApi.post('/', upload.any(), (ctx) => {
  let file = ctx.req.files[0];

  let result = {
    resultCode: 1,
    resultMessage: null,
    resultValue: {
      fileName: file.originalname,
      fileSize: file.size,        
      fileSn: 1
    }
  };

  ctx.body = result;
});

module.exports = fileApi;