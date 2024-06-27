import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { parseISO, isAfter } from 'date-fns';
import ItemBox from '../components/ItemBox';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/post/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const currentDateTime = new Date();

  return (
    <div className="homepage grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {posts
        .filter(post => {
          const expirationDate = parseISO(post.saleExpirationDate);
          return isAfter(expirationDate, currentDateTime);
        })
        .map(post => (
          <Link key={post._id} to={`/item/${post._id}`}>
            <ItemBox
              image={post.images[0]}
              productName={post.productName}
              price={Math.max(post.startingPrice, post.highestBidPrice)}
              saleExpirationDate={post.saleExpirationDate}
            />
          </Link>
        ))}
    </div>
  );
};

export default HomePage;
