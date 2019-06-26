const Router = require('koa-router');
const fileApi = require('./file');

const api = new Router();

api.use('/files', fileApi.routes());

module.exports = api;