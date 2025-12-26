
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Check, X, Clock, MapPin } from 'lucide-react';

const MovementReview: React.FC = () => {
  const [movements, setMovements] = useState<any[]>([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const { data } = await supabase.from('movements').select('*, employees(name)').order('created_at', { ascending: false });
    if (data) setMovements(data);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('movements').update({ status }).eq('id', id);
    if (!error) fetch();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">طلبات التحرك والأجازات المعلقة</h3>
      
      {movements.length === 0 ? (
        <div className="p-20 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed">
          <Clock size={48} className="mx-auto mb-4 opacity-20" />
          <p>لا توجد طلبات تحرك معلقة للمراجعة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {movements.map(m => (
            <div key={m.id} className={`p-4 rounded-xl border-l-4 shadow-sm bg-white ${m.status === 'pending' ? 'border-l-orange-500' : m.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">{m.employees?.name}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-lg text-gray-600 font-bold">{m.type}</span>
              </div>
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p>الفترة: {m.start_date} إلى {m.end_date}</p>
                {m.notes && <p className="italic bg-gray-50 p-2 rounded text-xs">ملاحظات: {m.notes}</p>}
              </div>
              {m.status === 'pending' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateStatus(m.id, 'approved')}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-1 hover:bg-green-600"
                  >
                    <Check size={16} /> موافقة
                  </button>
                  <button 
                    onClick={() => updateStatus(m.id, 'rejected')}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-1 hover:bg-red-600"
                  >
                    <X size={16} /> رفض
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovementReview;
