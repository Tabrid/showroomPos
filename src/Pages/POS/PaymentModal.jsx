import { useEffect, useState } from 'react';
import { PiPlus } from 'react-icons/pi';
import { TbTrash } from 'react-icons/tb';
import baseUrl from '../../Components/services/baseUrl';
import { CiBarcode } from "react-icons/ci";
import axios from 'axios';


const PaymentModal = ({ setPaymentModalVisible, finalAmount, userInfo, orderItems, discount, exchangeDetails, exchangeAmount,cardNumber, membershipDiscount }) => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([
    { id: 1, accountType: 'Cash', paymentOption: '', accountNumber: '', amount: '' },
  ]);
  const [accounts, setAccounts] = useState([]); // Store the accounts data
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftAmount, setGiftAmount] = useState(0);
  const [appliedGiftCard, setAppliedGiftCard] = useState('')

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
    // console.log(payments.length);
    

    fetchData();
  }, []);
  // Handle the account type selection
  const handleAccountTypeChange = (id, value) => {
    console.log(value);
    
    // Find payment options for the selected account type
    const selectedAccount = accounts.find((acc) => acc.accountType === value);
    console.log(selectedAccount);
    
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

  const handleGiftCardInputChange = (e) => {
    setGiftCardCode(e.target.value);
  };

  const handleApplyGiftCard = async () => {
    try {
      // Make the API request to apply the gift card
      const response = await axios.get(`${baseUrl}/api/giftcards/apply/${giftCardCode}`);
      setGiftAmount(response.data.amount)
      setAppliedGiftCard(response.data.code)
      const newPayment = { id: Date.now(), accountType: 'gift card', paymentOption: '', amount: response.data.amount, paymentOptions: [] };
      console.log(payments[0].accountType);
      
      if(payments.length == 1 && payments[0].amount == ''){
        setPayments([newPayment]);
      }else{
        setPayments([...payments, newPayment]);
      }


    } catch (error) {
      // Log the error for debugging
      console.error('Error applying gift card:', error);

      // Handle different error scenarios
      if (error.response) {
        // If the error is from the server, show an appropriate message
        const errorMessage = error.response.data || 'An error occurred. Please try again.';
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        // If the request was made but no response was received
        alert('No response from the server. Please try again later.');
      } else {
        // Any other errors (e.g., in setting up the request)
        alert('An error occurred. Please try again.');
      }
    }
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
        exchangeDetails,
        giftCard: {
          giftAmount,
          code: appliedGiftCard
        },
        membership:{
          cardNumber,
          membershipDiscount,
          phone:userInfo.phone
        }
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
          window.location.href = `/invoice/${responseData.order.invoice}`;
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
            <label className="input rounded-sm input-bordered flex items-center gap-2 my-3 h-10">
              <CiBarcode />
              <input
                type="text"
                className="grow"
                placeholder="Gift Card Code"
                value={giftCardCode}
                onChange={handleGiftCardInputChange} // Handle input changes
              />
              <button
                onClick={handleApplyGiftCard} // Handle applying the gift card
                className="btn btn-sm bg-success text-white"
              >
                Apply
              </button>
            </label>
            <div className='max-h-40 overflow-y-scroll mt-5 w-full'>
              {payments?.map((payment) => (
                <div className="grid grid-cols-5 gap-4 mb-2" key={payment.id}>
                  {/* Payment Type */}
                  <div className="col-span-1">
                    <select
                      className="w-full p-2 border rounded"
                      value={payment.accountType}
                      disabled = {payment.accountType == 'gift card'}
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
                      disabled = {payment.accountType == 'gift card' || payment.accountType=='cash'}
                      onChange={(e) => handleInputChange(payment.id, 'paymentOption', e.target.value)}
                    >
                      <option  value="">Account option</option>
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
                    disabled={payment.accountType=='gift card'}
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
