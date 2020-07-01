import Router from "koa-router";
import {SearchOrder, Product} from './../models';
import scrapperHelper from '../utils/scrapper-helper';
const router = new Router();

router.post('/search', async (ctx, next) => {
  const data = ctx.request.body;
  let searchOrder = new SearchOrder({
        query: data.query,
        status: 'received',
        callbackUrl: data.callbackUrl,
        provider: data.provider
  });
  if(data.options) {
    searchOrder.options = data.options;
  }
  searchOrder = await searchOrder.save();
  scrapperHelper.sendSearch(searchOrder);
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

router.post('/results', async (ctx, next) => {
  const request = ctx.request.body;
  let order = await SearchOrder.findOne({'_id': request.searchJob});
  if(!order) {
    ctx.body = { message: 'Invalid SearchOrderID' }
    ctx.status = 400;
    await next();
  }
  if(!request.results) {
    order.status = 'failed';
    await order.save()
  }
  request.results.map((result) => {
    let product = new Product({
        SKU: request.SKU,
        image: request.itemImageURL,
        name: request.itemName,
        price: request.itemPrice,
        productCategoryID: request.categoryID
    });
    product.save();
  });

  ctx.body = { message: 'results received'};
  await next();
});


export default router;
