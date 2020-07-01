import mongoose from 'mongoose';

interface ISearchOrder extends mongoose.Document {
  query: string,
  provider: string,
  options?: {
    key: string,
    type: string
  },
  callbackUrl: string,
  status: String
}

export default ISearchOrder;
