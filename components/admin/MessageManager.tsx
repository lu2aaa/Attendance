
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, User, Clock, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const MessageManager: React.FC<{ role: 'admin' | 'employee'; userId?: string }> = ({ role, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipient, setRecipient] = useState('');
  const [text, setText] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages();
    if (role === 'admin') fetchEmployees();
  }, [userId]);

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('employee_id, name');
    if (data) setEmployees(data);
  };

  const fetchMessages = async () => {
    let query = supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (role === 'employee' && userId) {
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    }
    const { data } = await query;
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    const payload = {
      sender_id: role === 'admin' ? 'ADMIN' : userId,
      receiver_id: role === 'admin' ? recipient : 'ADMIN',
      content: text,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('messages').insert(payload);
    if (!error) {
      setText('');
      fetchMessages();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full max-h-[600px]">
      <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-lg mb-4">إرسال رسالة جديدة</h3>
        <div className="space-y-4">
          {role === 'admin' && (
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">إلى الموظف</label>
              <select className="w-full p-2 border rounded-lg" value={recipient} onChange={(e)=>setRecipient(e.target.value)}>
                <option value="">اختر الموظف</option>
                <option value="ALL">جميع الموظفين</option>
                {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">نص الرسالة</label>
            <textarea 
              className="w-full p-3 border rounded-lg h-32 resize-none outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="اكتب رسالتك هنا..."
              value={text}
              onChange={(e)=>setText(e.target.value)}
            />
          </div>
          <button 
            onClick={sendMessage}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Send size={18} /> إرسال الرسالة
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="font-bold text-lg sticky top-0 bg-white py-2">صندوق الوارد والرسائل السابقة</h3>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <CheckCircle2 size={48} className="mb-4 opacity-20" />
            <p>لا توجد رسائل حالياً</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`p-4 rounded-xl border ${msg.sender_id === (userId || 'ADMIN') ? 'bg-blue-50 border-blue-100 mr-8' : 'bg-white border-gray-100 ml-8 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <User size={14} className="text-gray-400" />
                  {msg.sender_id === 'ADMIN' ? 'الإدارة' : `موظف كود: ${msg.sender_id}`}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock size={12} />
                  {new Date(msg.created_at).toLocaleString('ar-EG')}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageManager;
