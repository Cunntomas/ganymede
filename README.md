# Ganymede

### Ganymede exposes the web server API, handles persistance and delegates the search jobs.

### Routes
> POST /api/product/search

Receives the query, the provider (only "MELI" for the moment) and a callback url
where the results are going to be posted

>{
query: 'product to search',
provider: 'MELI',
callbackUrl: 'http://my-endpoint.com/results'
}


------------


>GET /api/product/search-order/{order-id}

Receives an order id and responds with the orders data.


------------

>GET /api/product/search-orders

Responds with a limited amount of search orders and a nextPage field if
there are remaining search orders

------------

>GET /api/product/category/{product-category-id}

Responds with a limited amount of products related to the product category id and a nextPage field if there are remainig search orders

------------

GET /api/product/products/search-order/{search-order-id}

Responds with a limited amount of products corresponding to the search order id and a nextPage field if there are remaining search orders
