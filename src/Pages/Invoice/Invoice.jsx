import React from 'react';
import Barcode from 'react-barcode';

const Invoice = () => {
  return (
    <div className="w-[80mm] h-screen mx-auto p-2 bg-white shadow-md border border-gray-300">
      <header className="text-center mb-4">
        <h1 className="text-lg font-bold">Estarch</h1>
        <p className="text-xs px-12">9/A (Front gate of Masjid E Noor) , Near Abul Hotel, Chowdhury Para,</p>
        <p className="text-xs">Malibag,Dhaka-1219</p>
        <p className='text-xs'>Email: estarch247@gmail.com</p>
        <p className="text-xs">Mobile: +880 1706-060651</p>
      </header>

      <section className="mb-4 text-xs">

        <div className="flex justify-between">
          <div>
            <p className="font-semibold">Invoice: 0123071600001</p>

            <p>Served by: Rakib</p>
          </div>
          <div className="text-right">
            <p>Date: 16-Jul-2023</p>
            <p>Time: 14:46:08</p>
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
          <tr>
            <td className="py-1">EST0001 - 7893880 (L)</td>
            <td className="py-1">1</td>
            <td className="py-1">200.00</td>
            <td className="py-1">20.00</td>
            <td className="py-1">200.00</td>
          </tr>
          <tr>
            <td className="py-1">EST0051 - 4493880 (XL)</td>
            <td className="py-1">1</td>
            <td className="py-1">625.00</td>
            <td className="py-1">20.00</td>
            <td className="py-1">525.00</td>
          </tr>
          <tr>
          <td className="py-1">EST0025 - 2593880 (XXL)</td>
            <td className="py-1">1</td>
            <td className="py-1">650.00</td>
            <td className="py-1">20.00</td>
            <td className="py-1">650.00</td>
          </tr>
        </tbody>
      </table>

      <section className="mb-4 text-xs">
        <div className="flex justify-between">
          <p>Sub Total</p>
          <p>1,375.00</p>
        </div>
        <div className="flex justify-between">
          <p>Discount</p>
          <p>275.00</p>
        </div>
        <div className="flex justify-between">
          <p className='font-semibold'>VAT+</p>
          <p className='font-semibold'>included</p>
        </div>
        <div className="flex justify-between font-bold">
          <p>Net Amount</p>
          <p>1,183.00</p>
        </div>
      </section>

      <section className="mb-4 text-xs">
        <div className="flex justify-between">
          <p>Paid Amount</p>
          <p>1,183.00</p>
        </div>
        <div className="flex justify-between">
          <p>Change Amount</p>
          <p>0.00</p>
        </div>
      </section>

      <hr />

      <footer className="text-center text-xs text-gray-500">
      <Barcode
          className='barcode -ml-3 h-[50px] my-2'
          value={'INV-292934732'}
          displayValue={true}
          lineColor="#00000"
          height={55}
        />
        <hr />
        <p className='text-lg text-black font-semibold'>Thank You</p>
        <p>Item sold will not be refunded.</p>
        <p>Exchange will be executed at any time with good condition of the product with money receipt.</p>
        <p>Thanks for allowing us to serve you.</p>
      </footer>
    </div>
  );
};

export default Invoice;
