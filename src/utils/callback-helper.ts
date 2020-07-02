import request from 'request-promise';
import {IProduct, ISearchOrder} from '../interfaces';

async function sendResults(products: Array<IProduct>, searchOrder: ISearchOrder) {
  try {
    let body = {
      products,
      searchOrder
    }
    await request({
      uri: searchOrder.callbackUrl,
      body,
      json: true,
      method: 'POST'
    });
  } catch(error) {
    console.error(`An error ocurred when sending results: ${error}`);
  }
}

export {
  sendResults
};
