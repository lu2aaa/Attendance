
import React from 'react';
import { Copy, Terminal, CheckCircle } from 'lucide-react';

const InstructionsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const sqlCode = `
-- 1. Employees Table
CREATE TABLE employees (
    employee_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    national_id TEXT UNIQUE,
    phone TEXT,
    email TEXT,
    specialty TEXT,
    qualification TEXT,
    start_date DATE,
    working_days TEXT[],
    status TEXT DEFAULT 'على رأس العمل',
    regular_leave_balance INTEGER DEFAULT 21,
    casual_leave_balance INTEGER DEFAULT 7,
    breastfeeding BOOLEAN DEFAULT false,
    disability BOOLEAN DEFAULT false,
    gender TEXT,
    job_grade TEXT,
    training_courses TEXT,
    religion TEXT,
    admin_tasks TEXT,
    secret_code TEXT NOT NULL,
    photo_url TEXT,
    id_card_url TEXT,
    deputations TEXT,
    leaves_history TEXT,
    current_workplace TEXT,
    penalties TEXT,
    emergency_phone TEXT,
    blood_type TEXT,
    insurance_number TEXT,
    practice_number TEXT,
    graduation_place TEXT,
    postgraduate TEXT,
    address TEXT
);

-- 2. Movements Table
CREATE TABLE movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT REFERENCES employees(employee_id),
    type TEXT,
    start_date DATE,
    end_date DATE,
    return_date DATE,
    on_behalf TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT
);

-- 3. Evaluations Table
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT REFERENCES employees(employee_id),
    month TEXT,
    appearance INTEGER,
    attendance INTEGER,
    quality_committees INTEGER,
    infection_control INTEGER,
    training_commitment INTEGER,
    medical_files INTEGER,
    performance INTEGER,
    total INTEGER
);

-- 4. Attendance Data Table
CREATE TABLE attendance_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT REFERENCES employees(employee_id),
    date DATE,
    fingerprints TEXT -- Space separated times
);

-- 5. General Settings Table
CREATE TABLE general_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    dept_name TEXT,
    center_name TEXT,
    center_phone TEXT,
    center_location TEXT,
    center_address TEXT,
    specialties TEXT[],
    movement_types TEXT[],
    shifts JSONB,
    holidays DATE[]
);

-- 6. Admin Settings
CREATE TABLE admin_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    center_name TEXT UNIQUE,
    secret_code TEXT,
    manager_name TEXT,
    manager_phone TEXT,
    manager_email TEXT,
    deputy_1 TEXT,
    deputy_2 TEXT,
    org_structure TEXT,
    dept_heads TEXT,
    specialties TEXT[]
);

-- 7. Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id TEXT,
    receiver_id TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Admin Data
INSERT INTO admin_settings (center_name, secret_code, manager_name) 
VALUES ('مركز الاختبار الرئيسي', '123456', 'مدير عام المركز');

-- Initial Settings
INSERT INTO general_settings (dept_name, center_name, center_phone, specialties) 
VALUES ('وزارة الصحة', 'مركز الاختبار الرئيسي', '0123456789', ARRAY['أطباء بشري', 'تمريض', 'إداريين']);
  `;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    alert('تم نسخ الكود بنجاح');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-4">
          <Terminal className="text-purple-600" size={40} /> تعليمات تهيئة النظام
        </h2>
        
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} /> الخطوة الأولى: تهيئة قاعدة البيانات
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              قم بزيارة Supabase SQL Editor والصق الكود التالي لإنشاء الجداول والبيانات الأساسية.
              تأكد من تفعيل ملحق <code className="bg-gray-100 px-2 py-1 rounded">uuid-ossp</code> في قاعدة البيانات.
            </p>
            <div className="relative group">
              <pre className="bg-gray-900 text-purple-300 p-6 rounded-xl overflow-x-auto text-sm font-mono max-h-[400px]">
                {sqlCode}
              </pre>
              <button 
                onClick={copySql}
                className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-all flex items-center gap-2"
              >
                <Copy size={18} /> نسخ الكود
              </button>
            </div>
          </section>

          <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4">بيانات الدخول الافتراضية للتجربة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-blue-600 mb-2">لوحة الإدارة:</p>
                <p className="text-sm">المركز: <span className="font-mono">مركز الاختبار الرئيسي</span></p>
                <p className="text-sm">الباسورد: <span className="font-mono">123456</span></p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-green-600 mb-2">لوحة الموظف:</p>
                <p className="text-sm">يجب إضافة موظف أولاً من لوحة الإدارة ثم الدخول بالكود والرقم السري الخاص به.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-700 mb-4">رفع ملفات البصمات (إكسيل)</h3>
            <p className="text-gray-600 leading-relaxed">
              عند رفع ملف البصمات، تأكد أن الأعمدة تحتوي على العناوين التالية:
            </p>
            <ul className="list-disc pr-6 mt-2 space-y-1 text-gray-600">
              <li>رقم الموظف</li>
              <li>التاريخ</li>
              <li>توقيتات البصمات (مفصولة بمسافة مثلاً: 08:10 14:05)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
