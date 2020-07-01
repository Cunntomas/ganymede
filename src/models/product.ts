import mongoose from 'mongoose';
import {IProduct} from '../interfaces';
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    SKU: {
      type: String,
      required: true
    },
    name: String,
    price: String,
    originalPrice: String,
    productCategoryID: String,
    description: String,
    image: String,
    searchQueries: {
        type: Schema.Types.ObjectId,
        ref: 'SearchOrder',
        required: true
    }
});

export let Product = mongoose.model<IProduct>('product', ProductSchema);
