import mongoose from 'mongoose';

const SearchOrder = new mongoose.Schema({
    query: String,
    provider: String,
    options: {
      key: String,
      type: String
    },
    callbackUrl: String,
    status: {
      type: String,
      enum: ['received', 'processing', 'fulfilled', 'failed']
    },
    results: [String]
});

export default mongoose.model("searchOrder", SearchOrder);
