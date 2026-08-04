import { useEffect } from 'react';
import { IoClose, IoCheckmarkCircle, IoAlertCircle, IoInformationCircle, IoWarning } from 'react-icons/io5';

const typeConfig = {
  success: { icon: IoCheckmarkCircle, bg: 'bg-green-600', text: 'text-green-100' },
  error: { icon: IoAlertCircle, bg: 'bg-red-600', text: 'text-red-100' },
  info: { icon: IoInformationCircle, bg: 'bg-blue-600', text: 'text-blue-100' },
  warning: { icon: IoWarning, bg: 'bg-yellow-600', text: 'text-yellow-100' }
};

export default function Toast({ toasts = [], removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(toast => {
        const config = typeConfig[toast.type] || typeConfig.info;
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg min-w-[280px] max-w-[400px] ${config.bg}`}
          >
            <Icon size={20} className="flex-shrink-0" />
            <span className="text-sm flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white cursor-pointer flex-shrink-0"
            >
              <IoClose size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
