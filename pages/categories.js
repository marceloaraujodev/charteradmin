import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import { withSwal } from 'react-sweetalert2';

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);

function Categories({ swal }) {
  const [editededCategory, seteditedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(e) {
    e.preventDefault();

    const emptyProperty = properties.filter(property => property.name === '' || property.values === '');

    if(emptyProperty.length > 0){
      alert('Please fill property name and values or delete the property if not using it');
      return
    }

    const data = { 
      categoryName, 
      parentCategory, 
      properties: properties.map(propertyEl => ({
        name: propertyEl.name, 
        values: propertyEl.values.split(',') // turns values into Array!
      }))
    };
    // console.log(data);

    if (editededCategory) {
      data._id = editededCategory._id;
      await axios.put('/api/categories', data);
      seteditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setCategoryName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    seteditedCategory(category);
    setCategoryName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      /* destructure the name and values properties from each el. 
       Because when editing, the values is a [] and values displayed is as strings. so [blue, red], 'green'. join will get blue, red, and join to green , blue, red, green and on resave will turn the new properties into array again [blue, red, green] */
      category.properties.map(({name, values}) => (
        {name, values: values.join(',')}
      ))
      
    )
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${category.name} categories?`,
        showCancelButton: true,
        cancelButtonTittle: 'Cancel',
        confirmButtonText: 'Yes!',
        confirmButtonColor: '#d55',
      })
      .then(async (result) => {
        console.log({ result });
        if (result.isConfirmed) {
          await axios.delete('/api/categories?_id=' + category._id);
          fetchCategories();
        }
      });
  }

  function handlePropertyNameChange(index, property, newName){
    // console.log(index, property, newName)
    setProperties(prev => {
      // creates an array with the prevs data, and returns the new array the final is setProperties becomes the new array
      const properties = [...prev];
      properties[index].name = newName;
      return properties
    })

  }
  
  function handlePropertyValuesChange(index, property, newValues){
    // console.log(index, property, newName)
    setProperties(prev => {
      // creates new array with old data
      const properties = [...prev];
      //grabs the value from its current values input box and sets it to the new value
      properties[index].values = newValues
      // returns the newly created array as the value for the setProperties (setProperties(values))
      return properties
    })
  }

  // properties from Products, like color memory
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: '', values: '' }];
    });
  }

  function removeProperty(index){
    setProperties(prev => {
      // propertyEl is not use, its only recieved so we can access its index
      const newProperties = [...prev].filter((propertyEl, pIndex) => pIndex !== index);
      return newProperties
    })
  }

  return (
    <Layout>
      <h1>categories</h1>
      <label>
        {editededCategory
          ? `Edit ${editededCategory.name} category`
          : 'Create new category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            value={categoryName}
            placeholder="Category Name"
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {' '}
                  {category.name}
                </option>
              ))}
          </select>
        </div>


        <div className="mb-4">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm mb-4"
            onClick={addProperty}
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  className='mb-0'
                  value={property.name}
                  onChange={e => handlePropertyNameChange(index, property, e.target.value)}
                  placeholder="property name (ex. color)"
                />

                <input
                  type="text"
                  className='mb-0'
                  value={property.values}
                  onChange={e => handlePropertyValuesChange(index, property, e.target.value)}
                  placeholder="values, comma separeted"
                    />
                <button
                      className="btn-red flex items-center"
                      type='button'
                      onClick={(e) => {
                        removeProperty(index)
                      }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-1">
          <button type="submit" className="btn-primary">
            Save
          </button>

          {editededCategory && (
            <button type="button" className="btn-default" onClick={() => {
                seteditedCategory(null)
                setCategoryName('')
                setParentCategory('')
                setProperties([])
              }}>
              Cancel
            </button>
          )}
        </div>

      </form>

      {!editededCategory && 
        (
          <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td className="flex justify-center">
                  <div className="flex gap-1">
                    <button
                      className="btn-default flex items-center gap-1"
                      onClick={() => editCategory(category)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="btn-red flex items-center gap-1"
                      onClick={() => deleteCategory(category)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
        )
      }      

    </Layout>
  );
}
