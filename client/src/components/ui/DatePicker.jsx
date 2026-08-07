import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from '../../context/ThemeContext';

export default function CustomDatePicker({ value, onChange, placeholder, minDate, maxDate }) {
  const { isDark } = useTheme();

  return (
    <DatePicker
      selected={value ? new Date(value) : null}
      onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')}
      placeholderText={placeholder || 'Select date'}
      dateFormat="yyyy-MM-dd"
      minDate={minDate}
      maxDate={maxDate}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      calendarClassName={isDark ? 'dark-theme' : ''}
      popperClassName={isDark ? 'dark-theme' : ''}
      wrapperClassName="w-full"
    />
  );
}
