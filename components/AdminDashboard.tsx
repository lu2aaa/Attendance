
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, Settings, Award, Clock, FileText, Send, 
  Search, Plus, FileUp, Download, Check, X, Mail
} from 'lucide-react';
import EmployeeManager from './admin/EmployeeManager';
import EvaluationManager from './admin/EvaluationManager';
import ShiftManager from './admin/ShiftManager';
import AttendanceProcessor from './admin/AttendanceProcessor';
import MovementReview from './admin/MovementReview';
import MessageManager from './admin/MessageManager';

const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('employees');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    const { data } = await supabase.from('admin_settings').select('center_name');
    if (data) setCenters(data);
  };

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('center_name', selectedCenter)
      .eq('secret_code', password)
      .single();

    if (data) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">تسجيل دخول الإدارة</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">اسم المركز</label>
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">اختر المركز</option>
              {centers.map(c => (
                <option key={c.center_name} value={c.center_name}>{c.center_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">الرقم السري</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            دخول النظام
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'الإعدادات العامة', icon: Settings },
    { id: 'employees', label: 'الموظفين', icon: Users },
    { id: 'evaluations', label: 'التقييمات', icon: Award },
    { id: 'shifts', label: 'الجداول والشيفتات', icon: Clock },
    { id: 'attendance', label: 'البصمات والحضور', icon: FileText },
    { id: 'movements', label: 'التحركات', icon: FileUp },
    { id: 'messages', label: 'الرسائل', icon: Send },
    { id: 'reports', label: 'التقارير والإرسال', icon: Mail },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex overflow-x-auto pb-2 gap-2 bg-white p-2 rounded-xl shadow-sm no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 min-h-[600px]">
        {activeTab === 'employees' && <EmployeeManager />}
        {activeTab === 'evaluations' && <EvaluationManager />}
        {activeTab === 'shifts' && <ShiftManager />}
        {activeTab === 'attendance' && <AttendanceProcessor />}
        {activeTab === 'movements' && <MovementReview />}
        {activeTab === 'messages' && <MessageManager role="admin" />}
        {activeTab === 'general' && <GeneralSettings />}
        {activeTab === 'reports' && <ReportsCenter />}
      </div>
    </div>
  );
};

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('general_settings').select('*').single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  if (!settings) return <div>جاري التحميل...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-xl font-bold text-blue-800 mb-4">بيانات الإدارة</h3>
        <p><span className="font-bold">اسم الإدارة:</span> {settings.dept_name}</p>
        <p><span className="font-bold">اسم المركز:</span> {settings.center_name}</p>
        <p><span className="font-bold">تليفون المركز:</span> {settings.center_phone}</p>
        <p><span className="font-bold">الموقع:</span> {settings.center_location}</p>
      </div>
      <div className="space-y-4 bg-purple-50 p-6 rounded-xl border border-purple-100">
        <h3 className="text-xl font-bold text-purple-800 mb-4">التخصصات والشيفتات</h3>
        <p><span className="font-bold">التخصصات:</span> {settings.specialties?.join(', ')}</p>
        <p><span className="font-bold">أنواع التحركات:</span> {settings.movement_types?.join(', ')}</p>
      </div>
    </div>
  );
};

const ReportsCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">مركز التقارير المتطور</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReportCard title="تقرير حضور يومي" description="عرض حالة جميع الموظفين في يوم محدد" />
        <ReportCard title="تقرير حضور شهري" description="تفاصيل كاملة لموظف أو جميع الموظفين خلال الشهر" />
        <ReportCard title="إحصائيات الموظفين" description="معدلات الغياب، الحضور، وساعات العمل" />
        <ReportCard title="إرسال تقارير بريدية" description="إرسال النتائج عبر البريد الإلكتروني للموظفين" />
      </div>
    </div>
  );
};

const ReportCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center group">
    <div>
      <h4 className="font-bold text-gray-700">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <FileText className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

export default AdminDashboard;
