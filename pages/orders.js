import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isShipped, setIsShipped] = useState(false)

  useEffect(() => {
    axios.get('/api/orders').then(response => {
      console.log(response.data)
      setOrders(response.data);
    });
  }, [])

 async function handleClick(_id){
  setIsShipped(true)
  const res = await axios.post('/api/orders', {shipped: true, _id})
  console.log(res.data)
 }

  return (
    <Layout>
      <h1>Orders</h1>
      <Link href={'/serviceorder/new'} className="btn-primary">Create Service Order</Link>
      <table className="basic">
        <thead>
          <tr>
            <th>Shipped</th>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Services</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 && orders.map((order, index) => (
            <tr key={order._id}>
                <td>
                {isShipped || order.shipped ? (
                  <span className='text-green-600'>Shipped</span>
                ) : (
                  <button onClick={() => handleClick(order._id)} className="bg-gray-200 py-1 px-2 rounded-md border-solid border-2 border-gray-400">Shipped</button>
                )}


                </td>
              <td >{(new Date(order.createdAt)).toLocaleString('en-US', { timeZone: 'UTC' })}</td>
              <td className={order.paid ? 'text-green-600' : 'text-red'}>{order.paid ? 'Paid' : 'Waiting Payment' }</td>
              <td>{order.name}<br /> {order.email}<br />
              {order.streetAddress}<br />
              {order.city} {order.zipcode}<br />
              {order.country}
              </td>
              <td>
              {order.line_items.map(l => (
                  <>
                    {l.price_data?.product_data.name} x {l.quantity}<br />
                    
                  </>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}
