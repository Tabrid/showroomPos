import axios from "axios";
import { useEffect, useState } from "react";
import baseUrl from "../../Components/services/baseUrl";
import { PiPlus } from "react-icons/pi";
import { TbTrash } from "react-icons/tb";

const InvestorWithdrawModal = ({ show, handleClose, fetchMyRequest }) => {
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
  // Fetch the list of investors when the component mounts


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Parse amount as a float
    const floatAmount = parseFloat(totalAmount);

    if (isNaN(floatAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    const senderId = JSON.parse(localStorage.getItem('userId'));

    // Form data
    const formData = {
      amount: totalAmount,
      accountType: 'Showroom Account',
      senderId,
      receiverId:'67d7e99fc1252e5982dc61e7', 
      type: "showroom-Withdraw",
      payments
    };

    try {
      await axios.post(`${baseUrl}/api/transaction/create`, formData);
      alert("Transaction Successful");
      fetchMyRequest()
      fetchMyRequest()
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed");
    }
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white  p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Withdraw Funds</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Form starts here */}
          <div>
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
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount to Withdraw
            </label>
            <input
              type="number"
              id="amount"
              value={totalAmount}
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter Amount"
              step="1" // Allows float values
              required
            />

           
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
            onClick={handleSubmit}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Withdraw
            </button>
          </div>
        {/* Form ends here */}
      </div>
    </div>
  );
};

export default InvestorWithdrawModal;
