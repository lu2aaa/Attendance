
import React, { useState } from 'react';
import { Layout, Shield, User, Info, LogOut } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import InstructionsPage from './components/InstructionsPage';

type ViewState = 'HOME' | 'ADMIN' | 'EMPLOYEE' | 'INSTRUCTIONS';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');

  const renderContent = () => {
    switch (view) {
      case 'ADMIN':
        return <AdminDashboard onBack={() => setView('HOME')} />;
      case 'EMPLOYEE':
        return <EmployeeDashboard onBack={() => setView('HOME')} />;
      case 'INSTRUCTIONS':
        return <InstructionsPage onBack={() => setView('HOME')} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">نظام الموارد البشرية المتكامل</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              <button
                onClick={() => setView('ADMIN')}
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border-b-4 border-blue-600 group"
              >
                <Shield size={64} className="text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-gray-700">صفحة الإدارة</span>
                <p className="text-gray-500 mt-2 text-center">إدارة الموظفين، التقييمات، والجداول</p>
              </button>

              <button
                onClick={() => setView('EMPLOYEE')}
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border-b-4 border-green-600 group"
              >
                <User size={64} className="text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-gray-700">صفحة الموظف</span>
                <p className="text-gray-500 mt-2 text-center">عرض التقارير، الحضور، وتقديم الطلبات</p>
              </button>

              <button
                onClick={() => setView('INSTRUCTIONS')}
                className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border-b-4 border-purple-600 group"
              >
                <Info size={64} className="text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-gray-700">التعليمات</span>
                <p className="text-gray-500 mt-2 text-center">أكواد SQL ودليل التشغيل</p>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Layout className="text-blue-600" />
          <span className="text-xl font-bold text-gray-800">HR Connect Pro</span>
        </div>
        {view !== 'HOME' && (
          <button
            onClick={() => setView('HOME')}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-semibold"
          >
            <LogOut size={20} />
            العودة للرئيسية
          </button>
        )}
      </header>
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
