
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Award, Plus, FileUp, Download } from 'lucide-react';

const EvaluationManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-yellow-50 p-4 rounded-xl border border-yellow-200">
        <div>
          <h3 className="text-lg font-bold text-yellow-800">إدارة التقييمات الشهرية</h3>
          <p className="text-sm text-yellow-700">يمكنك إضافة التقييمات يدوياً أو رفعها كشيت إكسيل مجمع</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-yellow-700 flex items-center gap-2">
             <Plus size={18} /> إضافة تقييم
           </button>
           <button className="bg-white text-yellow-700 border border-yellow-200 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-yellow-50 flex items-center gap-2">
             <FileUp size={18} /> رفع إكسيل
           </button>
        </div>
      </div>

      <div className="p-12 text-center text-gray-400 border-2 border-dashed rounded-2xl">
        <Award size={64} className="mx-auto mb-4 opacity-10" />
        <p>لا توجد تقييمات مسجلة لهذا الشهر حالياً</p>
      </div>
    </div>
  );
};

export default EvaluationManager;
