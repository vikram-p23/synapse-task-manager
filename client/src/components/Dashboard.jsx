import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Dashboard = ({ setAuth, theme, toggleTheme }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [user, setUser] = useState({ name: 'User' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setUser({ name: decoded.user.name }); 
          const config = { headers: { 'x-auth-token': token } };
          const res = await axios.get('http://localhost:5000/api/tasks', config);
          setTasks(res.data);
        }
      } catch (err) {
        if(err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            setAuth(false);
            navigate('/login');
        }
      }
    };
    fetchData();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if(!newTask.title) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.post('http://localhost:5000/api/tasks', newTask, config);
      setTasks([res.data, ...tasks]);
      setNewTask({ title: '', description: '', priority: 'medium' }); 
      showToast('Task added successfully', 'success');
    } catch (err) { console.error(err); }
  };

  const toggleStatus = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const updatedStatus = task.status === 'pending' ? 'completed' : 'pending';
      const res = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { status: updatedStatus }, config);
      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
      if(updatedStatus === 'completed') showToast('Task completed', 'success');
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    if(!window.confirm("Delete this task?")) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
      setTasks(tasks.filter(t => t._id !== id));
      showToast('Task removed', 'error');
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/login');
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : task.status === filter;
    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
  
  // --- DARK MODE (CYBERPUNK) ---
  if (theme === 'dark') {
    const avatarUrl = `https://ui-avatars.com/api/?name=${user.name}&background=7c3aed&color=fff&rounded=true&bold=true`;
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-violet-500 selection:text-white">
        {toast.show && <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl border border-slate-700 animate-bounce font-bold ${toast.type === 'success' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-900 text-rose-400'}`}>{toast.message}</div>}
        <nav className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(124,58,237,0.4)]">P</div>
              <h1 className="text-xl font-bold text-white">Synapse <span className="text-violet-500 text-xs tracking-wider">CYBER</span></h1>
          </div>
          <div className="flex items-center gap-4">
              
              {/* DARK MODE TOGGLE (YELLOW BUTTON WITH SUN ICON) */}
              <button onClick={toggleTheme} className="p-2 rounded-full bg-yellow-400 text-slate-900 hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.6)]" title="Switch to Light Mode">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              </button>

              <div className="hidden md:flex items-center gap-3 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                  <img src={avatarUrl} alt="Profile" className="w-7 h-7 rounded-full" />
                  <span className="font-medium text-sm text-slate-200 pr-2">{user.name}</span>
              </div>
              <button onClick={logout} className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Logout</button>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-slate-900/50 p-6 rounded-2xl shadow-xl border border-slate-800 mb-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-cyan-500"></div>
              <div className="flex-1 w-full z-10">
                  <div className="flex justify-between mb-3"><span className="text-xs font-bold text-slate-500 uppercase">System Status</span><span className="text-xs font-bold text-violet-400">{progress}% Optimized</span></div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 shadow-[0_0_10px_rgba(124,58,237,0.5)] transition-all duration-1000" style={{ width: `${progress}%` }}></div></div>
              </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 sticky top-28">
                      <h3 className="text-lg font-bold text-white mb-6">New Entry</h3>
                      <form onSubmit={addTask} className="space-y-4">
                          <input type="text" placeholder="Entry Title" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-white" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                          <div className="grid grid-cols-3 gap-2">{['low', 'medium', 'high'].map(p => (<button type="button" key={p} onClick={() => setNewTask({...newTask, priority: p})} className={`py-2 rounded-lg text-xs font-bold uppercase border ${newTask.priority === p ? 'border-violet-600 bg-violet-600/10 text-violet-400' : 'border-slate-800 bg-slate-900 text-slate-500 hover:bg-slate-800'}`}>{p}</button>))}</div>
                          <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 mt-2">Add Entry</button>
                      </form>
                  </div>
              </div>
              <div className="lg:col-span-8 space-y-4">
                  {filteredTasks.map(task => (
                      <div key={task._id} className={`flex items-start gap-4 bg-slate-900 p-5 rounded-2xl border transition-all ${task.status === 'completed' ? 'opacity-50 border-slate-800' : 'border-slate-800 hover:border-violet-500/50'}`}>
                          <button onClick={() => toggleStatus(task)} className={`mt-1 min-w-[1.5rem] h-6 rounded-md border flex items-center justify-center ${task.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-slate-950 border-slate-700'}`}>{task.status === 'completed' && '✓'}</button>
                          <div className="flex-1">
                              <div className="flex justify-between"><h4 className={`text-lg font-bold ${task.status === 'completed' ? 'line-through text-slate-600' : 'text-slate-200'}`}>{task.title}</h4><button onClick={() => deleteTask(task._id)} className="text-slate-600 hover:text-rose-500">✕</button></div>
                              <div className="flex gap-2 mt-3"><span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">{task.priority}</span></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIGHT MODE (CLEAN AI) ---
  const avatarUrl = `https://ui-avatars.com/api/?name=${user.name}&background=0f172a&color=fff&rounded=true&bold=true`;
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {toast.show && <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-xl border animate-bounce font-semibold text-sm ${toast.type === 'success' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'}`}>{toast.message}</div>}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
            <h1 className="text-xl font-bold text-slate-900">Synapse <span className="text-blue-600 text-xs">AI</span></h1>
        </div>
        <div className="flex items-center gap-4">
            
            {/* 🔴 LIGHT MODE TOGGLE (BLACK BUTTON WITH YELLOW MOON ICON) */}
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-slate-900 text-yellow-300 hover:bg-slate-700 hover:scale-110 shadow-md transition-all" title="Switch to Dark Mode">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
               </svg>
            </button>

            <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <img src={avatarUrl} alt="Profile" className="w-7 h-7 rounded-full" />
                <span className="font-semibold text-sm text-slate-700 pr-2">{user.name}</span>
            </div>
            <button onClick={logout} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Logout</button>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full">
                <div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-400 uppercase">Project Completion</span><span className="text-xs font-bold text-blue-600">{progress}%</span></div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div></div>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-28">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">New Task</h3>
                    <form onSubmit={addTask} className="space-y-4">
                        <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-semibold" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                        <div className="grid grid-cols-3 gap-2">{['low', 'medium', 'high'].map(p => (<button type="button" key={p} onClick={() => setNewTask({...newTask, priority: p})} className={`py-2 rounded-lg text-[10px] font-bold uppercase border ${newTask.priority === p ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-400'}`}>{p}</button>))}</div>
                        <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 mt-2">Add to List</button>
                    </form>
                </div>
            </div>
            <div className="lg:col-span-8 space-y-4">
                {filteredTasks.map(task => (
                    <div key={task._id} className={`flex items-start gap-4 bg-white p-5 rounded-2xl border transition-all ${task.status === 'completed' ? 'bg-slate-50 border-slate-100 opacity-60' : 'border-slate-200 hover:shadow-md'}`}>
                        <button onClick={() => toggleStatus(task)} className={`mt-1 min-w-[1.5rem] h-6 rounded-md border flex items-center justify-center ${task.status === 'completed' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-300 hover:border-blue-500'}`}>{task.status === 'completed' && '✓'}</button>
                        <div className="flex-1">
                            <div className="flex justify-between"><h4 className={`text-base font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</h4><button onClick={() => deleteTask(task._id)} className="text-slate-400 hover:text-rose-500">✕</button></div>
                            <div className="flex gap-2 mt-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${task.priority === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100' : task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{task.priority}</span></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;