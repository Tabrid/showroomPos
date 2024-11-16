import Barcode from 'react-barcode';
import './Invoice.css'
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import baseUrl from '../../Components/services/baseUrl';
const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null); // State to store order data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null);
  useEffect(() => {
    // Function to fetch order data
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/orders/order/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrder(data); // Set order data in state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError(error.message); // Set error message if any error occurs
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchOrder(); // Call the fetch function
    // Optional cleanup function if needed
    return () => {
      // Cleanup logic
    };
  }, [id]);
  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p>Error: {error}</p>;
  document.title = "Invoice Detail ";
  const handlePrint = () => {
    window.print();
  };
  const date = new Date(order.createdAt);

  // Format the date as "DD-MMM-YYYY"
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Format the time as "HH:MM:SS"
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="w-[90mm] h-screen mx-auto p-2  font text-black">
      <div className="text-center mb-4">
        <h1 className="text-[24px] font-bold ">Estarch</h1>
        <p className="text-[15px] font-bold px-12">9/A (Front gate of Masjid E Noor), Near Abul Hotel, Chowdhury Para,</p>
        <p className="text-[15px] font-bold">Malibag, Dhaka-1219</p>
        <p className='text-[15px] font-bold'>Email: estarch247@gmail.com</p>
        <p className="text-[15px] font-bold">Mobile: +880 1706-060651</p>
      </div>
      <section className="mb-4 text-[12px] font-bold">
        <div className="flex justify-between">
          <div>
            <p className="">Invoice: {order.invoice}</p>
            <p>Served by: {order.manager.fullName}</p>
          </div>
          <div className="text-right">
            <p>Date: {formattedDate}</p>
            <p>Time: {formattedTime}</p>
          </div>
        </div>
      </section>

      <table className="w-full mb-4 text-left text-xs border-collapse">
        <thead>
          <tr>
            <th className="border-b py-1">Description</th>
            <th className="border-b py-1">Qty</th>
            <th className="border-b py-1">MRP</th>
            <th className="border-b py-1">Dis</th>
            <th className="border-b py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.cartItems.map((item, index) => (
            <tr key={index}>
              <td className="py-1 text-[13px] font-bold"><span className='text-[12px] p_name'>{item.productId.productName}</span> <br /> {item.SKU} - {item.barcode} ({item.size})</td>
              <td className="py-1 text-[13px] font-bold">{item.quantity}</td>
              <td className="py-1 text-[13px] font-bold">{item.price + item.discountAmount}</td>
              <td className="py-1 text-[13px] font-bold">{item.discountAmount}</td>
              <td className="py-1 text-[13px] font-bold">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {
        order.exchangeAmount  ? <div className=' flex justify-between border-b'>
        <p className=" font-bold">Exchange</p>
        <p className=" ">{order.exchangeDetails.invoiceNo}</p>
      </div> : null
      }
     {
      order.exchangeAmount  ? <table className="w-full mb-4 text-left text-xs border-collapse">
         <thead>
          <tr>
            <th className="border-b py-1">Description</th>
            <th className="border-b py-1">Qty</th>
            <th className="border-b py-1">MRP</th>
            <th className="border-b py-1">Dis</th>
            <th className="border-b py-1">Amount</th>
          </tr>
        </thead>
      <tbody>

        {order?.exchangeDetails?.items?.map((item, index) => (
          <tr key={index}>
            <td className="py-1 font-bold">
              {item.SKU} - {item.barcode} ({item.size})
            </td>
            <td className="py-1 font-bold">{item.quantity}</td>
            <td className="py-1 font-bold">{(item.price + item.discountAmount)}</td>
            <td className="py-1 font-bold">{item.discountAmount}</td>
            <td className="py-1 font-bold">{item.price}</td>
          </tr>
        ))}
      </tbody>
    </table> : null
     }
      <section className="mb-4 text-xs font-bold leading-6">
        <div className="flex justify-between">
          <p>Sub Total</p>
          <p>{order.totalAmount + order.discount}</p>
        </div>
        <div className="flex justify-between">
          <p>Discount</p>
          <p>{order.discount}</p>
        </div>
        <div className="flex justify-between">
          <p className=''>VAT+</p>
          <p className='font-semibold'>included</p>
        </div>
        <div className="flex justify-between font-bold">
          <p>Net Amount</p>
          <p>{order.totalAmount}</p>
        </div>
      </section>
      <section className="mb-4 text-xs font-bold leading-6">
        <div className="flex flex-col">
          
          {order.payments.map((item, index) => (
            <div key={index} className="flex  my-[2px]">
              <div className="flex-1 text-start  ">{item.accountType}</div>
              <div className="flex-1  text-center">{item.paymentOption}</div>
              <div className="flex-1  text-end">{item.amount}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <p>Paid Amount</p>
          <p>{order.advanced}</p>
        </div>
        <div className="flex justify-between">
          <p>Change Amount</p>
          <p>{order.advanced - order.totalAmount}</p>
        </div>
      </section>

      <hr />

      <div className="text-center text-xs  font-bold">
        <p className='my-2'>Customer Phone: {order?.phone}</p>
        <Barcode
          className='barcode -ml-10 h-[50px] my-2'
          value={order.invoice}
          displayValue={true}
          lineColor="#00000"
          height={40}
        />
        <hr />
        <p className='text-lg text-black font-bold'>Thank You</p>
        <p>Item sold will not be refunded.</p>
        <p>Exchange will be executed at any time with good condition of the product with money receipt.</p>
        <p>Thanks for allowing us to serve you.</p>
      </div>

      <div className="text-center flex gap-5 justify-center mt-8 no-print">
        <Link to='/pos'>
          <button
            className="px-4 py-2 bg-[#ff890f] hover:bg-orange-500 text-white font-semibold rounded-md shadow-md "
          >
            POS
          </button>
        </Link>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default Invoice;
