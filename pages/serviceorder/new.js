import Layout from '@/components/Layout';
import ServiceOrderForm from '@/components/ServiceOrderForm';

export default function NewProduct() {
  return (
    <Layout>
      <h1>
        <b>New Service Order</b>
      </h1>
      <ServiceOrderForm />
    </Layout>
  );
}
