import { useEffect, useState } from 'react';
import { PiPlus } from 'react-icons/pi';
import { TbTrash } from 'react-icons/tb';
import baseUrl from '../../Components/services/baseUrl';

const PaymentModal = ({ setPaymentModalVisible, finalAmount, userInfo, orderItems, discount, exchangeDetails, exchangeAmount }) => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([
    { id: 1, accountType: 'Cash', paymentOption: '', accountNumber: '', amount: '' },
  ]);
  const [accounts, setAccounts] = useState([]); // Store the accounts data

  // Fetch accounts data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/payment/showroom-accounts`);
        const data = await response.json();
        if (data && data.length > 0) {
          setAccounts(data[0].accounts); // Assuming "accounts" is inside the first object
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchData();
  }, []);
  // Handle the account type selection
  const handleAccountTypeChange = (id, value) => {
    // Find payment options for the selected account type
    const selectedAccount = accounts.find((acc) => acc.accountType === value);
    const paymentOptions = selectedAccount ? selectedAccount.payments : [];

    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id
          ? { ...payment, accountType: value, paymentOption: '', accountNumber: '', paymentOptions } // Reset paymentOption and set new options
          : payment
      )
    );
  };

  const addPaymentRow = () => {
    const newPayment = { id: Date.now(), accountType: '', paymentOption: '', amount: '', paymentOptions: [] };
    setPayments([...payments, newPayment]);
  };

  const removePaymentRow = (id) => {
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) => {
        if (payment.id === id) {
          if (field === 'paymentOption') {
            // Find the selected account and payment option details
            const selectedAccount = accounts.find((acc) => acc.accountType === payment.accountType);
            const selectedPaymentOption = selectedAccount?.payments.find((opt) => opt.paymentOption === value);
            const accountNumber = selectedPaymentOption?.accountNumber || '';

            // Update payment option and set the corresponding account number
            return { ...payment, paymentOption: value, accountNumber };
          }
          // For other fields, simply update the value
          return { ...payment, [field]: value };
        }
        return payment;
      })
    );
  };


  const totalAmount = payments.reduce(
    (acc, payment) => acc + Number(payment.amount || 0),
    0
  );
  const [remark, setRemark] = useState('');
  const totalDiscount = discount.type === 'percentage' ? finalAmount * discount.value / 100 : discount.value

  const change = totalAmount - finalAmount;
  const totalOrderDiscount = orderItems.reduce((acc, item) => acc + item.discountAmount * item.quantity, 0);

  const handleCheckOut = async () => {
    if (change < 0) {
      alert('Pay More....!');
    } else {
      setLoading(true);
      const userIdString = localStorage.getItem('userId');
      const userId = JSON.parse(userIdString);
      const orderData = {
        serialId: 'showroom',
        name: userInfo.name,
        phone: userInfo.phone,
        deliveryCharge: 0,
        address: userInfo.address,
        orderNotes: remark,
        cartItems: orderItems.map((item) => ({
          productId: item.productId,
          title: item.productName,
          quantity: item.quantity,
          price: item.salePrice,
          discountAmount: item.discountAmount,
          size: item.size,
        })),
        paymentMethod: 'Cash on Delivery',
        totalAmount: finalAmount,
        userId: null,
        discount: Number(totalDiscount) + Number(totalOrderDiscount),
        grandTotal: finalAmount,
        advanced: totalAmount,
        dueAmount: 0,
        note: '',
        area: '',
        manager: userId,
        payments,
        exchangeAmount,
        exchangeDetails
      };
      try {
        const response = await fetch(`${baseUrl}/api/orders/pos-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
        if (response.ok) {
          const responseData = await response.json();
          alert('Order placed successfully!');
          window.location.href = `/invoice/${responseData.order._id}`;
          console.log(responseData);
        } else {
          console.error('There was an error placing the order:', response);
        }
      } catch (error) {
        console.error('There was an error placing the order:', error);
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setPaymentModalVisible(false);
    }
    else if (event.key === "Enter") {
      handleCheckOut();
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  console.log(payments);
  
  return (
    <div className="fixed w-full inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white min-h-4/6 fixed top-6 rounded-lg shadow-lg p-6 w-full max-w-7xl h-fit ">
        <div className="flex space-x-6">
          {/* Payment Details Section */}
          <div className="w-1/3 text-lg bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Payment Details</h3>
            <table className="table-auto w-full">
              <tbody>
                <tr>
                  <td className="font-medium py-1">Total Amount:</td>
                  <td className="text-right">{finalAmount.toFixed(2)}TK</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Paid Amount:</td>
                  <td className="text-right">{totalAmount.toFixed(2)}TK</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Total Change:</td>
                  <td className="text-right">{change.toFixed(2)}TK</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Payment Type Section */}
          <div className="w-2/3 space-y-4">
            <div className="flex justify-center items-center mb-4 bg-[#7a8882]">
              <h2 className="text-2xl font-bold p-3 text-white">
                Total Amount: <span className="text-[#ffd400]">{finalAmount.toFixed(2)} </span>TK
              </h2>
            </div>
            <div className='max-h-40 overflow-y-scroll mt-5 w-full'>
              {payments?.map((payment) => (
                <div className="grid grid-cols-5 gap-4 mb-2" key={payment.id}>
                  {/* Payment Type */}
                  <div className="col-span-1">
                    <select
                      className="w-full p-2 border rounded"
                      value={payment.accountType}
                      onChange={(e) => handleAccountTypeChange(payment.id, e.target.value)}
                    >
                      <option value="">Select Account Type</option>
                      {accounts.map((account) => (
                        <option key={account._id} value={account.accountType}>
                          {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Option */}
                  <div className="col-span-1">
                    <select
                      className="w-full p-2 border rounded"
                      value={payment.paymentOption}
                      onChange={(e) => handleInputChange(payment.id, 'paymentOption', e.target.value)}
                    >
                      <option value="">Account option</option>
                      {payment?.paymentOptions?.map(option => (
                        <option key={option._id} value={option.paymentOption}>
                          {option.paymentOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div className="col-span-1">
                    <input
                      type="text"
                      disabled
                      placeholder="accountNumber"
                      value={payment.accountNumber}
                      onChange={(e) => handleInputChange(payment.id, 'accountNumber', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={payment.amount}
                      onChange={(e) => handleInputChange(payment.id, 'amount', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-1 flex items-center space-x-2">
                    <button className="text-blue-500 p-2" onClick={addPaymentRow}>
                      <PiPlus />
                    </button>
                    {payments.length > 1 && (
                      <button
                        className="text-red-500 p-2"
                        onClick={() => removePaymentRow(payment.id)}
                      >
                        <TbTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-4">
              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text">Change:</span>
                </div>
                <input
                  type="text"
                  placeholder="Change"
                  value={change.toFixed(2)}
                  readOnly
                  className="w-full p-2 border rounded"
                />
              </label>
              <input
                type="text"
                placeholder="Remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-between items-center mt-6 gap-5">
              <button onClick={() => setPaymentModalVisible(false)} className="bg-red-500 text-white px-6 py-2 rounded w-full">
                Cancel [Esc]
              </button>
              <button
                className={`bg-green-500 text-white px-6 py-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleCheckOut}
                disabled={loading} // Disable button when loading
              >
                {loading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
