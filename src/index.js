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
  ctx.body = 
    `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
      </head>
      <body>
      
          <form action="/api/files" method="post" enctype="multipart/form-data">
              <input type="file" name="imgFile">
              <input type="submit" value="파일 업로드 테스트">
          </form>
      
      </body>
      </html>`;
});

app.listen(port, () => {
  console.log(`file server is listening to port ${port}`);
});