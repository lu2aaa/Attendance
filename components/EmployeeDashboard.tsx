
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  User, Calendar, Clock, Award, FileText, Send, 
  ChevronLeft, LayoutGrid, Printer, Bell
} from 'lucide-react';
import MessageManager from './admin/MessageManager';

const EmployeeDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [employee, setEmployee] = useState<any>(null);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('secret_code', secretCode)
      .single();

    if (data) {
      setEmployee(data);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('كود الموظف أو الرقم السري غير صحيح');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">بوابة الموظف</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">كود الموظف</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="0000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">الرقم السري الخاص</label>
            <input
              type="password"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            دخول البوابة
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'ملفي الشخصي', icon: User },
    { id: 'attendance', label: 'تقارير الحضور', icon: Calendar },
    { id: 'shifts', label: 'الشيفتات والنبوتجيات', icon: Clock },
    { id: 'evaluations', label: 'تقييماتي الشهري', icon: Award },
    { id: 'movements', label: 'طلب تحرك/أجازة', icon: Send },
    { id: 'templates', label: 'طباعة نماذج', icon: Printer },
    { id: 'messages', label: 'الرسائل والتنبيهات', icon: Bell },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl">
            {employee.name[0]}
          </div>
          <div>
            <h2 className="font-bold text-gray-800">{employee.name}</h2>
            <p className="text-xs text-gray-500">{employee.specialty} | كود: {employee.employee_id}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 text-center">
             <p className="text-[10px] text-blue-500">رصيد اعتيادي</p>
             <p className="font-bold text-blue-700">{employee.regular_leave_balance}</p>
           </div>
           <div className="bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 text-center">
             <p className="text-[10px] text-orange-500">رصيد عارضة</p>
             <p className="font-bold text-orange-700">{employee.casual_leave_balance}</p>
           </div>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all shadow-sm ${
              activeTab === tab.id 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 min-h-[500px]">
        {activeTab === 'profile' && <EmployeeProfile employee={employee} />}
        {activeTab === 'attendance' && <EmployeeAttendance employeeId={employee.employee_id} />}
        {activeTab === 'movements' && <EmployeeMovementRequest employeeId={employee.employee_id} />}
        {activeTab === 'messages' && <MessageManager role="employee" userId={employee.employee_id} />}
        {activeTab === 'templates' && <TemplateSelector employee={employee} />}
      </div>
    </div>
  );
};

const EmployeeProfile: React.FC<{ employee: any }> = ({ employee }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="space-y-6">
      <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2 text-gray-700">
        <User className="text-green-500" /> المعلومات الشخصية
      </h3>
      <div className="grid grid-cols-2 gap-y-4 text-sm">
        <p className="text-gray-500">الاسم بالكامل:</p><p className="font-bold">{employee.name}</p>
        <p className="text-gray-500">الرقم القومي:</p><p className="font-bold">{employee.national_id}</p>
        <p className="text-gray-500">تاريخ التعيين:</p><p className="font-bold">{employee.start_date}</p>
        <p className="text-gray-500">رقم الهاتف:</p><p className="font-bold">{employee.phone}</p>
        <p className="text-gray-500">العنوان:</p><p className="font-bold">{employee.address}</p>
        <p className="text-gray-500">جهة التخرج:</p><p className="font-bold">{employee.graduation_place}</p>
      </div>
    </div>
    <div className="space-y-6">
      <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2 text-gray-700">
        <LayoutGrid className="text-blue-500" /> المعلومات الوظيفية
      </h3>
      <div className="grid grid-cols-2 gap-y-4 text-sm">
        <p className="text-gray-500">التخصص الحالي:</p><p className="font-bold text-blue-600">{employee.specialty}</p>
        <p className="text-gray-500">الدرجة الوظيفية:</p><p className="font-bold">{employee.job_grade}</p>
        <p className="text-gray-500">رقم القيد بالتأمين:</p><p className="font-bold">{employee.insurance_number}</p>
        <p className="text-gray-500">رقم مزاولة المهنة:</p><p className="font-bold">{employee.practice_number}</p>
        <p className="text-gray-500">حالة العمل:</p><p className="font-bold text-green-600">{employee.status}</p>
      </div>
    </div>
  </div>
);

const EmployeeAttendance: React.FC<{ employeeId: string }> = ({ employeeId }) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('attendance_data').select('*').eq('employee_id', employeeId);
      if (data) setData(data);
    };
    fetch();
  }, [employeeId]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-6">تقرير الحضور الشهري</h3>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">التاريخ</th>
              <th className="p-4">اليوم</th>
              <th className="p-4">الحضور</th>
              <th className="p-4">الانصراف</th>
              <th className="p-4">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {data.map(rec => (
              <tr key={rec.id} className="border-b">
                <td className="p-4">{rec.date}</td>
                <td className="p-4">السبت</td>
                <td className="p-4 font-mono font-bold text-green-600">{rec.fingerprints.split(' ')[0] || '-'}</td>
                <td className="p-4 font-mono font-bold text-orange-600">{rec.fingerprints.split(' ').length > 1 ? rec.fingerprints.split(' ').slice(-1) : '-'}</td>
                <td className="p-4">حضور</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmployeeMovementRequest: React.FC<{ employeeId: string }> = ({ employeeId }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [type, setType] = useState('أجازة اعتيادية');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const submit = async () => {
    const { error } = await supabase.from('movements').insert({
      employee_id: employeeId,
      type,
      start_date: start,
      end_date: end,
      status: 'pending'
    });
    if (!error) {
      alert('تم إرسال الطلب بنجاح');
      setType('أجازة اعتيادية');
      setStart('');
      setEnd('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold mb-4">تقديم طلب جديد</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">نوع الطلب</label>
            <select className="w-full p-2 border rounded-lg" value={type} onChange={(e)=>setType(e.target.value)}>
              <option>أجازة اعتيادية</option>
              <option>أجازة عارضة</option>
              <option>مأمورية عمل</option>
              <option>إذن خروج</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">من تاريخ</label>
            <input type="date" className="w-full p-2 border rounded-lg" value={start} onChange={(e)=>setStart(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">إلى تاريخ</label>
            <input type="date" className="w-full p-2 border rounded-lg" value={end} onChange={(e)=>setEnd(e.target.value)} />
          </div>
          <button onClick={submit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg">إرسال الطلب للمراجعة</button>
        </div>
      </div>
      <div className="lg:col-span-2">
        <h3 className="text-lg font-bold mb-4">الطلبات السابقة</h3>
        <div className="space-y-2">
          <p className="text-center text-gray-400 py-8">لا توجد طلبات سابقة معروضة حالياً</p>
        </div>
      </div>
    </div>
  );
};

const TemplateSelector: React.FC<{ employee: any }> = ({ employee }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <TemplateCard title="بيان حالة وظيفية" />
    <TemplateCard title="طلب أجازة" />
    <TemplateCard title="طلب منحة دراسية" />
    <TemplateCard title="طلب تغيير مسمى" />
  </div>
);

const TemplateCard: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
    <Printer className="text-gray-300 group-hover:text-blue-500 mb-4" size={48} />
    <h4 className="font-bold text-gray-600 group-hover:text-blue-700">{title}</h4>
    <button className="mt-4 text-xs font-bold text-blue-500 underline">معاينة وطباعة</button>
  </div>
);

export default EmployeeDashboard;
