import { useState } from 'react';
import baseUrl from './services/baseUrl';

const HoldSaleModal = ({ isOpen, onClose, orderItems, userInfo,setOrders,setUserInfo ,setOrderItems}) => {
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleHold = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/showroomOrderHold`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderItems, userInfo, note }),
            });

            if (response.ok) {
                const data = await response.json();
                setNote('')
                setUserInfo({
                    phone: '',
                    name: '',
                    address: ''
                })
                setOrders([])
                setOrderItems([])
                onClose();
            } else {
                console.error('Failed to create hold:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating hold:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white fixed top-5 rounded shadow-lg w-1/3 p-4">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">Hold Sale</h2>
                    <button onClick={onClose} className="text-gray-600 text-3xl">&times;</button>
                </div>
                <div className="mb-4">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                        Note
                    </label>
                    <textarea
                        type="text"
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                        placeholder="Note"
                    />
                </div>
                <div className="text-right">
                    <button
                        onClick={handleHold}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Hold
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HoldSaleModal;
