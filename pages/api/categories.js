import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Categories";
import {isAdminRequest} from '@/pages/api/auth/[...nextauth]';

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();

  // makes the admin panel secure
  await isAdminRequest(req, res);

  // console.log(session) // session contains user info and expires
  
  if(method === 'GET'){
    res.json(await Category.find().populate('parent'))
  }

  if(method === 'POST'){
    const {categoryName, parentCategory, properties} = req.body;
    console.log(req.body)
    
    // if parent is empty string it will accept and set it to null
    const parentCategoryId = parentCategory || null;

    const categoryDoc = await Category.create({ 
      name: categoryName, 
      parent: parentCategoryId,
      properties
    })
    res.json(categoryDoc)
  }

  if(method === 'PUT'){
    const {categoryName, parentCategory, properties, _id} = req.body;
    console.log(req.body)


    const categoryDoc = await Category.updateOne({_id},{ 
      name: categoryName, 
      parent: parentCategory,
      properties
    })
    res.json(categoryDoc)
  }

  if(method === 'DELETE'){
    // categories?_id=' + category._id
    const {_id} = req.query;
    console.log(_id)
    await Category.deleteOne({_id})

    res.status(200).json('success')
  }
}
