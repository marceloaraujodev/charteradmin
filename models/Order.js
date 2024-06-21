import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  line_items: Object,
  name: String,
  city: String,
  email: String,
  streetAddress: String,
  country: String,
  zipcode: String,
  paid: Boolean,
  shipped: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }
);

const Order = mongoose.models?.Order || mongoose.model('Order', OrderSchema);

export default Order;