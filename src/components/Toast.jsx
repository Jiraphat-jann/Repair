import React from 'react';
import { useRepair } from '../context/RepairContext';
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

export default function Toast() {
  const { toast } = useRepair();

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-green" />,
    info: <Info size={18} className="text-blue" />,
    warning: <AlertTriangle size={18} className="text-amber" />,
    error: <XCircle size={18} className="text-danger" />
  };

  return (
    <div className={`toast-notification show ${toast.type || 'success'}`}>
      <span className="toast-icon">{icons[toast.type] || icons.success}</span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
