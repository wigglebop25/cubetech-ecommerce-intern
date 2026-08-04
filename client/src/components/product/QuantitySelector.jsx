import { IoAdd, IoRemove } from 'react-icons/io5';

export default function QuantitySelector({ quantity, onChange, max = 99, min = 1 }) {
  const handleDecrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <IoRemove size={16} />
      </button>
      <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <IoAdd size={16} />
      </button>
    </div>
  );
}
