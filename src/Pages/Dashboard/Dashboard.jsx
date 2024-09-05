import { Link } from "react-router-dom";
import useLogout from "../../Hook/useLogout";

function Dashboard() {
    const { logout } = useLogout();
    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <Link to='/pos'><button className="btn w-36 bg-[#ff890f] hover:bg-orange-500">POS</button></Link>
                <button onClick={()=>logout()} className="btn w-36 bg-[#f31250] hover:bg-red-500">Log Out</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-bold">Total Sell</h2>
                    <p className="text-2xl">00</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-bold">Total Sale</h2>
                    <p className="text-2xl">00 ৳</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-bold">Total Collection</h2>
                    <p className="text-2xl">00 ৳</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-bold">Total Expense</h2>
                    <p className="text-2xl">00 ৳</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-bold">Net Profit</h2>
                    <p className="text-2xl">00 ৳</p>
                </div>

                <div className=" bg-gray-50 p-4 rounded shadow">
                    <h2 className="text-lg font-bold">Exchange</h2>
                    <p className="text-2xl">00 ৳</p>
                </div>
            </div>

            <div className=" bg-gray-100 mt-10">
                <div className=" bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-xl font-bold mb-6">Sale Manage</h1>

                    {/* Search Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Mobile Number"
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Invoice No."
                            className="border p-2 rounded"
                        />
                        <input
                            type="date"
                            placeholder="Choose Your Date"
                            className="border p-2 rounded"
                        />
                        <select className="border p-2 rounded">
                            <option>Show Room</option>
                            <option>Manager1</option>
                            <option>Manager2</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="p-3 text-left border">Sl</th>
                                    <th className="p-3 text-left border">Customer Details</th>
                                    <th className="p-3 text-left border">Showroom</th>
                                    <th className="p-3 text-left border">Order Details</th>
                                    <th className="p-3 text-left border">Total</th>
                                    <th className="p-3 text-left border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Table Rows */}
                                <tr className="bg-gray-50">
                                    <td className="p-3 border">1</td>
                                    <td className="p-3 border">Riyadh</td>
                                    <td className="p-3 border">
                                        Invoice No: INV-24081218
                                        <br />
                                        Date: 05-Sep-2024
                                        <br />
                                        Name: ROKY
                                        <br />
                                        Phone: 01838941253
                                        <br />
                                        Address: KUNIPARA
                                    </td>
                                    <td className="p-3 border">
                                        Item: 2
                                        <br />
                                        Qty: 2
                                    </td>
                                    <td className="p-3 border">
                                        Total Price: 3,090.00
                                        <br />
                                        Order Discount: 0.00
                                        <br />
                                        Grand Total: 3,090.00
                                        <br />
                                        Paid Amount: 3,090.00
                                    </td>
                                    <td className="p-3 border">
                                        <div className="relative inline-block text-left">
                                            <button className="bg-orange-500 text-white p-2 rounded">View</button>
                                        </div>
                                    </td>
                                </tr>
                                {/* More Rows */}
                            </tbody>
                        </table>
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
                                <tr>
                                    <td className="border p-2">Sagor (0160168555)</td>
                                    <td className="border p-2">2305 ৳ (2)</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">TANZIL (0161352090)</td>
                                    <td className="border p-2">2000 ৳ (1)</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">ABER (0152177509)</td>
                                    <td className="border p-2">995 ৳ (1)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-lg font-bold mb-2">Top Salesmen</h3>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Total Value</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
