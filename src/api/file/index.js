const Router = require('koa-router');

const fileApi = new Router();

fileApi.get('/', (ctx) => {
  ctx.body ='hi';
});

module.exports = fileApi;