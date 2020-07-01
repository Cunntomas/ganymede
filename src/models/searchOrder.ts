import mongoose from 'mongoose';
import {ISearchOrder} from '../interfaces';
const Schema = mongoose.Schema;

const SearchOrderSchema = new Schema({
    query: String,
    provider: String,
    options: {
      key: String,
      type: String
    },
    callbackUrl: String,
    status: String
});


export let SearchOrder = mongoose.model<ISearchOrder>('searchOrder', SearchOrderSchema);
