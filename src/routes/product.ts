import Router from "koa-router";
import {SearchOrder} from './../models/index';
const router = new Router();

router.post('/search', async (ctx, next) => {
  let searchOrder = new SearchOrder({
      query: ctx.request.body.query,
      status: 'received'
  });
  searchOrder = await searchOrder.save();
  ctx.body = {
    status: 'Search order received',
    searchOrder
  };
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
