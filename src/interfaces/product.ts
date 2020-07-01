import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document  {
  _id: string,
  SKU: string,
  name: string,
  price: string,
  originalPrice: string,
  productCategoryID: string,
  description: string,
  image: string,
  searchQueries: string
}

export interface IProductResponse {
  SKU: string;
  itemImageURL: string;
  itemName: string;
  itemPrice: string;
  categoryID: string
 }
