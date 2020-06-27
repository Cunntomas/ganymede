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
    searchOrder
  };
  await next();
});

router.get('/search-order/:id', async (ctx, next) => {
  let searchOrderId = ctx.params.id;
  let searchOrder = await SearchOrder.findById(searchOrderId);
  ctx.body = {
    searchOrder
  };
  await next();
});

router.get('/search-orders', async (ctx, next) => {
  let searchOrders = await SearchOrder.find();
  ctx.body = {
    searchOrders
  };
  await next();
});

router.get('/category/:id', async (ctx, next) => {
  ctx.body = {name: ctx.params.id};
  await next();
});

export default router;
