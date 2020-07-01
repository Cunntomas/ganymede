import mongoose from 'mongoose';

interface IProduct extends mongoose.Document  {
  _id: string,
  SKU: {
    type: string,
    required: boolean
  },
  name: string,
  price: string,
  originalPrice: string,
  productCategoryID: string,
  description: string,
  image: string,
  searchQueries: string
}

export default IProduct;
