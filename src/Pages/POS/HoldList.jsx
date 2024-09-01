import { useState, useEffect } from 'react';
import baseUrl from '../../Components/services/baseUrl';

const HoldList = ({ isOpen, onClose, setUserInfo, setOrderItems }) => {
    const [sales, setSales] = useState([]);

    // Fetch sales data when the modal is opened
    useEffect(() => {
        if (isOpen) {
            fetchSalesData();
        }
    }, [isOpen]);

    const fetchSalesData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/showroomOrderHold`);
            if (response.ok) {
                const data = await response.json();
                setSales(data);
            } else {
                console.error('Failed to fetch sales data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    const handleRestore = async (sale) => {
        setOrderItems(sale.orderItems)
        setUserInfo({
            phone: sale.userInfo.phone,
            name: sale.userInfo.name,
            address: sale.userInfo.address,
        });
        handleDelete(sale._id);
        onClose();
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/api/showroomOrderHold/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setSales(sales.filter((sale) => sale._id !== id));
            } else {
                console.error('Failed to delete sale:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting sale:', error);
        }
    };
    function formatDateTime(isoDateString) {
        const date = new Date(isoDateString);

        // Format the date and time with AM/PM
        const formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });

        return formattedDate;
    }
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white fixed top-5 rounded shadow-lg p-6 max-w-4xl w-full ">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Hold Sale List</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">SL.</th>
                                <th>Customer</th>
                                <th>Time</th>
                                <th>Note</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale, index) => (
                                <tr key={sale.id} className="border-b">
                                    <td className="py-2">{index + 1}</td>
                                    <td>{sale.userInfo.name}</td>
                                    <td>{formatDateTime(sale.createdAt)}</td>
                                    <td>{sale.note}</td>
                                    <td className="flex space-x-2">
                                        <button
                                            onClick={() => handleRestore(sale)}
                                            className="p-1 bg-blue-500 rounded text-white hover:bg-blue-600"
                                        >
                                            ✔️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sale._id)}
                                            className="p-1 bg-red-500 rounded text-white hover:bg-red-600"
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HoldList;
