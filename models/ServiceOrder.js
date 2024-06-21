import mongoose from "mongoose";

const ServiceOrderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: String,
  description: String,
  date: String,
  price: Number
}, {
  timestamps: true
});

const ServiceOrder = mongoose.models.ServiceOrder || mongoose.model("ServiceOrder", ServiceOrderSchema);

export default ServiceOrder