require('dotenv').config();

const Router = require('koa-router');
const multer = require('koa-multer');

const RESULT_CODE = {
  SUCCESS: 0,
  DATA_EMPTY: 1,
  FAIL: -1,
  API_CALL_ERROR: -2
};

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
}).any();

// api implementations.
const fileApi = new Router();

fileApi.post('/upload', async (ctx, next) => {
  try {
    await upload(ctx, next);
    
    // TODO: save file info. to mongo db
    
    let file = ctx.req.files[0];

    let result = {
      resultCode: RESULT_CODE.SUCCESS,
      resultMessage: null,
      resultValue: {
        fileName: file.originalname,
        fileSize: file.size,        
        fileSn: 1,
        fileUrl: `${ctx.host}${downloadUrlPrefix}/${file.uploadedFileName}`
      }
    };
  
    ctx.body = result;    
  } catch(ex) {
    ctx.body = { resultCode: RESULT_CODE.FAIL,  resultMessage: ex.message,  resultValue: null };
  }
});

fileApi.get('/:fileSn', ctx => {

  // TODO: get file info. from mongo db.

  let result = {
    resultCode: 1,
    resultMessage: null,
    resultValue: {
      fileName: '123',
      fileSize: '123',        
      fileSn: 1,
      fileUrl: '123'
    }
  };

  ctx.body = result;
});

module.exports = fileApi;