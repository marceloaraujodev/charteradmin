import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";


export default async function ordersHandler(req, res) {
  await mongooseConnect();

  const {method} = req
  console.log(method)

  if(method === 'POST'){
    console.log(req.body)
    const {shipped, _id} = req.body
    console.log(shipped, _id)

    const update = await Order.findOneAndUpdate({_id}, {shipped: shipped}, {new: true})
    console.log(update)
  }

  const order = await Order.find().sort({createdAt:-1});
  // console.log(order)
  res.json(order)
}
