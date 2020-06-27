import Router from "koa-router";

const router = new Router();

router.post('/search', async (ctx, next) => {
  ctx.body = {name: ctx.request.body.name};
  await next();
});

router.get('/search-order/:id', async (ctx, next) => {
  ctx.body = {name: ctx.params.id};
  await next();
});

router.get('/search-orders', async (ctx, next) => {
  ctx.body = {name: "tomás"};
  await next();
});

router.get('/category/:id', async (ctx, next) => {
  ctx.body = {name: ctx.params.id};
  await next();
});
export default router;
