import React, { useEffect, useState } from "react";
import SizeModal from "./SizeModal";
import { IoPlayBackCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Modal from "./modal";
import PaymentModal from "./PaymentModal";
import baseUrl from "../../Components/services/baseUrl";
import FullScreenButton from "../../Components/FullScreenButton";
import FilterDropdown from '../../Components/productFilter'
import HoldList from "./HoldList";
import HoldSaleModal from "../../Components/HoldSaleModal";
import { CiBarcode } from "react-icons/ci";
import altImg from '../../assets/avater.jpg'
const PosOrders = () => {
  document.title = "Estarch | Pos Orders";
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [discount, setDiscount] = useState({ type: 'percentage', value: 0 });
  const [totalTk, setTotalTK] = useState(0)
  const [barcode, setBarcode] = useState('');
  const [membershipCode, setMembershipCode] = useState('');
  const [card, setCard] = useState(null);  // To store the fetched card data
  const [loading, setLoading] = useState(false);  // To manage loading state
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    phone: '',
    name: '',
    address: ''
  });

  const [message, setMessage] = useState("");


  const [exchangeAmount, setExchangeAmount] = useState(0);
  const [exchangeDetails, setExchangeDetail] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenList, setIsModalOpenList] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleAddMembershipModal = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenModalList = () => {
    setIsModalOpenList(true);
  };

  const handleCloseModalList = () => {
    setIsModalOpenList(false);
  };
  const fetchUserData = async (phone) => {
    try {
      const response = await fetch(`${baseUrl}/api/orders/orders/${phone}`);
      const userData = await response.json();

      if (userData) {
        console.log(userData);
        setUserInfo({
          phone: userData.phone,
          name: userData.name,
          address: userData.address,
        });
        setOrders(userData.orderList || []);
      } else {
        setUserInfo({ phone: '', name: '', address: '' });
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Function to fetch card by phone number
  const getMembershipCardByPhone = async (phone) => {
    try {
      const response = await fetch(`${baseUrl}/api/memberships/phone/${phone}`);

      if (!response.ok) {
        throw new Error("Card not found for the provided phone number.");
      }

      const result = await response.json();
      setCard(result);  // Set the fetched card data
    } catch (error) {
      setError(error.message);  // Set error if any
    } finally {
      setLoading(false);
    }
  };



  const handleUserInfoChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'phone' && value.length === 11) {
      console.log(name, value.length);
      await fetchUserData(value);
      await getMembershipCardByPhone(value)
    }
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };
  const handlePaymentClick = () => {
    setPaymentModalVisible(true);
  };


  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleSizeSelect = (size) => {
    const { price, discountPercent = 0, discountAmount = 0, ...sizeData } = selectedProduct.sizeDetails.find(
      (detail) => detail.size === size
    );
    const afterDiscount = discountAmount > 0
      ? price - discountAmount
      : price - (price * discountPercent) / 100;


    setOrderItems([
      ...orderItems,
      {
        ...selectedProduct,
        ...sizeData,
        size,
        productId: selectedProduct._id,
        quantity: 1,
        discountPercent,
        discountAmount,
        afterDiscount: afterDiscount > 0 ? afterDiscount : 0,
      }
    ]);
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleQuantityChange = (index, increment) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index].quantity = Math.max(1, newOrderItems[index].quantity + increment);
    setOrderItems(newOrderItems);
  };
  const handleDiscountChange = (index, field, value) => {
    setDiscount((prevDiscount) => ({ ...prevDiscount, value: 0 }));
    const newOrderItems = [...orderItems];
    newOrderItems[index][field] = parseFloat(value) || 0;
    if (field === 'discountPercent') {
      newOrderItems[index].discountAmount = (newOrderItems[index].regularPrice * newOrderItems[index].discountPercent) / 100;
    } else {
      newOrderItems[index].discountPercent = (newOrderItems[index].discountAmount / newOrderItems[index].regularPrice) * 100;
    }

    newOrderItems[index].salePrice = newOrderItems[index].regularPrice - newOrderItems[index].discountAmount;
    setOrderItems(newOrderItems);
  };

  const clearDiscounts = () => {
    const newOrderItems = orderItems.map(item => ({
      ...item,
      discountPercent: 0,
      discountAmount: 0,
      salePrice: item.regularPrice
    }));
    setOrderItems(newOrderItems);
  };

  const handleDelete = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleTypeChange = (e) => {
    setDiscount((prevDiscount) => ({ ...prevDiscount, type: e.target.value }));
  };

  const handleValueChange = (e) => {
    setDiscount((prevDiscount) => ({ ...prevDiscount, value: e.target.value }));
  };

  const calculateTotalItems = () => orderItems.reduce((total, item) => total + item.quantity, 0);

  const calculateTotalAmount = () => orderItems.reduce((total, item) => total + item.salePrice * item.quantity, 0);

  const totalDiscount = discount.type === 'percentage' ? calculateTotalAmount() * discount.value / 100 : discount.value

  useEffect(() => {
    setTotalTK(calculateTotalAmount() - totalDiscount - exchangeAmount)
  }, [calculateTotalAmount(), totalDiscount, discount, exchangeAmount])


  const handleInputChange = (e) => {
    setBarcode(e.target.value);
  };
  const handleMembershipBarcodeInputChange = (e) => {
    setMembershipCode(e.target.value);
  };



  const handleSearch = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/products/product/pos/${barcode}`);

      if (!response.ok) {
        throw new Error('Product not found or server error');
      }
      const data = await response.json();
      setOrderItems([
        ...orderItems,
        data
      ]);
      setBarcode('')
    } catch (err) {
      console.error(err);
    }
  };

  // Function to fetch card by phone number
  const getMembershipCardByCardNumber = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/memberships/card-number/${membershipCode}`);
      if (!response.ok) {
        throw new Error("Card not found for the provided phone number.");
      }
      const result = await response.json();
      setCard(result);  // Set the fetched card data
    } catch (error) {
      setError(error.message);  // Set error if any
    } finally {
      setLoading(false);
    }
  };

   // Function to handle form submission
   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Create an object with the form data
    const formData = { cardNumber:membershipCode, name:userInfo.name, phone:userInfo.phone, address:userInfo.address };

    console.log(formData);
    

    try {
      // Call the applyMembershipCard function (Make sure this matches your API call setup)
      const response = await fetch(`${baseUrl}/api/memberships/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Membership card applied/updated successfully.");
        toggleAddMembershipModal();  // Close modal after success
        getMembershipCardByCardNumber();
      } else {
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      setMessage("Failed to apply card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMembershipCardByCardNumber();
    if (membershipCode.length < 8 || membershipCode.length > 8) {
      setCard(null)
    }
  }, [membershipCode])


  useEffect(() => {
    handleSearch()
  }, [barcode])

  return (
    <React.Fragment>
      <div className="mt-2">
        <main className="min-h-screen bg-slate-50">
          <div className="flex">
            <div className="w-5/12 flex items-center flex-col px-3">
              <div className="w-full">
                <FilterDropdown setProducts={setProducts} />
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-[600px] overflow-y-scroll mb-14">
                {products?.map((product, index) => (
                  <div
                    key={index}
                    className="cursor-pointer card card-compact bg-base-100 w-[140px] h-[240px] shadow-xl rounded-none mt-2"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="p-2 h-[170px]">
                      <figure>
                        <img
                          className="h-full w-[130px]"
                          src={product.images[0] ? `${baseUrl}/${product.images[0]}` : altImg}
                          alt={product.productName}
                        />
                      </figure>
                    </div>
                    <div className="bg-slate-200 h-[70px] text-sm text-center p-2">
                      <p>SKU:{product.SKU}</p>
                      <p className="text-sm">{product.productName}({product.totalStock})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-7/12 bg-white">
              <div className="container mx-auto px-4 py-2">
                <div className="grid grid-cols-3 gap-1 mb-1">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter Phone Number"
                    value={userInfo.phone}
                    onChange={handleUserInfoChange}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={userInfo.name}
                    onChange={handleUserInfoChange}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    value={userInfo.address}
                    onChange={handleUserInfoChange}
                    className="border p-2 rounded"
                  />
                </div>
                <p className="px-4">
                  {orders?.length > 0 ? 'User found' : 'User not found'}
                  {orders?.length > 0 &&
                    <span
                      className="underline cursor-pointer"
                      onClick={() => document.getElementById('orders_modal').showModal()}

                    >
                      (see order list)
                    </span>
                  }
                </p>
                <div className="flex justify-between items-center">
                  <label className="input  rounded-sm input-bordered flex items-center gap-2 my-1 h-10">
                    <CiBarcode />
                    <input
                      type="text"
                      className="grow"
                      placeholder="barcode"
                      value={barcode}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label className="input  rounded-sm input-bordered flex items-center gap-2 my-1 h-10">
                    <CiBarcode />
                    <input
                      type="text"
                      className="grow"
                      placeholder="Membership card"
                      value={membershipCode}
                      onChange={handleMembershipBarcodeInputChange}
                    />
                  </label>
                  <button onClick={toggleAddMembershipModal} className="btn btn-sm btn-error text-white ">Handle Membership</button>
                </div>

                {card && card.issuedTo && <div className="my-2">
                  <p className='text-center bg-blue-500 text-white'>Membership info</p>
                  <div className="flex justify-between flex-wrap mx-2 gap-2">
                    <p>Phone: {card?.issuedTo?.phone}</p>
                    <p>Name: {card?.issuedTo?.name}</p>
                    <p>Code: {card?.cardNumber}</p>
                    <p>Tier: {card?.tier}</p>
                    <p>discount: {card?.discountPercentage}%</p>
                  </div>
                </div>}

                <div className="min-w-full bg-white px-4">
                  {/* Header */}
                  <div className="bg-green-500 text-white flex">
                    <div className="px-4 py-2 w-28 flex-grow border-b border-green-500">Name</div>
                    <div className="px-4 py-2 flex-1 border-b border-green-500">Price</div>
                    <div className="px-4 py-2 flex-1 border-b border-green-500">Disc(%)</div>
                    <div className="px-4 py-2 flex-1 border-b border-green-500">Disc Amt</div>
                    <div className="px-4 py-2 flex-1 border-b border-green-500">After Disc</div>
                    <div className="px-4 py-2 flex-1 border-b border-green-500">Qty</div>
                    <div className="px-4 py-2 flex-1 border-b border-green-500">Total</div>
                    <div className="px-4 py-2 flex-1 border-b border-green-500">Action</div>
                  </div>
                  {/* Rows */}
                  <div className="h-[400px] overflow-y-scroll ">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex items-center border-b">
                        <div className="px-4 py-2 flex-grow w-28 text-xs  border-r">{item.productName} ({item.size})<br />Barcode: {item.barcode} <br /> SKU: {item.SKU}</div>
                        <div className="px-4 py-2 flex-1 border-r">{item.regularPrice}</div>
                        <div className="px-4 py-2 flex-1 border-r">
                          <input
                            type="number"
                            min='0'
                            value={item.discountPercent}
                            onChange={(e) => handleDiscountChange(index, 'discountPercent', e.target.value)}
                            className="input w-16"
                          />
                        </div>
                        <div className="px-4 py-2 flex-1 border-r">
                          <input
                            type="number"
                            min='0'
                            value={item.discountAmount}
                            onChange={(e) => handleDiscountChange(index, 'discountAmount', e.target.value)}
                            className="input w-16"
                          />
                        </div>
                        <div className="px-4 py-2 flex-1 border-r">{item.salePrice}</div>
                        <div className="px-4 py-2 flex-1 border-r flex items-center">
                          <button
                            onClick={() => handleQuantityChange(index, -1)}
                            disabled={item.quantity <= 1}
                            className="bg-red-500 text-white px-2"
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(index, 1)}
                            className="bg-green-500 text-white px-2"
                          >
                            +
                          </button>
                        </div>
                        <div className="px-4 py-2 flex-1 border-r">{item.salePrice * item.quantity}</div>
                        <div className="px-4 py-2 flex-1 text-center">
                          <button onClick={() => handleDelete(index)} className="text-red-500">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {orderItems.some(item => item.discountPercent > 0 || item.discountAmount > 0) && (
                  <div className="flex justify-center mt-5">
                    <button
                      onClick={clearDiscounts}
                      className="btn btn-sm w-32 bg-red-600 hover:bg-red-600 text-white font-medium"
                    >
                      Clear
                    </button>
                  </div>
                )}
                <div className="fixed w-7/12  p-7 bottom-[185px]">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>{calculateTotalItems()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>{calculateTotalAmount()}</span>
                  </div>
                </div>
                <div className="fixed w-7/12 bg-black  text-white grid grid-cols-2 gap-5 p-7 bottom-[70px]">
                  <div className="flex justify-between items-center space-x-2">
                    <div className="flex items-center space-x-2 text-black">
                      <span className="text-white">Disc</span>
                      <select
                        className="border p-1 rounded"
                        value={discount.type}
                        onChange={handleTypeChange}
                      >
                        <option value="percentage">(%)</option>
                        <option value="amount">(amount)</option>
                      </select>
                    </div>
                    <input
                      className="border p-1 rounded w-20 text-black"
                      type="number"
                      value={discount.value}
                      onChange={handleValueChange}
                      placeholder="Value"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span>After Discount Price</span>
                    <span>{totalTk} </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total VAT</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Payable</span>
                    <span> {totalTk}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="fixed w-full bottom-0">
            <div className="mt-3 flex text-center ">
              <div className="bg-[#605ca8] w-7/12 flex justify-evenly">
                <div className="flex items-center h-full justify-evenly gap-10">
                  <Link to='/'><IoPlayBackCircleSharp className="text-4xl  text-white" /></Link>
                  <FullScreenButton />
                </div>

                <p className="text-4xl font-bold py-4 text-white">
                  Total : {totalTk} TK
                </p>
              </div>
              <div className="bg-[#188ae2] w-2/12 cursor-pointer" onClick={() => document.getElementById('my_modal_3').showModal()}>
                <p className="text-4xl font-bold py-4 text-white">
                  Exchange
                </p>
              </div>

              <dialog id="my_modal_3" className="modal">
                <div className="modal-box w-11/12 max-w-7xl fixed  top-5">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕                                                    </button>
                  </form>
                  <Modal setExchangeAmount={setExchangeAmount} setUserInfo={setUserInfo} setExchangeDetail={setExchangeDetail} />
                </div>
              </dialog>
              <div className="bg-[#c1793c] w-1/12 cursor-pointer" onClick={handleOpenModalList}>
                <p className="text-4xl font-bold py-4 text-white">
                  :::
                </p>
              </div>
              <HoldList setUserInfo={setUserInfo} setOrderItems={setOrderItems} isOpen={isModalOpenList} onClose={handleCloseModalList} />
              <button disabled={orderItems.length === 0} className="bg-[#ff890f] w-1/12 " onClick={handleOpenModal}>
                <p className="text-4xl font-bold py-4 text-white">
                  Hold
                </p>
              </button>
              <HoldSaleModal setOrderItems={setOrderItems} setUserInfo={setUserInfo} setOrders={setOrders} userInfo={userInfo} orderItems={orderItems} isOpen={isModalOpen} onClose={handleCloseModal} />
              <div
                className="bg-[#f31250] w-1/12 cursor-pointer"
                onClick={() => {
                  setOrderItems([]);
                  setDiscount((prevDiscount) => ({ ...prevDiscount, value: 0 }));
                  setUserInfo({
                    phone: '',
                    name: '',
                    address: ''
                  })
                  setOrders([])
                }}
              >
                <p className="text-4xl font-bold py-4 text-white">
                  Clear
                </p>
              </div>

              <div className={` cursor-pointer w-2/12 ${orderItems.length !== 0 || totalTk <= 0 ? 'bg-[#00a65a]' : "bg-[#00a65b3f] "}`} >
                <button
                  disabled={orderItems.length === 0 || totalTk < 0}
                  onClick={handlePaymentClick}
                >
                  <p className="text-4xl font-bold py-4 text-white">
                    Payment
                  </p>
                </button>
              </div>
            </div>
          </div>
        </main>
        {modalVisible && (
          <SizeModal product={selectedProduct} onSizeSelect={handleSizeSelect} onClose={() => setModalVisible(false)} />
        )}
        {paymentModalVisible && (
          <PaymentModal exchangeDetails={exchangeDetails} exchangeAmount={exchangeAmount} totalDiscount={totalDiscount} setPaymentModalVisible={setPaymentModalVisible} userInfo={userInfo} orderItems={orderItems} discount={discount} calculateTotalAmount={calculateTotalAmount} finalAmount={totalTk} />

        )}

        <dialog id="orders_modal" className="modal">
          <div className="modal-box fixed top-16 w-11/12 max-w-5xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="text-lg font-bold">Previous Orders</h3>
            <table className="min-w-full bg-white px-4">
              <thead className="bg-green-500 text-white">
                <tr>
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Total Amount</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td className="border px-4 py-2">{order.invoice}</td>
                    <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{order.grandTotal}</td>
                    <td className="border px-4 py-2">{order.lastStatus.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </dialog>

        {
          isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-2xl font-semibold mb-4">Apply Membership Card</h2>

                {message && <p className="text-center mb-4 text-sm text-red-500">{message}</p>}

                <form onSubmit={handleSubmit}>
                  {/* Card Number */}
                  <div className="mb-4">
                    <label className="input  rounded-sm input-bordered flex items-center gap-2 my-1 h-10">
                      <CiBarcode />
                      <input
                        type="text"
                        className="grow"
                        placeholder="Membership card"
                        value={membershipCode}
                        onChange={handleMembershipBarcodeInputChange}
                      />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Apply Card"}
                    </button>
                    <button
                      type="button"
                      onClick={toggleAddMembershipModal}
                      className="ml-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        }
      </div>
    </React.Fragment>
  );
};

export default PosOrders;
