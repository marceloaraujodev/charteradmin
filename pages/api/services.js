import Service from '@/models/Service';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  // makes the admin panel secure
  await isAdminRequest(req, res);
  console.log('connected to DB');
  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Service.findOne({ _id: req.query.id }));
    } else {
      res.json(await Service.find());
    }
  }
  // creates Service
  if (method === 'POST') {
    const { title, description, price, images, category, productProperties } =
      req.body;
    const newProduct = await Service.create({
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    });
    console.log(newProduct);
    res.json(newProduct);
  }
  // updates Service
  if (method === 'PUT') {
    const {
      title,
      description,
      price,
      _id,
      images,
      category,
      productProperties,
    } = req.body;
    console.log('this should be Service Properties:', productProperties)
    const data = await Service.findOneAndUpdate(
      { _id },
      {
        title,
        description,
        price,
        _id,
        images,
        category,
        properties: productProperties,
      }
    );
    console.log('this is data from PUT', data);
    res.json(true);
  }
  if (method === 'DELETE') {
    if (req.query?.id) {
      console.log(req.query?.id);
      await Service.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
