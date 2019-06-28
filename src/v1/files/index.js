require('dotenv').config();

const Router = require('koa-router');
const multer = require('koa-multer');

// load environment variables.
const {
  UPLOAD_PATH: uploadPath,
  DOWNLOAD_URL_PREFIX: downloadUrlPrefix
} = process.env;

// configure multer options.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const splittedFileName = file.originalname.split('.');

    const newFileName = `${splittedFileName[0]}-${Date.now()}.${splittedFileName[splittedFileName.length - 1]}`;
    file.uploadedFileName = newFileName;

    cb(null, newFileName);
  }
});

let upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// api implementations.
const fileApi = new Router();

fileApi.post('/upload', upload.any(), (ctx) => {
  let file = ctx.req.files[0];

  let result = {
    resultCode: 1,
    resultMessage: null,
    resultValue: {
      fileName: file.originalname,
      fileSize: file.size,        
      fileSn: 1,
      fileUrl: `${ctx.host}${downloadUrlPrefix}/${file.uploadedFileName}`
    }
  };

  ctx.body = result;
});

fileApi.get('/:fileSn', upload.any(), (ctx) => {
  // TODO: get file info. from mongo db.
  ctx.body = ctx.params.fileSn;
});

module.exports = fileApi;