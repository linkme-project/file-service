/* eslint-disable require-atomic-updates */
require('dotenv').config();

const Router = require('koa-router');
const multer = require('koa-multer');

const fileController = require('../file/file.controller');
const RESULT_CODE = require('../constants').RESULT_CODE;

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
    
    let file = ctx.req.files[0];

    let result = {
      resultCode: RESULT_CODE.SUCCESS,
      resultMessage: null,
      resultValue: {  
        fileId: null,
        fileName: file.originalname,
        fileSize: file.size,        
        fileUrl: `${ctx.host}${downloadUrlPrefix}/${file.uploadedFileName}`,
        regDate: new Date()
      }
    };

    // save file info. to mongo db
    const insertedFile = await fileController.create(result.resultValue);
    result.resultValue.fileId = insertedFile._id;

    ctx.body = result;
  } catch (ex) {
    ctx.body = { resultCode: RESULT_CODE.FAIL,  resultMessage: ex.message,  resultValue: null };
  }
});

fileApi.get('/:fileId', async ctx => {
  let file, result;
  // get file info. from mongo db.
  try {
    file = await fileController.search(ctx.params.fileId);

    result = {
      resultCode: file === null ? RESULT_CODE.DATA_EMPTY : RESULT_CODE.SUCCESS,
      resultMessage: file === null ? 'File is not exists' : null,
      resultValue: file
    };
  
  } catch (ex) {
    result = {
      resultCode: RESULT_CODE.DB_FAILURE,
      resultMessage: ex.message,
      resultValue: file
    };  
  }

  ctx.body = result;
});

module.exports = fileApi;