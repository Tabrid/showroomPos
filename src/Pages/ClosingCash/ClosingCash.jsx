import { useEffect, useState } from "react";
import baseUrl from "../../Components/services/baseUrl";
import { Link } from "react-router-dom";
import { IoPlayBackCircleSharp } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
const ClosingCash = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [specificDate, setSpecificDate] = useState(""); // State for specific date
  const itemsPerPage = 10; // Number of entries per page
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [createMadal, setCreateModal] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/cash?page=${currentPage}&limit=${itemsPerPage}&date=${specificDate}`
        );
        const result = await response.json();

        // Assuming the API returns cash entries in the 'cashEntries' field
        setData(result.cashEntries);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError("Failed to fetch cash entries");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, specificDate]); // Depend on specificDate

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDateChange = (e) => {
    setSpecificDate(e.target.value); // Update the specific date
    setCurrentPage(1); // Reset to first page when date changes
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  const handleView = (entry) => {
    setSelectedEntry(entry);
  };
  const closeModal = () => {
    setSelectedEntry(null);
  };
  const handleCreateModal = () => {
    setCreateModal(true)
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mt-10">
      {/* Date Filter */}
      <div className="grid grid-cols-3 mb-5">
        <div className="flex justify-center">
          <div className="flex items-center h-full justify-evenly gap-10">
            <Link to='/'><IoPlayBackCircleSharp className="text-4xl  text-black" /></Link>
          </div>
        </div>
        <div className="flex justify-center">
          <form onSubmit={handleDateSubmit} className="mb-4">
            <label htmlFor="specificDate" className="mr-2">Filter by Date:</label>
            <input
              type="date"
              id="specificDate"
              value={specificDate}
              onChange={handleDateChange}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 text-white rounded px-4 py-1 hover:bg-blue-600"
            >
              Filter
            </button>
          </form>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleCreateModal}
            className=" bg-blue-500 text-white rounded px-4 py-1 hover:bg-blue-600"
          >
            add new
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-4 h-[400px] overflow-y-scroll">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Serial</th>
              <th className="py-2 px-4 border-b">Manager Name</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Total Cash</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr className="text-center" key={item._id}>
                <td className="py-2 px-4 border-b">{i + 1}</td>
                <td className="py-2 px-4 border-b">{item.manager.fullName}</td>
                <td className="py-2 px-4 border-b">{item.createdAt.split("T")[0]}</td>
                <td className="py-2 px-4 border-b">{item.total}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleView(item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 border ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'}`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'}`}
        >
          Next
        </button>
      </div>
      {
        createMadal && <CreateModal setCreateModal={setCreateModal}/>
      }
      {selectedEntry && (
        <Modal entry={selectedEntry} onClose={closeModal} />
      )}
    </div>
  );
};

export default ClosingCash;

function CreateModal({setCreateModal}) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50">
      <div className=" w-[900px] mt-10 mx-auto p-6 max-h-fit bg-gray-100 shadow-md rounded-lg">
        <div className="flex justify-end">
          <RxCrossCircled onClick={()=> setCreateModal(false)}  className="text-2xl cursor-pointer"/>
        </div>
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
    </div>
  )
}


const Modal = ({ entry, onClose }) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-2">Cash Entry Details</h2>
        <p><strong>Total Cash:</strong> {entry.total}</p>
        <p><strong>Manager:</strong> {entry.manager ? entry.manager.fullName : 'Not Assigned'}</p>
        <p><strong>Date:</strong> {entry.createdAt.split("T")[0]}</p>

        <h3 className="font-bold mt-4">Cash List:</h3>
        <ul className="list-disc ml-4">
          {entry?.cashList.map((item, index) => (
            <li key={index}>
              <strong>Denomination:</strong> {item.denomination} - <strong>Pieces:</strong> {item.pieces} - <strong>ToTal:</strong> {item.denomination * item.pieces}

            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};
