import  { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../../Components/services/baseUrl';

export default function Modal() {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [exchangeDetails, setExchangeDetails] = useState({
    exchangeProduct: 0,
    exchangeTotal: 0,
    cartTotal: 0,
    difference: 0,
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (invoiceNo) {
      fetchOrderDetails();
    }
  }, [invoiceNo]);

  const handleInvoiceChange = (e) => {
    setInvoiceNo(e.target.value);
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/orders/order/invoice/${invoiceNo}`);
      const order = response.data;
      console.log(order);
      
      setProducts(order.cartItems);
      calculateExchangeDetails(order.cartItems, order.totalAmount);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const calculateExchangeDetails = (cartItems, exchangeTotal) => {
    const cartTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const difference = exchangeTotal - cartTotal;

    setExchangeDetails({
      exchangeProduct: cartItems.length,
      exchangeTotal,
      cartTotal,
      difference,
    });
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, quantity: parseInt(quantity, 10) } : product
    );
    setProducts(updatedProducts);
    calculateExchangeDetails(updatedProducts, exchangeDetails.exchangeTotal);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    calculateExchangeDetails(updatedProducts, exchangeDetails.exchangeTotal);
  };

  const clearExchange = () => {
    setInvoiceNo('');
    setExchangeDetails({
      exchangeProduct: 0,
      exchangeTotal: 0,
      cartTotal: 0,
      difference: 0,
    });
    setProducts([]);
  };

  const continueExchange = () => {
    console.log('Continuing with exchange');
    // Add your exchange continuation logic here
  };

  return (
    <div className="flex bg-white  flex-col top-5 items-center justify-center w-full h-5/6 py-2">
      <div className="w-full p-6 bg-white rounded-md">
        <div className="flex mb-4">
          <div className="w-4/10 pr-2">
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">Exchange Details</h2>
              <table className="w-full min-w-96 text-left border-collapse">
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Exchange Product</td>
                    <td className="border px-4 py-2">{exchangeDetails.exchangeProduct}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Exchange Total</td>
                    <td className="border px-4 py-2">{exchangeDetails.exchangeTotal}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Cart Total</td>
                    <td className="border px-4 py-2">{exchangeDetails.cartTotal}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Difference</td>
                    <td className="border px-4 py-2">{exchangeDetails.difference}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Invoice No</td>
                    <td className="border px-4 py-2">{invoiceNo}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full pl-2">
            <div className="flex items-center justify-center">
              <input
                type="text"
                value={invoiceNo}
                onChange={handleInvoiceChange}
                placeholder="Enter Full Invoice No"
                className="w-[600px] p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="overflow-x-auto mt-10">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-purple-500 text-white">Product Name</th>
                    <th className="px-4 py-2 bg-purple-500 text-white">Qty</th>
                    <th className="px-4 py-2 bg-purple-500 text-white">Price</th>
                    <th className="px-4 py-2 bg-purple-500 text-white">Total</th>
                    <th className="px-4 py-2 bg-purple-500 text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{product.title}</td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          className="w-16 p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border px-4 py-2">${product.price}</td>
                      <td className="border px-4 py-2">${product.price * product.quantity}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-center ml-40 mt-10">
          <button
            onClick={clearExchange}
            className="w-96 p-2 mr-2 text-white bg-red-500 rounded"
          >
            Clear Exchange
          </button>
          <button
            onClick={continueExchange}
            className="w-96 p-2 ml-2 text-white bg-green-500 rounded"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
