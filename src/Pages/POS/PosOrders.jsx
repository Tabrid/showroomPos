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
const PosOrders = () => {
  document.title = "Estarch | Pos Orders";
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [discount, setDiscount] = useState({ type: 'percentage', value: 0 });
  const [totalTk, setTotalTK] = useState(0)
  const [userInfo, setUserInfo] = useState({
    phone: '',
    name: '',
    address: ''
  });
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenList, setIsModalOpenList] = useState(false);

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

console.log(orderItems);

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
  const handleUserInfoChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'phone' && value.length === 11) {
      console.log(name, value.length);

      await fetchUserData(value);
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
    setTotalTK(calculateTotalAmount() - totalDiscount)
  }, [calculateTotalAmount(), totalDiscount, discount])

  return (
    <React.Fragment>
      <div className="mt-2">
        <main className="min-h-screen bg-slate-50">
          <div className="flex">
            <div className="w-5/12 flex items-center flex-col px-3">
              <div className="w-full">
                <FilterDropdown setProducts={setProducts} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {products?.map((product, index) => (
                  <div
                    key={index}
                    className="cursor-pointer card card-compact bg-base-100 w-[140px] h-[220px] shadow-xl rounded-none mt-2"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="p-2 h-[150px]">
                      <figure>
                        <img
                          className="h-[140px] w-[130px]"
                          src={`${baseUrl}/${product.images[0]}`}
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
                  <div className="h-[270px] overflow-y-scroll ">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex items-center border-b">
                        <div className="px-4 py-2 flex-grow w-28 text-xs  border-r">{item.productName} ({item.size})<br />Barcode: {item.barcode}</div>
                        <div className="px-4 py-2 flex-1 border-r">{item.regularPrice}</div>
                        <div className="px-4 py-2 flex-1 border-r">
                          <input
                            type="number"
                            value={item.discountPercent}
                            onChange={(e) => handleDiscountChange(index, 'discountPercent', e.target.value)}
                            className="input w-16"
                          />
                        </div>
                        <div className="px-4 py-2 flex-1 border-r">
                          <input
                            type="number"
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
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <Modal />
                </div>
              </dialog>
              <div className="bg-[#c1793c] w-1/12 cursor-pointer" onClick={handleOpenModalList}>
                <p className="text-4xl font-bold py-4 text-white">
                  :::
                </p>
              </div>
              <HoldList setUserInfo={setUserInfo} setOrderItems={setOrderItems} isOpen={isModalOpenList} onClose={handleCloseModalList}/>
              <div className="bg-[#ff890f] w-1/12 cursor-pointer"  onClick={handleOpenModal}>
                <p className="text-4xl font-bold py-4 text-white">
                  Hold
                </p>
              </div>
              <HoldSaleModal userInfo={userInfo} orderItems={orderItems} isOpen={isModalOpen} onClose={handleCloseModal} />
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

              <div className={` cursor-pointer w-2/12 ${userInfo.phone ? 'bg-[#00a65a]' : "bg-[#00a65b3f] "}`} >
                <button disabled={!userInfo.phone} onClick={handlePaymentClick}>
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
          <PaymentModal setPaymentModalVisible={setPaymentModalVisible} userInfo={userInfo} orderItems={orderItems} discount={discount} calculateTotalAmount={calculateTotalAmount} finalAmount={totalTk} />

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


      </div>
    </React.Fragment>
  );
};

export default PosOrders;
