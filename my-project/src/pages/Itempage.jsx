import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { format, parseISO } from 'date-fns';

const ItemPage = () => {
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidPrice, setBidPrice] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (currentUser?.token) {
      try {
        const decodedToken = jwtDecode(currentUser.token);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/post/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch item');
        }
        const data = await response.json();
        setItem(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item:', error);
        setLoading(false);
      }
    };

    fetchItem();
  }, [postId]);

  const handleBidSubmit = async () => {
    if (!bidPrice || isNaN(parseFloat(bidPrice)) || parseFloat(bidPrice) <= 0) {
      setError('Please enter a valid bid price.');
      return;
    }

    if (userEmail === item.sellerEmail) {
      setError("You cannot bid on your own item.");
      return;
    }

    try {
      const response = await fetch(`/api/post/${postId}/bid`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bidPrice: parseFloat(bidPrice), bidderEmail: userEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to place bid');
      }

      const updatedItem = await response.json();
      setItem(updatedItem);
      setBidPrice('');
      setError('');
      alert('Bid placed successfully');
    } catch (error) {
      console.error('Error placing bid:', error);
      setError('Failed to place bid');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="text-center mt-8">You need to login to see this item.</div>;
  }

  if (!item) {
    return <div className="text-center mt-8">Error: Item not found.</div>;
  }

  const formattedDate = format(parseISO(item.saleExpirationDate), 'dd/MM/yyyy HH:mm:ss');

  const settings = {
    dots: true,
    infinite: item.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 border rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{item.productName}</h2>
        <span className="text-gray-500">{`Expires: ${formattedDate}`}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Slider {...settings}>
            {item.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={item.productName} className="rounded-lg w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="p-4">
          <p className="text-lg font-semibold">{`Starting Price: $${item.startingPrice.toFixed(2)}`}</p>
          <p className="text-lg font-semibold">{`Highest Bid Price: $${item.highestBidPrice.toFixed(2)}`}</p>
          {userEmail === item.sellerEmail ? (
            <p className="text-lg text-blue-500">
              This is your item, the auction ends on {formattedDate}.
            </p>
          ) : (
            <div className="mt-4">
              <label htmlFor="bidPrice" className="block text-sm font-medium text-gray-700">
                Your Bid
              </label>
              <input
                type="number"
                id="bidPrice"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                onClick={handleBidSubmit}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Place Bid
              </button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
