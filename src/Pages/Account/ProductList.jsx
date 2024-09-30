import React, { useEffect, useState } from "react";
import axios from "axios";
import RequestModal from "./RequestModal";
import { IoNotificationsCircle } from "react-icons/io5";
import InvestorWithdrawModal from "./InvestorWithdrawModal";
import baseUrl from "../../Components/services/baseUrl";

const ProductList = () => {
  document.title = "Estarch | Account";
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [count, setCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const [showModal, setShowModal] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showMyRequestModal, setShowMyRequestModal] = useState(false);
  const [myTransaction, setMyTransaction] = useState([])
  const [investingCalculation, setInvestingCalculation] = useState(null)
  const [account, setAccount] = useState({})



  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleInvestorModalOpen = () => setShowInvestorModal(true);
  const handleInvestorModalClose = () => setShowInvestorModal(false);
  const handleMyRequestModalOpen = () => setShowMyRequestModal(true); // Function to show modal
  const handleMyRequestModalClose = () => setShowMyRequestModal(false);

  // new
  const [accountInfo, setAccountInfo] = useState(null)
  const [moneyRequests, setMoneyRequests] = useState([])
  const [myRequests, setRequests] = useState([])


  const fetchMyRequest = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));

      // Check if userId exists and is valid
      if (!userId) {
        throw new Error("Invalid or missing userId.");
      }

      // Try to fetch notifications
      const response = await axios.get(`${baseUrl}/api/payment/user-payment-options/${userId}`);

      // Set the response data in state
      setAccount(response.data);
      console.log(response.data);

    } catch (error) {
      // Handle errors here
      if (error.response) {
        // If the server responded with a status other than 2xx
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        // If the request was made but no response was received
        console.error("Network Error: No response received.");
      } else if (error.message === "Invalid or missing userId.") {
        // If userId is invalid or missing in localStorage
        console.error("Error:", error.message);
      } else {
        // Other unknown errors
        console.error("Error:", error.message);
      }
    }
  };

  const fetchIncomingRequest = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));

      // Check if userId exists and is valid
      if (!userId) {
        throw new Error("Invalid or missing userId.");
      }

      // Try to fetch notifications
      const response = await axios.get(`${baseUrl}/api/transaction/get-notification/${userId}`);

      // Set the response data in state
      setMoneyRequests(response.data);

    } catch (error) {
      // Handle errors here
      if (error.response) {
        // If the server responded with a status other than 2xx
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        // If the request was made but no response was received
        console.error("Network Error: No response received.");
      } else if (error.message === "Invalid or missing userId.") {
        // If userId is invalid or missing in localStorage
        console.error("Error:", error.message);
      } else {
        // Other unknown errors
        console.error("Error:", error.message);
      }
    }
  };

  const fetchAccountInfo = () => {
    try {
      axios.get(`${baseUrl}/api/account/main-account`)
        .then(res => {
          setAccountInfo(res.data)
        })
    } catch (error) {
      console.log(error);

    }
  }


  const fetchMyAllTransaction = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('userId'));

      // Check if userId exists and is valid
      if (!userId) {
        throw new Error("Invalid or missing userId.");
      }
      // Try to fetch notifications
      const response = await axios.get(`${baseUrl}/api/transaction/get-my-transaction/${userId}?page=${currentPage}&size=${limit}&search=${search}`);

      // Set the response data in state
      setMyTransaction(response.data.transactions);
      setCount(response.data.totalTransaction)
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
      setLoading(false)

    } catch (error) {
      // Handle errors here
      if (error.response) {
        // If the server responded with a status other than 2xx
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        // If the request was made but no response was received
        console.error("Network Error: No response received.");
      } else if (error.message === "Invalid or missing userId.") {
        // If userId is invalid or missing in localStorage
        console.error("Error:", error.message);
      } else {
        // Other unknown errors
        console.error("Error:", error.message);
      }
    }
  };

  const fetchInvestingCalculation = () => {
    try {
      axios.get(`${baseUrl}/api/account/calculate-invested-balance`)
        .then(res => {
          setInvestingCalculation(res.data)
        })
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    fetchIncomingRequest();
    fetchMyRequest();
    fetchAccountInfo()
    fetchMyAllTransaction()
    fetchInvestingCalculation();
  }, [currentPage, limit, showInvestorModal])


  const pageRange = 2;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };


  const onPageChange = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    setCurrentPage(page);
  };



  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle card click event
  const handleCardClick = (account) => {
    setSelectedAccount(account); // Set the selected account details
    setIsModalOpen(true); // Open the modal
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };
  function transformPayments(payments) {
    return payments.map(payment => {
      return {
        paymentOption: payment.paymentOption || payment.accountType,
        amount: payment.amount
      };
    });
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="mx-20">

          {/* Status Summary Cards */}
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-4 gap-6 my-8">
            <div className="shadow-md cursor-pointer text-center py-2 bg-[#40a57821] col-span-5">
              <p className="font-bold  text-[#40A578] text-2xl m-0">Total Amount</p>
              <p className="text-2xl font-bold text-[#40A578]">  {account.totalAmount} ৳ </p>
            </div>
            <div className="grid grid-cols-4 gap-4 w-full col-span-5">
              <div className="shadow-md cursor-pointer text-center py-2 bg-[#af47d223]">
                <p className="font-semibold text-[#AF47D2] m-0">Expense Ecommerce</p>
                <p className="text-2xl font-bold text-[#AF47D2]">  ৳</p>
              </div>
              {account?.accountDetails?.map((account, index) => {
                let bgColor, textColor;

                // Set background and text colors based on accountType
                switch (account.accountType.toLowerCase()) {
                  case 'ecommerce':
                    bgColor = 'bg-[#af47d223]';
                    textColor = 'text-[#AF47D2]';
                    break;
                  case 'cash':
                    bgColor = 'bg-[#1b424225]';
                    textColor = 'text-[#1B4242]';
                    break;
                  case 'mobilebank':
                    bgColor = 'bg-[#ff204d2a]';
                    textColor = 'text-[#FF204E]';
                    break;
                  case 'bank':
                    bgColor = 'bg-[#620c9f21]';
                    textColor = 'text-[#610C9F]';
                    break;
                  default:
                    bgColor = 'bg-gray-200'; // Default background color if no match
                    textColor = 'text-gray-600'; // Default text color if no match
                    break;
                }

                return (
                  <div onClick={() => handleCardClick(account)} key={index} className={`shadow-md cursor-pointer text-center py-2 ${bgColor}`}>
                    <p className={`font-semibold ${textColor} m-0`}>
                      {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Amount
                    </p>
                    <p className={`text-2xl font-bold ${textColor}`}>
                      ৳ {account.totalAmount.toLocaleString()} {/* Format number with commas */}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="shadow-md flex justify-center bg-white p-3 mb-4 rounded-md">
            <div className="flex gap-4">
              <button onClick={handleInvestorModalOpen} className="py-2 rounded-md text-white px-6 flex items-center gap-1 bg-error">Withdraw</button>
              <button onClick={handleMyRequestModalOpen} className="py-2 rounded-md text-white px-6 flex items-center gap-1 bg-orange-400">
                My Pending Request +{myRequests.length}
              </button>
              <button onClick={handleModalOpen} className={`py-2 rounded-md text-white px-6 flex items-center gap-1 bg-primary`}><span className="text-xl"></span> Expense</button>
            </div>
          </div>
          <div>
            <div className="col-12">
              <div>
                <div>

                  <div className='flex justify-between items-center '>
                    <select
                      onChange={(e) => setLimit(e.target.value)}
                      name="" id="" className=' select select-bordered'>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                    </select>

                    <label className="input input-bordered w-full max-w-xs flex items-center gap-2">
                      <input onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} type="text" className="grow w-full max-w-sm" placeholder="Search Transaction ID" />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                          fillRule="evenodd"
                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                          clipRule="evenodd" />
                      </svg>
                    </label>

                  </div>

                  {
                    <div className="overflow-x-auto overflow-y-hidden">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="border-2 border-gray-200">Serial</th>
                            <th className="border-2 border-gray-200">Transaction ID</th>
                            <th className="border-2 border-gray-200">Type</th>
                            <th className="border-2 border-gray-200">Account Type</th>
                            <th className="border-2 border-gray-200">Payment Option</th>
                            <th className="border-2 border-gray-200">Sender</th>
                            <th className="border-2 border-gray-200">Receiver</th>
                            <th className="border-2 border-gray-200">Amount</th>
                            <th className="border-2 border-gray-200">Date</th>
                            <th className="border-2 border-gray-200">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            myTransaction.map((t, index) =>
                              <tr key={t}>
                                <td className="border-2 border-gray-200">{index + 1}</td>
                                <td className="border-2 border-gray-200">{t.tId}</td>
                                <td className="border-2 border-gray-200 text-center">{t.type}</td>
                                <td className="border-2 border-gray-200 text-center">{t.accountType}</td>
                                <td className="border-2 border-gray-200 ">{transformPayments(t?.payments).map((payment, index) => (
                                  <p key={index} className="border-b">
                                    {payment.paymentOption}{"......."}
                                     {payment.amount} tk
                                  </p>
                                ))}</td>
                                <td className="border-2 border-gray-200 text-center">{t.senderId.fullName}</td>
                                <td className="border-2 border-gray-200 text-center">{t.receiverId.fullName}</td>
                                <td className="border-2 border-gray-200 text-center">{t.amount} ৳</td>
                                <td className="border-2 border-gray-200 text-center">
                                  <p className="font-bold">
                                    {`${('0' + new Date(t.createdAt).getDate()).slice(-2)}-${('0' + (new Date(t.createdAt).getMonth() + 1)).slice(-2)}-${new Date(t.createdAt).getFullYear().toString().slice(-2)}, ${new Date(t.createdAt).getHours() % 12 || 12}:${('0' + new Date(t.createdAt).getMinutes()).slice(-2)} ${new Date(t.createdAt).getHours() >= 12 ? 'PM' : 'AM'}`}
                                  </p>
                                </td>
                                <td className="border-2 border-gray-200 text-center">
                                  <p className={`px-2 py-1 rounded-md text-sm ${t.isDecline ? 'text-red-500' :
                                    t.isApprove ? 'text-green-500' :
                                      'text-orange-500 bg-orange-100'
                                    }`}>
                                    {t.isApprove ? "Accepted" : t.isDecline ? "Declined" : "Pending"}
                                  </p>
                                </td>
                              </tr>
                            )
                          }
                        </tbody>
                      </table>
                    </div>
                  }

                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 mr-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                      Prev
                    </button>

                    {getPageNumbers().map((pageNumber, index) => {
                      if (pageNumber === '...') {
                        return (
                          <span key={index} className="px-4 py-2 mx-1 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={index}
                          onClick={() => onPageChange(pageNumber)}
                          className={`px-4 py-2 rounded mx-1 ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 ml-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RequestModal fetchAccountInfo={fetchAccountInfo} fetchIncomingRequest={fetchIncomingRequest} show={showModal} handleClose={handleModalClose} moneyRequests={moneyRequests} />
      {/* <MyRequestsModal show={showMyRequestModal} myRequests={myRequests} handleClose={handleMyRequestModalClose} /> */}
      <InvestorWithdrawModal fetchIncomingRequest={fetchIncomingRequest} fetchMyRequest={fetchMyRequest} show={showInvestorModal} handleClose={handleInvestorModalClose} />
      {isModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {selectedAccount?.accountType?.charAt(0)?.toUpperCase() + selectedAccount?.accountType?.slice(1)} Details
            </h2>
            <ul>
              {selectedAccount?.payments?.map((payment, index) => (
                <li key={index} className="flex justify-between my-2">
                  <span>{payment.paymentOption}</span>
                  <span>৳ {payment.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </React.Fragment>
  );
};

export default ProductList;
