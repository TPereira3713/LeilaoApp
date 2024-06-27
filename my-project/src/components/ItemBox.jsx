import React from 'react';
import { format, parseISO } from 'date-fns';

const ItemBox = ({ image, productName, price, saleExpirationDate }) => {
  const formattedDate = format(parseISO(saleExpirationDate), 'dd/MM/yyyy HH:mm:ss');

  return (
    <div className="border rounded shadow-md p-4 hover:shadow-lg transition-shadow">
      <img src={image} alt={productName} className="w-full h-48 object-cover mb-4 rounded" />
      <h3 className="text-xl font-bold mb-2">{productName}</h3>
      <p className="text-lg font-semibold mb-2">Current Price: ${price}</p>
      <p className="text-gray-500">Expires on: {formattedDate}</p>
    </div>
  );
};

export default ItemBox;
