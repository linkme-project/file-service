require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router'); 
const api = require('./api');
const app = new Koa();

// load environment variables
const {
    PORT: port
} = process.env;

const router = new Router();
router.use('/api', api.routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(ctx => {
    ctx.body = 'hello file-service';
    console.log('hello file-service');
});

app.listen(port, () => {
    console.log(`file server is listening to port ${port}`);
});