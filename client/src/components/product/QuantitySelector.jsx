import { useState, useEffect } from 'react';
import { IoAdd, IoRemove } from 'react-icons/io5';

export default function QuantitySelector({ quantity, onChange, max = 99, min = 1 }) {
  const [inputValue, setInputValue] = useState(quantity.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setInputValue(quantity.toString());
    setError('');
  }, [quantity]);

  const handleDecrease = () => {
    if (quantity > min) {
      const newVal = quantity - 1;
      onChange(newVal);
      setInputValue(newVal.toString());
      setError('');
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newVal = quantity + 1;
      onChange(newVal);
      setInputValue(newVal.toString());
      setError('');
    } else {
      setError(`Only ${max} available`);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (val === '') {
      setError('');
      return;
    }

    const num = parseInt(val, 10);
    if (isNaN(num)) return;

    if (num > max) {
      setError(`Only ${max} available`);
    } else if (num < min) {
      setError(`Minimum quantity is ${min}`);
    } else {
      setError('');
      onChange(num);
    }
  };

  const handleBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < min) {
      setInputValue(min.toString());
      onChange(min);
      setError('');
    } else if (num > max) {
      setInputValue(max.toString());
      onChange(max);
      setError('');
    } else {
      setInputValue(num.toString());
      onChange(num);
      setError('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className="relative inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="px-3 py-2 flex-shrink-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-gray-600 dark:text-gray-300"
      >
        <IoRemove size={16} />
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        min={min}
        max={max}
        className={`w-12 text-center font-medium text-gray-800 dark:text-gray-200 bg-transparent border-x border-gray-300 dark:border-gray-600 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? 'border-red-500 dark:border-red-400' : ''}`}
      />
      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="px-3 py-2 flex-shrink-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer text-gray-600 dark:text-gray-300"
      >
        <IoAdd size={16} />
      </button>
      {error && (
        <p className="absolute -bottom-6 left-0 text-xs text-red-500 dark:text-red-400 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
