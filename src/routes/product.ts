import Router from "koa-router";
import {IProductResponse} from '../interfaces';
import {SearchOrder, Product} from './../models';
import scrapperHelper from '../utils/scrapper-helper';
import {sendResults} from '../utils/callback-helper';
const router = new Router();
const SEARCH_ORDER_LIMIT = Number(process.env.SEARCH_ORDER_LIMIT) || 10;
const PRODUCT_LIMIT = Number(process.env.PRODUCT_LIMIT) || 10;


/*
  POST/ ROUTE TO SEND A SEARCH JOB
*/
router.post('/search', async (ctx, next) => {
  try {
    const data = ctx.request.body;
    //VALIDATION OF REQUEST NECESARY FIELDS
    if(!data.query || !data.provider || !data.callbackUrl) {
      ctx.body = {
        error: 'missing_fields',
        message: 'query, provider and callbackUrl are mandatory fields.'
      }
      ctx.status = 400;
      return next();
    }
    let searchOrder = new SearchOrder({
      query: data.query,
      status: 'received',
      callbackUrl: data.callbackUrl,
      provider: data.provider
    });
    if(data.options) {
      searchOrder.options = data.options;
    }

    //THE ORDER IS SAVED TO THE DB AND A CALL TO THE SCRAPPER IS MADE
    searchOrder = await searchOrder.save();

    scrapperHelper.sendSearch(searchOrder);
    ctx.body = {
      searchOrder
    };
    return next();
  } catch(error) {
    ctx.body = { message: 'An error has ocurred' }
    ctx.status = 500;
    return next();
  }

});

/*
  GET/ ROUTE TO GET A SINGLE SEARCH ORDER BY ITS ID
*/
router.get('/search-order/:id', async (ctx, next) => {
  try {
    let searchOrderId = ctx.params.id;
    if(!searchOrderId) {
      ctx.body = { message: 'Search order ID is requied' };
      ctx.status = 400;
      return next();
    }
    let searchOrder = await SearchOrder.findById(searchOrderId);
    ctx.body = {
      searchOrder
    };
    return next();
  } catch(error) {
    ctx.body = { message: 'An error has ocurred' }
    ctx.status = 500;
    return next();
  }
});


/*
  GET/ ROUTE TO GET ALL SEARCH ORDERS
  RESPONDS WITH A LIMITED AMOUNT AND A nextPage FIELD IF THERE ARE REMAINING SEARCH ORDERS
*/
router.get('/search-orders', async (ctx, next) => {
  try {
    ctx.body = {};
    let page = Number(ctx.request.query.page) || 0;
    let count = await SearchOrder.count({});
    let skip = page * SEARCH_ORDER_LIMIT;

    if(SEARCH_ORDER_LIMIT * (page + 1) < count) {
      page++;
      ctx.body.nextPage = `/api/product/search-orders?page=${page}`;
    }

    let searchOrders = await SearchOrder.find().limit(SEARCH_ORDER_LIMIT).skip(skip);
    ctx.body.searchOrders = searchOrders;
    return next();
  } catch(error) {
    ctx.body = { message: 'An error has ocurred' }
    ctx.status = 500;
    return next();
  }
});


/*
  GET/ ROUTE TO GET ALL PRODUCTS BY THEIR CATEGORY ID
  RESPONDS WITH A LIMITED AMOUNT AND A nextPage FIELD IF THERE ARE REMAINING PRODUCTS
*/
router.get('/category/:id', async (ctx, next) => {
  try {
    ctx.body = {};
    let productCategoryID = ctx.params.id;
    if(!productCategoryID) {
      ctx.body = { message: 'Category ID is requied' };
      ctx.status = 400;
      return next();
    }
    //PAGINATION
    let page = Number(ctx.request.query.page) || 0;
    let count = await Product.count({});
    let skip = page * PRODUCT_LIMIT;

    if(PRODUCT_LIMIT * (page + 1) < count) {
      page++;
      ctx.body.nextPage = `/api/product/category/${productCategoryID}?page=${page}`;
    }


    let products = await Product.find({
      productCategoryID
    })
    .limit(PRODUCT_LIMIT)
    .skip(skip);

    ctx.body.products = products;
    return next();
  } catch(error) {
    ctx.body = { message: 'An error has ocurred' }
    ctx.status = 500;
    await next();
  }
});

/*
  GET/ ROUTE TO GET ALL PRODUCTS BY THEIR RELATED SEARCH ORDER
  RESPONDS WITH A LIMITED AMOUNT AND A nextPage FIELD IF THERE ARE REMAINING SEARCH ORDERS
*/
router.get('/products/search-order/:id', async (ctx, next) => {
  try {
    ctx.body = {};
    let searchOrderID = ctx.params.id;
    if(!searchOrderID) {
      ctx.body = { message: 'Search order ID is required' };
      ctx.status = 400;
      return next();
    }
    //PAGINATION
    let page = Number(ctx.request.query.page) || 0;
    let count = await Product.count({searchOrder: searchOrderID});
    let skip = page * PRODUCT_LIMIT;

    if(PRODUCT_LIMIT * (page + 1) < count) {
      page++;
      ctx.body.nextPage = `/api/product/products/search-order/${searchOrderID}?page=${page}`;
    }

    let products = await Product.find({
      searchOrder: searchOrderID
    })
    .limit(PRODUCT_LIMIT)
    .skip(skip);

    ctx.body.products = products;
    return next();
  } catch(error) {
    ctx.body = { message: 'An error has ocurred' }
    ctx.status = 500;
    await next();
  }
});


/*
  POST/ ROUTE THAT RECEIVES THE SEARCH RESULTS FROM THE THEMISTO API
  IDEALLY THIS WOULD BE A WEBHOOK BUT FOR LACK OF TIME I RESOLVED IT WITH AN HTTP ROUTE
*/
router.post('/results', async (ctx, next) => {
  try {
    const request = ctx.request.body;
    if(!request.searchJob) {
      ctx.body = { message: 'Search order ID is required' };
      ctx.status = 400;
      return next();
    }
    let order = await SearchOrder.findOne({'_id': request.searchJob});

    //IF THE INCOMING REQUEST HAS RESULTS, THE PRODUCTS ARE SAVED AND THE ORDER IS
    //MARKED AS FULFILLED, IF NOT, ITS MARKED AS FAILED
    if(request.results && request.results.length > 0) {
      let category = request.results[0].categoryID.replace(/[^a-zA-Z0-9]/g, '');
      request.results.map((result: IProductResponse) => {
        let product = new Product({
          SKU: result.SKU,
          image: result.itemImageURL,
          name: result.itemName,
          price: result.itemPrice,
          productCategoryID: category,
          searchOrder: request.searchJob
        });
        product.save();
      });
      order.status = 'fulfilled';
      sendResults(request.results, order);
    } else {
      order.status = 'failed';
    }

    await order.save();

    ctx.body = { message: 'results received'};
    return next();
  } catch(error) {
    ctx.body = { message: 'An error has ocurred' }
    ctx.status = 500;
    return next();
  }
});


export default router;
