import { useState } from "react";
import baseUrl from "../../Components/services/baseUrl";


function CreateModal() {
    const [cashList, setCashList] = useState([{ denomination: 1, pieces: 0 }]);
    const [total, setTotal] = useState(0);

    // Denominations to select from
    const denominations = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

    // Add new denomination input
    const addDenomination = () => {
        setCashList([...cashList, { denomination: 1, pieces: 0 }]);
    };

    // Remove a denomination row
    const removeDenomination = (index) => {
        const newList = cashList.filter((_, i) => i !== index);
        setCashList(newList);
    };

    // Handle the change of denomination or pieces
    const handleInputChange = (index, field, value) => {
        const newList = [...cashList];
        newList[index][field] = field === "denomination" ? parseInt(value) : value;
        setCashList(newList);
    };

    // Calculate total amount of cash
    const calculateTotal = () => {
        let totalAmount = cashList.reduce((acc, curr) => {
            return acc + curr.denomination * parseInt(curr.pieces);
        }, 0);
        setTotal(totalAmount);
    };

    const handleSubmit = async () => {
        const manager = JSON.parse(localStorage.getItem('userId'));
        try {
            const data = {
                cashList,
                total,
                manager,
            };
            const response = await fetch(`${baseUrl}/api/cash/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            console.log(response);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log('Data submitted successfully:', result);
            alert('Data submitted successfully')
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };
    return (
        <div className="w-1/2 mx-auto p-6 bg-gray-100 shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Closing Cash
            </h1>

            <div className="max-h-[300px] overflow-y-scroll">
                {cashList.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-4 bg-white p-4 rounded-md shadow"
                    >
                        {/* Denomination Select */}
                        <select
                            className="border p-2 rounded-md w-24"
                            value={item.denomination}
                            onChange={(e) =>
                                handleInputChange(index, "denomination", e.target.value)
                            }
                        >
                            {denominations.map((denom) => (
                                <option key={denom} value={denom}>
                                    {denom} TK
                                </option>
                            ))}
                        </select>

                        {/* Pieces Input */}
                        <input
                            type="number"
                            className="border p-2 rounded-md w-24"
                            placeholder="Pieces"
                            value={item.pieces}
                            onChange={(e) =>
                                handleInputChange(index, "pieces", e.target.value)
                            }
                        />

                        {/* Total for this row */}
                        <p className="font-semibold text-gray-700">
                            Total: {item.denomination * item.pieces} TK
                        </p>

                        {/* Delete Button */}
                        <button
                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                            onClick={() => removeDenomination(index)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/* Add More Button */}
            <button
                className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600"
                onClick={addDenomination}
            >
                + Add More
            </button>

            {/* Total Calculation Button */}
            <div className="text-center">
                <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                    onClick={calculateTotal}
                >
                    Total Calculate
                </button>

                {/* Total Display */}
                <div className="mt-4 text-2xl font-bold text-gray-800">
                    Total: {total} TK
                </div>

                {/* Submit Button */}
                <button
                    className="bg-purple-500 mt-4 text-white px-6 py-2 rounded-md hover:bg-purple-600"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default CreateModal