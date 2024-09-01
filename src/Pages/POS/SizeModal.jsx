import{ useState } from "react";

const SizeModal = ({ product, onSizeSelect, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleConfirm = () => {
    if (selectedSize) {
      onSizeSelect(selectedSize);
    } else {
      alert("Please select a size.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">{product.productName}</h2>
        <select className="w-full p-2 border rounded" onChange={handleSizeChange}>
          <option value="">Select Size</option>
          {product?.sizeDetails?.map((size, index) => (
            <option key={index} value={size.size}>
              {size.size}({size.openingStock})
            </option>
          ))}
        </select>
        <div className="flex justify-end mt-4">
          <button className="btn bg-red-500 text-white mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn bg-green-500 text-white" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeModal;
