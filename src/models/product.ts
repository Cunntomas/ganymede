import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Product = new Schema({
    SKU: {
      type: String,
      required: true
    },
    name: String,
    price: String,
    originalPrice: String,
    productCategoryID: String,
    description: String,
    images: String,
    searchQueries: [{
        type: Schema.Types.ObjectId,
        ref: 'SearchOrder',
        required: true
    }]
});

export default mongoose.model("product", Product);
