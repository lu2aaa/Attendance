
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AttendanceRecord, Employee } from '../../types';
import { FileUp, FileDown, Search, Filter, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const AttendanceProcessor: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchRecords();
  }, [dateFilter]);

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('attendance_data')
      .select('*, employees(name, specialty)')
      .eq('date', dateFilter);
    if (data) setRecords(data);
    setLoading(false);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawData: any[] = XLSX.utils.sheet_to_json(ws);
      
      // Expected Format: EmployeeID | Date | Fingerprints (Space separated)
      const processed = rawData.map(row => ({
        employee_id: row['رقم الموظف'],
        date: row['التاريخ'],
        fingerprints: row['توقيتات البصمات']
      }));

      const { error } = await supabase.from('attendance_data').upsert(processed);
      if (!error) {
        alert('تم رفع بصمات اليوم بنجاح');
        fetchRecords();
      } else {
        alert('حدث خطأ: ' + error.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const parseAttendance = (fingerprints: string) => {
    const times = fingerprints.trim().split(/\s+/).sort();
    if (times.length === 0 || !fingerprints) return { in: '-', out: '-', status: 'غياب' };
    
    const timeIn = times[0];
    const timeOut = times.length > 1 ? times[times.length - 1] : 'غياب';
    
    // Simple shift logic for morning (8:00 start)
    const [h, m] = timeIn.split(':').map(Number);
    const minutes = h * 60 + m;
    const target = 8 * 60; // 08:00
    const limit = target + 30; // 08:30
    
    let status = 'منتظم';
    if (minutes > limit) status = 'تأخير';
    if (timeOut === 'غياب') status = 'نقص بصمة انصراف';

    return { in: timeIn, out: timeOut, status };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">تاريخ اليوم</label>
            <input 
              type="date" 
              className="p-2 border rounded-lg outline-none" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <label className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 cursor-pointer font-bold shadow-md transition-colors">
            <FileUp size={20} /> رفع شيت البصمات
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
          </label>
          <button className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 border border-gray-300 font-bold shadow-sm">
            <FileDown size={20} /> تحميل عينة
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">الموظف</th>
              <th className="p-4">التخصص</th>
              <th className="p-4">بصمة الحضور</th>
              <th className="p-4">بصمة الانصراف</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">ساعات العمل</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">جاري تحميل البيانات...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">لا توجد سجلات لهذا اليوم</td></tr>
            ) : (
              records.map(rec => {
                const { in: timeIn, out: timeOut, status } = parseAttendance(rec.fingerprints);
                return (
                  <tr key={rec.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{rec.employees?.name}</div>
                      <div className="text-xs text-gray-400">كود: {rec.employee_id}</div>
                    </td>
                    <td className="p-4">{rec.employees?.specialty}</td>
                    <td className="p-4 font-mono font-bold text-blue-600">{timeIn}</td>
                    <td className="p-4 font-mono font-bold text-orange-600">{timeOut}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        status === 'تأخير' ? 'bg-orange-100 text-orange-700' :
                        status === 'منتظم' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold">
                      {timeIn !== '-' && timeOut !== 'غياب' ? '8 ساعات' : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex gap-4 items-start">
        <AlertCircle className="text-blue-500 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-blue-800 mb-1">تذكير بقواعد الحضور:</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pr-4">
            <li>فترة السماح: 30 دقيقة من بداية الشيفت.</li>
            <li>أيام الجمعة عطلة رسمية (الحضور فيها يحسب ساعات إضافية).</li>
            <li>في حالة وجود بصمة واحدة فقط، يعتبر الانصراف غياب (يخصم من الموظف).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AttendanceProcessor;
