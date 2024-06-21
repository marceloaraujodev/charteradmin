import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Spinner from './Spinner';
import { Reorder, useMotionValue } from 'framer-motion';


// import { image } from 'qr-image';

export default function ServicesForm({
  _id,
  title: currentTitle,
  description: currentDescription,
  price: currentPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties
}) {
  const [title, setTitle] = useState(currentTitle || '');
  const [description, setDescription] = useState(currentDescription || '');
  const [price, setPrice] = useState(currentPrice || '');
  const [goToServices, setGoToServices] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  // gets all categories
  const [categories, setCategories] = useState([]);
  //sets one category
  const [category, setCategory] = useState(assignedCategory);
  const [serviceProperties, setServiceProperties] = useState(assignedProperties || {});
  const [selectedImageIndex, setSelectedImageIndex] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([])


  useEffect(() => {
    axios
      .get('/api/categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  }, []);


  const router = useRouter();
  const serviceData = {
    title,
    description,
    price,
    images,
    category,
    serviceProperties,
  };
  // console.log(serviceData.serviceProperties)
  async function saveService(e) {
    e.preventDefault();

    if (_id) {
      // update product - Change to Service when working on backend
      await axios.put('/api/services', { ...serviceData, _id });
    } else {
      // create product
      await axios.post('/api/services', serviceData);
    }
    setGoToServices(true);
  }

  if (goToServices) {
    router.push('/services');
  }

  async function uploadImages(e) {
    const files = e.target?.files;

    if (files.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages((oldImages) => [...oldImages, ...res.data.links]);
      setIsUploading(false);
    }
  }

  // sets the properties on the select boxes for color storage...
  function setServiceProp(propName, value) {
    setServiceProperties((prev) => {
      const newServiceProps = { ...prev };
      newServiceProps[propName] = value;
      // console.log(newServiceProps)
      return newServiceProps;
    });
  }

  // filling the properties to access them on product edit
  const propertiesToFill = [];
  // category here is the string id of the product
  if (categories.length > 0 && category) {
    // find id of the selected category
    let catInfo = categories.find(({ _id }) => _id === category);
    // console.log(catInfo);
    propertiesToFill.push(...catInfo.properties);

    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  function selectImg(index){
    toggleSelection(index, setSelectedImageIndex)
  }
  
  function selectedImgToDelete(link){
    toggleSelection(link, setImagesToDelete);
  }

  function toggleSelection (item, stateUpdater){
    stateUpdater(prevState => {
      if(prevState.includes(item)){
        return prevState.filter(el => el !== item);
      }else{
        return [...prevState, item]
      }
    })
  }

  async function deleteImg() {
      setImagesToDelete(prevImages => prevImages
        .filter((img) => !selectedImageIndex.includes(img)))

        console.log(imagesToDelete)

      const res = await axios.delete('/api/deleteImages', { data: { urls: imagesToDelete, productId: _id }})

      console.log(res)
  };

  // this function removes the photos that are b
  function removeImgs(){
    // for the interface, returs images that will stay.
    setImages(
      prevImages => prevImages
      .filter((img, index) => !selectedImageIndex.includes(index))
    )
  }


 

  return (
    <form onSubmit={saveService}>
      <label>Service Type</label>
      <input
        type="text"
        placeholder="Service Type"
        className="newproduct"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((category, index) => (
            <option key={`${category._id}-${index}`} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((propEl, index) => (
          <div key={`${propEl._id}-${index}`} className="">
            <label >{propEl.name[0].toUpperCase() + propEl.name.substring(1)}</label>
            <div >
              <select 
                value={serviceProperties[propEl.name]}
                onChange={(e) => {
                  setServiceProp(propEl.name, e.target.value);
                }}   >
                {/* <option value=''>Choose one</option> */}
                {propEl.values.map((val) => (
                  <option 
                    key={`${propEl._id}-${val}`} 
                    value={val}
                    onChange={(e) => {
                      setServiceProp(propEl.name, e.target.value);
                    }}
                  >{val}</option>
                ))}
              </select>  
            </div>
          </div>
        ))}

      <label>Photos</label>

      <div className="mb-2 flex flex-wrap gap-2 py-2 px-1">
        <Reorder.Group
          axis="x"
          values={images}
          onReorder={setImages}
          className="flex flex-wrap gap-1"
        >
          
          {images.length > 0 &&
            images.map((link, index) => (
              <Reorder.Item key={`${link}`} id={link} value={link} as="div" >
                <div
                // setImagesToDelete
                  onClick={() => {
                    selectImg(index, link)
                    selectedImgToDelete(link)
                  }}
                  className={`h-24 bg-white p-4 shadow-sm rounded-md border ${selectedImageIndex.includes(index) ? 'border-red-500' : 'border-gray-300'}` }
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <img src={link} alt="product img" className="rounded-lg" />
                </div>
              </Reorder.Item>
            ))}
          {isUploading && (
            <div className="h-24 text-center flex items-center justify-center ">
              <Spinner />
            </div>
          )}
        </Reorder.Group>

        <label className=" w-24 h-24 border border-gray-200 shadow-sm text-center flex items-center justify-center flex-col text-sm gap-1 text-primary bg-white cursor-pointer rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
            />
          </svg>
          Upload
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
        {images.length > 0  && ( 
          <label className=" w-24 h-24 border border-gray-200 shadow-sm text-center flex items-center justify-center flex-col text-sm gap-1 text-red-500 bg-white cursor-pointer rounded-md">
          <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
            Delete
            <input type="text" className="hidden" onClick={() => deleteImg()} />
          </label>
            )}
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
     
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

