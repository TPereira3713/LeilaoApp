import React, { useState } from 'react';
import { storage } from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AuctionForm = () => {
  const [formData, setFormData] = useState({
    productName: '',
    startingPrice: '',
    auctionDays: '',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const validate = () => {
    const errors = {};

    if (!formData.productName) errors.productName = 'Product name is required.';
    if (!formData.startingPrice || isNaN(formData.startingPrice) || parseFloat(formData.startingPrice) <= 0) {
      errors.startingPrice = 'Starting price is required and must be a positive number.';
    }
    if (!formData.auctionDays || isNaN(formData.auctionDays) || parseInt(formData.auctionDays) <= 0) {
      errors.auctionDays = 'Number of auction days is required and must be a positive number greater than zero.';
    }
    if (formData.images.length === 0) errors.images = 'At least one image is required.';

    return errors;
  };

  const uploadImagesToFirebase = async (images) => {
    const imageUrls = [];

    for (let image of images) {
      const imageName = Date.now() + '_' + image.name;
      const imageRef = ref(storage, 'images/' + imageName);

      try {
        const snapshot = await uploadBytesResumable(imageRef, image);
        const imageUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrorMessage('Failed to upload image(s). Please try again.');
        return [];
      }
    }

    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      const imageUrls = await uploadImagesToFirebase(formData.images);

      if (imageUrls.length === formData.images.length) {
        try {
          const response = await fetch('/api/post/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productName: formData.productName,
              startingPrice: formData.startingPrice,
              auctionDays: formData.auctionDays,
              images: imageUrls
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setSuccessMessage('Product listed successfully!');
            setErrorMessage('');
            setFormData({
              productName: '',
              startingPrice: '',
              auctionDays: '',
              images: []
            });
          } else {
            const errorData = await response.json();
            setSuccessMessage('');
            setErrorMessage(errorData.error || 'Failed to list the product. Please try again.');
          }
        } catch (error) {
          setSuccessMessage('');
          setErrorMessage('Failed to list the product. Please try again.');
        }
      }
    }
  };

  return (
    <form className="max-w-md mx-auto bg-white p-8 mt-10 rounded shadow-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Auction Your Product</h2>

      {['productName', 'startingPrice', 'auctionDays'].map((field) => (
        <div key={field} className="mb-4">
          <label htmlFor={field} className="block text-gray-700 capitalize">
            {field.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <input
            type={field === 'startingPrice' || field === 'auctionDays' ? 'number' : 'text'}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
            min={field === 'startingPrice' || field === 'auctionDays' ? '1' : undefined} // Ensure min value for numbers
          />
          {errors[field] && <div className="text-red-500 text-sm mt-1">{errors[field]}</div>}
        </div>
      ))}

      <div className="mb-4">
        <label htmlFor="images" className="block text-gray-700">
          Images
        </label>
        <input
          type="file"
          id="images"
          name="images"
          onChange={handleImageChange}
          multiple
          className="w-full p-2 border rounded"
        />
        {errors.images && <div className="text-red-500 text-sm mt-1">{errors.images}</div>}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
        Submit
      </button>

      {successMessage && <div className="text-green-500 text-sm mt-4">{successMessage}</div>}
      {errorMessage && <div className="text-red-500 text-sm mt-4">{errorMessage}</div>}
    </form>
  );
};

export default AuctionForm;
