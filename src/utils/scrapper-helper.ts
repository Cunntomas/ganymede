import request from 'request-promise';
import {ISearchOrder} from '../interfaces';
import {SearchOrder} from '../models';

class ScrapperHelper {
  private SCRAPPER_ENDPOINT = process.env.SCRAPPER_ENDPOINT;
  private CALLBACK_URL = process.env.CALLBACK_URL;

  public async sendSearch(searchJob: ISearchOrder) {
      let body = {
        query: searchJob.query,
        provider: searchJob.provider,
        callbackURL: this.CALLBACK_URL,
        searchID: searchJob._id
      };
      return request({
        uri: this.SCRAPPER_ENDPOINT,
        method: 'POST',
        body,
        json: true
      })
      .then((resp) => {
          return SearchOrder.findOneAndUpdate({"_id": searchJob._id}, {status: 'processing'});
      })
      .catch((error) => {
          return SearchOrder.findOneAndUpdate({"_id": searchJob._id}, {status: 'failed'});
      })
  }
}

export default new ScrapperHelper();
