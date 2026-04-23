
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AlertTriangle, CheckCircle, Info, Truck, X, AlertOctagon } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const RealtimeNotifications: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (title: string, message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    // Auto dismiss after 6 seconds
    setTimeout(() => removeToast(id), 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    // Subscribe to waste_logs updates (Transport Status)
    const logsSubscription = supabase.channel('waste_logs_notifications')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'waste_logs' }, (payload) => {
          const newData = payload.new;
          if (newData.notes?.includes('Verified')) {
             addToast('Transport Verified', `Log ${newData.id} confirmed at destination.`, 'success');
          } else if (newData.notes?.includes('Rejected')) {
             addToast('Load Rejected', `Log ${newData.id} rejected at facility! Action required.`, 'error');
          } else if (newData.notes?.includes('In Transit')) {
             addToast('Logistics Update', `Vehicle for ${newData.id} is now in transit.`, 'info');
          }
      }).subscribe();

    // Subscribe to Project updates (Compliance Alerts)
    const projectsSubscription = supabase.channel('projects_notifications')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) => {
          const newData = payload.new;
          
          if (newData.hazmat_status === 'Detected') {
             addToast('Compliance Alert', `Critical: Hazardous materials detected at ${newData.name}.`, 'warning');
          }
          if (newData.compliance_status && parseInt(newData.compliance_status) < 50) {
             addToast('Compliance Risk', `Compliance score for ${newData.name} has dropped critically to ${newData.compliance_status}%.`, 'error');
          }
      }).subscribe();

    return () => {
      supabase.removeChannel(logsSubscription);
      supabase.removeChannel(projectsSubscription);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div className="fixed top-20 right-6 z-[60] flex flex-col space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-80 p-4 rounded-xl shadow-xl border-l-4 flex items-start space-x-3 bg-white animate-slide-in ${
              toast.type === 'success' ? 'border-green-500 shadow-green-500/10' :
              toast.type === 'error' ? 'border-red-500 shadow-red-500/10' :
              toast.type === 'warning' ? 'border-amber-500 shadow-amber-500/10' :
              'border-blue-500 shadow-blue-500/10'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {toast.type === 'error' && <AlertOctagon className="w-5 h-5 text-red-500" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {toast.type === 'info' && <Truck className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-800">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-snug">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
