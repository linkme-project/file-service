const Router = require('koa-router');
const fileApi = require('./files');

const api = new Router();

api.use('/files', fileApi.routes());

module.exports = api;