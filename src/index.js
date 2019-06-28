require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router'); 
const serve = require('koa-static');
const mount = require('koa-mount');

const app = new Koa();

// load environment variables.
const {
  PORT: port,
  API_VERSION: apiVersion,
  UPLOAD_PATH: uploadPath,
  DOWNLOAD_URL_PREFIX: downloadUrlPrefix
} = process.env;

// set api router to /<apiVersion>. e.g. /v1 
const api = require(`./${apiVersion}`);

const router = new Router();
router.use(`/${apiVersion}`, api.routes());

// set koa middlewares.
app.use(mount(downloadUrlPrefix, serve(uploadPath)));
app.use(router.routes());
app.use(router.allowedMethods());

app.use(mount('/test', ctx => {
  ctx.body = 
    `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
      </head>
      <body>
          <form action="/${apiVersion}/files/upload" method="post" enctype="multipart/form-data">
              <input type="file" name="file">
              <input type="submit" value="파일 업로드 테스트">
          </form>
      </body>
      </html>`;
}));

// start file service.
app.listen(port, () => {
  console.log(`file server is listening to port ${port}`);
});