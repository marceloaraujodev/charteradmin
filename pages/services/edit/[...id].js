import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ServiceForm from '@/components/ServiceForm';

export default function EditProductPage() {
  const [serviceInfo, setServiceInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/services?id='+id).then((response) => {
      setServiceInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <h1><b>Edit Services</b></h1>
      {serviceInfo && (<ServiceForm {...serviceInfo} />)}
    </Layout>
  );
}
