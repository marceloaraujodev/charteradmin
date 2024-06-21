// Service.js

import categories from '@/pages/categories';
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  images: [
    {type: String}
  ],
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category'
  },
  properties: {type: Object}, 
},
{timestamps: true}
);

const Service =
  mongoose.models.Service || mongoose.model('Service', ServiceSchema);

export default Service;

// // imges was like this and working change to array of objs if breaks change it
// {
//   type: [String],
// }