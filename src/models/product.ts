import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Product = new Schema({
    SKU: String,
    name: String,
    price: String,
    originalPrice: String,
    productCategoryID: String,
    description: String,
    images: String,
    searchQueries: [{
        type: Schema.Types.ObjectId,
        ref: 'SearchOrder'
    }]
});

export default mongoose.model("product", Product);
