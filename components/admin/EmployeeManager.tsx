
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Employee } from '../../types';
// Import missing icons X and Clock
import { Search, Plus, FileUp, Download, Edit2, Trash2, Eye, X, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';

const EmployeeManager: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('*');
    if (data) setEmployees(data);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const { error } = await supabase.from('employees').insert(data);
      if (!error) {
        alert('تم رفع البيانات بنجاح');
        fetchEmployees();
      } else {
        alert('حدث خطأ في الرفع: ' + error.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredEmployees = employees.filter(emp => 
    (emp.name.includes(search) || emp.employee_id.includes(search)) &&
    (filterSpecialty === '' || emp.specialty === filterSpecialty)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث بالاسم أو الكود..."
              className="w-full pr-10 pl-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="p-2 border rounded-lg"
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
          >
            <option value="">جميع التخصصات</option>
            {Array.from(new Set(employees.map(e => e.specialty))).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow-md"
          >
            <Plus size={18} /> إضافة موظف
          </button>
          <label className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 cursor-pointer font-semibold">
            <FileUp size={18} /> رفع إكسيل
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-bold text-gray-600">الكود</th>
              <th className="p-4 font-bold text-gray-600">الاسم</th>
              <th className="p-4 font-bold text-gray-600">التخصص</th>
              <th className="p-4 font-bold text-gray-600">التليفون</th>
              <th className="p-4 font-bold text-gray-600">الحالة</th>
              <th className="p-4 font-bold text-gray-600">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.employee_id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono">{emp.employee_id}</td>
                <td className="p-4 font-semibold">{emp.name}</td>
                <td className="p-4 text-gray-600">{emp.specialty}</td>
                <td className="p-4 text-gray-600">{emp.phone}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${emp.status === 'على رأس العمل' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedEmployee(emp)} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Eye size={18} /></button>
                    <button className="text-orange-500 hover:bg-orange-50 p-1 rounded"><Edit2 size={18} /></button>
                    <button className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">تفاصيل الموظف: {selectedEmployee.name}</h2>
              <button onClick={() => setSelectedEmployee(null)} className="text-gray-500 hover:text-red-500"><X size={32} /></button>
            </div>
            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center">
                    <img src={selectedEmployee.photo_url || 'https://picsum.photos/200/200?random=1'} className="w-48 h-48 rounded-full border-4 border-blue-100 object-cover shadow-lg mb-4" />
                    <span className="text-xl font-bold text-blue-600 mb-2">كود: {selectedEmployee.employee_id}</span>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-gray-500">الرقم القومي</p><p className="font-bold">{selectedEmployee.national_id}</p></div>
                      <div><p className="text-gray-500">التخصص</p><p className="font-bold">{selectedEmployee.specialty}</p></div>
                      <div><p className="text-gray-500">رقم الهاتف</p><p className="font-bold">{selectedEmployee.phone}</p></div>
                      <div><p className="text-gray-500">تاريخ التعيين</p><p className="font-bold">{selectedEmployee.start_date}</p></div>
                      <div><p className="text-gray-500">رصيد الاعتيادي</p><p className="font-bold text-green-600">{selectedEmployee.regular_leave_balance} يوم</p></div>
                      <div><p className="text-gray-500">رصيد العارضة</p><p className="font-bold text-orange-600">{selectedEmployee.casual_leave_balance} يوم</p></div>
                    </div>
                  </div>
               </div>
               
               <div className="mt-8 border-t pt-8">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-800">
                   <Clock size={20} /> إحصائيات الشهر الحالي
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBox label="إجمالي الحضور" value="22 يوم" color="text-green-600" />
                    <StatBox label="إجمالي الغياب" value="2 يوم" color="text-red-600" />
                    <StatBox label="إجمالي ساعات العمل" value="154 ساعة" color="text-blue-600" />
                    <StatBox label="رصيد الأجازات" value="18 يوم" color="text-purple-600" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-gray-50 p-4 rounded-xl border text-center">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
  </div>
);

export default EmployeeManager;
