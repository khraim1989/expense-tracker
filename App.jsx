import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Camera, Plus, Trash2, Download, TrendingDown } from 'lucide-react';

export default function ExpenseTracker() {
  const categories = [
    { id: 'restaurants', name: 'مطاعم', color: '#d4a574', icon: '🍽️' },
    { id: 'coffee', name: 'قهوة', color: '#8b6f47', icon: '☕' },
    { id: 'gas', name: 'بنزين', color: '#e74c3c', icon: '⛽' },
    { id: 'home', name: 'مشتريات منزلية', color: '#3498db', icon: '🏠' },
    { id: 'shopping', name: 'تسوق', color: '#9b59b6', icon: '🛍️' },
    { id: 'utilities', name: 'فواتير', color: '#f39c12', icon: '💡' },
    { id: 'transport', name: 'مواصلات', color: '#16a085', icon: '🚗' },
    { id: 'health', name: 'صحة وعافية', color: '#e67e22', icon: '⚕️' },
    { id: 'entertainment', name: 'ترفيه', color: '#2980b9', icon: '🎬' },
    { id: 'other', name: 'آخر', color: '#95a5a6', icon: '📌' }
  ];

  const initialData = [
    {
      id: 1722580680000,
      description: 'قهوة دانكن',
      amount: 11.00,
      category: 'coffee',
      date: '2026-08-02',
      timestamp: '2026-08-02T08:18:00Z'
    },
    {
      id: 1722597900000,
      description: 'طعام Keeta توصيل',
      amount: 70.60,
      category: 'restaurants',
      date: '2026-08-02',
      timestamp: '2026-08-02T16:15:00Z'
    },
    {
      id: 1722612780000,
      description: 'Hungerstation طلب أول',
      amount: 39.30,
      category: 'restaurants',
      date: '2026-08-02',
      timestamp: '2026-08-02T19:33:00Z'
    },
    {
      id: 1722612840000,
      description: 'Hungerstation طلب ثاني',
      amount: 38.30,
      category: 'restaurants',
      date: '2026-08-02',
      timestamp: '2026-08-02T19:34:00Z'
    },
    {
      id: 1722614400000,
      description: 'هدايا',
      amount: 230.00,
      category: 'shopping',
      date: '2026-08-02',
      timestamp: '2026-08-02T20:00:00Z'
    },
    {
      id: 1722614500000,
      description: 'هدية عيد الزواج',
      amount: 3400.00,
      category: 'shopping',
      date: '2026-08-02',
      timestamp: '2026-08-02T20:01:00Z'
    },
    {
      id: 1722614600000,
      description: 'آيسكريم ماكدونالدز',
      amount: 39.00,
      category: 'restaurants',
      date: '2026-08-02',
      timestamp: '2026-08-02T20:02:00Z'
    }
  ];

  const [expenses, setExpenses] = useState(initialData);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().substring(0, 7));

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (description && amount && selectedCategory) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          description,
          amount: parseFloat(amount),
          category: selectedCategory,
          date,
          timestamp: new Date().toISOString()
        }
      ]);
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const filteredExpenses = expenses.filter(e => e.date.substring(0, 7) === filterMonth);
  
  const categoryTotals = categories.map(cat => {
    const total = filteredExpenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.name, value: total, color: cat.color, id: cat.id };
  }).filter(ct => ct.value > 0);

  const dailyTotals = {};
  filteredExpenses.forEach(e => {
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });

  const dailyData = Object.entries(dailyTotals)
    .sort()
    .map(([date, total]) => ({
      date: new Date(date).toLocaleDateString('ar-SA'),
      total: Math.round(total)
    }));

  const monthTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgDaily = dailyData.length > 0 ? Math.round(monthTotal / dailyData.length) : 0;

  const topCategory = categoryTotals.length > 0 
    ? categoryTotals.reduce((max, cat) => cat.value > max.value ? cat : max)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">💰 متابع المصاريف</h1>
          <p className="text-slate-400">تحكم كامل في نفقاتك اليومية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Input Section */}
          <div className="lg:col-span-1 bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Plus className="w-5 h-5 ml-2" /> إضافة مصروف
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-1">الوصف</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                  placeholder="مثال: غداء في مطعم"
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-1">المبلغ (ر.س)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                  placeholder="0.00"
                  step="0.5"
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-1">التصنيف</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-amber-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-1">التاريخ</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={addExpense}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition"
              >
                ✓ إضافة
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-6 text-white shadow-xl">
              <p className="text-sm opacity-90 mb-1">إجمالي المصاريف</p>
              <p className="text-4xl font-bold">{monthTotal.toLocaleString('ar-SA')} <span className="text-lg">ر.س</span></p>
              <p className="text-sm mt-2 opacity-75">الشهر: {new Date(filterMonth).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">متوسط يومي</p>
                <p className="text-2xl font-bold text-white">{avgDaily} ر.س</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">عدد المعاملات</p>
                <p className="text-2xl font-bold text-white">{filteredExpenses.length}</p>
              </div>
            </div>

            {topCategory && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">الفئة الأعلى</p>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topCategory.color }}></div>
                  <span className="text-white font-semibold">{topCategory.name}</span>
                  <span className="text-amber-400 font-bold ml-auto">{topCategory.value} ر.س</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        {categoryTotals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">توزيع المصاريف بالفئات</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryTotals}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {categoryTotals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} ر.س`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">المصاريف بالتصنيف</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={categoryTotals}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <Tooltip 
                    formatter={(value) => `${value} ر.س`}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  />
                  <Bar dataKey="value" fill="#d4a574" radius={[0, 8, 8, 0]}>
                    {categoryTotals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {dailyData.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-xl mb-8">
            <h3 className="text-lg font-bold text-white mb-4">المصاريف اليومية</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  formatter={(value) => `${value} ر.س`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#d4a574" 
                  strokeWidth={2}
                  dot={{ fill: '#d4a574', r: 4 }}
                  name="المبلغ اليومي"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filter and Month Selection */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="font-semibold text-white">اختر الشهر:</label>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            <Download className="w-4 h-4" /> طباعة التقرير
          </button>
        </div>

        {/* Expenses List */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
          <div className="px-6 py-4 bg-slate-700 border-b border-slate-600">
            <h3 className="text-lg font-bold text-white">قائمة المصاريف</h3>
          </div>

          <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
            {filteredExpenses.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                لا توجد مصاريف في هذا الشهر
              </div>
            ) : (
              filteredExpenses
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(expense => {
                  const cat = categories.find(c => c.id === expense.category);
                  return (
                    <div key={expense.id} className="px-6 py-4 hover:bg-slate-700 transition flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-2xl">{cat?.icon}</span>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{expense.description}</p>
                          <p className="text-sm text-slate-400">{cat?.name} • {new Date(expense.date).toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-amber-400">{expense.amount.toLocaleString('ar-SA')} ر.س</span>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            body { background: white; }
            .hidden-print { display: none; }
          }
        `}</style>
      </div>
    </div>
  );
}
