import { Link } from "react-router-dom";
import useLogout from "../../Hook/useLogout";
import { useState, useEffect } from "react";
import baseUrl from "../../Components/services/baseUrl";

function Dashboard() {
    const { logout } = useLogout();
    const [startDate, setStartDate] = useState('');
    const [singleDate, setSingleDate] = useState(); 
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState({});
    const [orders, setOrders] = useState([]);
    const [mobileNumber, setMobileNumber] = useState('');
    const [invoiceNo, setInvoiceNo] = useState('');
    const [date, setDate] = useState('');
    const [manager, setManager] = useState('Show Room'); 
    

    // Fetch user ID and initialize dashboard data
    useEffect(() => {
        fetchOrder()
        let userId;
        try {
            const userIdString = localStorage.getItem('userId');
            if (userIdString) {
                userId = JSON.parse(userIdString);
                // Optionally: fetch and set initial data here based on userId
                fetchFilteredData(userId, startDate, endDate, singleDate); // Assuming you need userId to fetch data
            } else {
                console.warn('No userId found in localStorage');
            }
        } catch (error) {
            console.error('Error parsing userId from localStorage:', error);
        }
    }, [startDate, endDate, singleDate]); // Add dependencies if needed

    const fetchFilteredData = async (userId, startDate = '', endDate = '', singleDate = '') => {
        try {
            const response = await fetch(`${baseUrl}/api/orders/manager/${userId}/stats?startDate=${startDate}&endDate=${endDate}&singleDate=${singleDate}`);
            const result = await response.json();
            setData(result);
            console.log(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchOrder = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/orders/oders/showrooms?phone=${mobileNumber}&invoice=${invoiceNo}&date=${date}&manager=${manager}`);
            const result = await response.json();

            setOrders(result.reverse());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchOrder()
    }, [manager, date, invoiceNo, mobileNumber]);
    const handleDateChange = () => {
        const userIdString = localStorage.getItem('userId');
        const userId = JSON.parse(userIdString);
        // Fetch and filter data based on selected dates
        fetchFilteredData(userId, startDate, endDate);
    };
    const handleView = (id) => {
        window.location.href = `/invoice/${id}`;
    }

    function formatDateTime(dateString) {
        const date = new Date(dateString);

        // Format options for the date and time
        const options = {
            year: 'numeric',
            month: 'long', // Full month name, use 'short' for abbreviated month
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true // Use 12-hour format if you want AM/PM
        };

        return date.toLocaleDateString('en-US', options);
    }
    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <Link to='/pos'>
                    <button className="btn w-36 bg-[#ff890f] hover:bg-orange-500">POS</button>
                </Link>
                <Link to='/account'>
                    <button className="btn w-36 bg-[#0f8fff9e] hover:bg-[#0f8fff9e] text-white">Account</button>
                </Link>
                <Link to='/closing-cash'>
                    <button className="btn w-36 bg-[#434cd5b5] hover:bg-[#434cd5b5] text-white">Closing Cash</button>
                </Link>
                <button onClick={() => logout()} className="btn w-36 bg-[#f31250] hover:bg-red-500">Log Out</button>
            </div>
            <div className="flex justify-center space-x-4 mb-4 my-3">
                <input
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    placeholder="Choose Your Date"
                    className="border p-2 rounded"
                />
                <div className="flex justify-center items-center gap-5">
                    <p className="block text-gray-700">Start Date</p>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>
                <div className="flex justify-center items-center gap-5">
                    <p className="block text-gray-700">End Date:</p>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>
                <button
                    onClick={handleDateChange}
                    className="bg-blue-500 text-white px-4 w-36 rounded"
                >
                    Filter
                </button>
            </div>
            <div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold">Total Sell</h2>
                        <p className="text-2xl">{data.totalSellCount} </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold">Total Sale</h2>
                        <p className="text-2xl">{data.totalSellAmount} ৳</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold">Total Collection</h2>
                        <p className="text-2xl">{data.totalSellAmount} ৳</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold">Total Expense</h2>
                        <p className="text-2xl">00 ৳</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold">Net Profit</h2>
                        <p className="text-2xl">00 ৳</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded shadow">
                        <h2 className="text-lg font-bold">Exchange</h2>
                        <p className="text-2xl">{data.totalExchangeAmount} ৳</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 mt-10">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-xl font-bold mb-6">Sale Manage</h1>

                    {/* Search Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Mobile Number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Invoice No."
                            value={invoiceNo}
                            onChange={(e) => setInvoiceNo(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <input
                            type="date"
                            placeholder="Choose Your Date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <select
                            value={manager}
                            onChange={(e) => setManager(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="Show Room">Show Room</option>
                            <option value="Manager1">Manager1</option>
                            <option value="Manager2">Manager2</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-6 bg-white border">
                            <div className="p-4 min-w-[50px] border">Sl</div>
                            <div className="p-4 min-w-[150px] border">Customer Details</div>
                            <div className="p-4 min-w-[200px] border">Showroom</div>
                            <div className="p-4 min-w-[150px] border">Order Details</div>
                            <div className="p-4 min-w-[150px] border">Total</div>
                            <div className="p-4 min-w-[100px] border">Action</div>
                        </div>

                        <div className="h-[500px] overflow-y-scroll">
                            {orders.map((data, i) => (
                                <div key={data._id} className="grid grid-cols-6 bg-gray-50 border-b">
                                    <div className="p-4 border">{i + 1}<br /> <br /> {formatDateTime(data.createdAt)} </div>
                                    <div className="p-4 border">
                                        {data.name ? data.name : 'Guest'}
                                        <br />
                                        {data.phone}
                                        <br />
                                        {data.address}
                                    </div>

                                    <div className="p-4 border">
                                        Invoice No: {data.invoice}
                                        <br />
                                        Malibag , Dhaka 1219

                                    </div>
                                    <div className="p-4 border">
                                        Item: {data.cartItems.length}
                                        <br />
                                        Qty: {data.cartItems.reduce((total, item) => total + item.quantity, 0)}
                                    </div>
                                    <div className="p-4 border">
                                        Total Price: {data.totalAmount + data.discount}
                                        <br />
                                        Order Discount: {data.discount}
                                        <br />
                                        Grand Total: {data.totalAmount}
                                        <br />
                                        Paid Amount: {data.totalAmount}
                                    </div>
                                    <div className="p-4 border">
                                        <div className="relative inline-block text-left">
                                            <button onClick={() => handleView(data?._id)} className="bg-orange-500 text-white px-4 py-2 rounded">View</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
            <div className="mt-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-bold mb-2">Top Customers</h3>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Total Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <td className="border p-2">Sagor (0160168555)</td>
                                    <td className="border p-2">2305 ৳ (2)</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">TANZIL (0161352090)</td>
                                    <td className="border p-2">300 ৳ (1)</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-bold mb-2">Top Products</h3>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Total Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <td className="border p-2">Black Watch</td>
                                    <td className="border p-2">2305 ৳ (2)</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">White Watch</td>
                                    <td className="border p-2">300 ৳ (1)</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
