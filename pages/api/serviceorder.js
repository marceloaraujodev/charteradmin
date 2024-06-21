import ServiceOrder from "@/models/ServiceOrder";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

// connnect to db and add serviceorder to db respond to frontend

export default async function handle(req, res){
  const {method} = req;
  await mongooseConnect();
  console.log('connected to DB');
  if(method === 'POST'){
    console.log('this')
    res.json('ok')
  }
}