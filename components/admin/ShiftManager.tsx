
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Clock, Calendar, Users, Moon } from 'lucide-react';

const ShiftManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('evening');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b">
        <button 
          onClick={() => setActiveSubTab('evening')}
          className={`pb-3 px-4 font-bold transition-all ${activeSubTab === 'evening' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400'}`}
        >
          جدول المسائي
        </button>
        <button 
          onClick={() => setActiveSubTab('overnight')}
          className={`pb-3 px-4 font-bold transition-all ${activeSubTab === 'overnight' ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
        >
          جدول المبيت
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
          <h3 className="font-bold flex items-center gap-2">
            {activeSubTab === 'evening' ? <Clock className="text-blue-500" /> : <Moon className="text-indigo-500" />}
            إضافة {activeSubTab === 'evening' ? 'فترة مسائية' : 'فترة مبيت'} جديد
          </h3>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">التاريخ</label>
            <input type="date" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">اختيار الموظفين</label>
            <div className="p-3 border rounded-lg bg-gray-50 min-h-[100px] text-center text-gray-400 text-sm">
              اختر الموظفين لإدراجهم في الجدول
            </div>
          </div>
          <button className={`w-full py-3 rounded-lg text-white font-bold shadow-lg ${activeSubTab === 'evening' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            حفظ الجدول
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-bold mb-4">الجدول المحفوظ مؤخراً</h3>
          <div className="space-y-3">
             <div className="bg-white p-3 rounded-lg border flex justify-between items-center shadow-sm">
               <div>
                 <p className="font-bold text-sm">الخميس 15 يونيو 2024</p>
                 <p className="text-xs text-gray-500">3 موظفين مدرجين</p>
               </div>
               <button className="text-xs text-blue-500 font-bold hover:underline">عرض التفاصيل</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftManager;
