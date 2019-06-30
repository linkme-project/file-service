const Router = require('koa-router');
const fileApi = require('./api');

const api = new Router();

api.use('/files', fileApi.routes());

module.exports = api;