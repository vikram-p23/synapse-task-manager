import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setAuth, theme, toggleTheme }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      navigate('/dashboard');
    } catch (err) { alert('Invalid Credentials'); }
  };

  // --- DARK MODE (CYBERPUNK) ---
  if (theme === 'dark') {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a] relative overflow-hidden font-sans text-slate-300">
        {/* DARK MODE TOGGLE BUTTON (Yellow Sun) */}
        <button onClick={toggleTheme} className="absolute top-6 right-6 p-2 rounded-full bg-yellow-400 text-slate-900 hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.6)] z-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </button>
        
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px]"></div>

        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-10 rounded-3xl shadow-2xl w-[28rem] animate-[slideUp_0.8s_ease-out]">
          <div className="text-center mb-8">
            <div className="h-14 w-14 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] mx-auto mb-4">
                {/* BRAND LOGO SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                  <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0zm1.5 0h11.25a6.75 6.75 0 00-11.25 0zm12.75 0a8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-6.75V15.75a.75.75 0 01-.75-.75 8.25 8.25 0 010-1.5z" clipRule="evenodd" />
                </svg>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Synapse</h2>
            <p className="text-violet-400 font-bold tracking-wider text-sm">TERMINAL ACCESS</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <input type="email" placeholder="EMAIL" className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-white" onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="PASSWORD" className="w-full p-4 bg-slate-950/50 border border-slate-700 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-white" onChange={e => setFormData({...formData, password: e.target.value})} />
            <button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg p-4 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all mt-4">INITIALIZE</button>
          </form>
          <p className="mt-8 text-center text-slate-500 text-sm">No key? <Link to="/register" className="text-violet-400 font-bold hover:text-white transition-colors">Generate Identity</Link></p>
        </div>
        <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  // --- LIGHT MODE (DATA SCIENCE) ---
  return (
    <div className="flex justify-center items-center h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-800">
      {/* LIGHT MODE TOGGLE BUTTON (Black Moon) */}
      <button onClick={toggleTheme} className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-900 text-yellow-300 hover:bg-slate-700 hover:scale-110 shadow-lg transition-all z-50">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
         </svg>
      </button>
      
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/50 p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-[28rem] animate-[fadeIn_0.6s_ease-out]">
        <div className="mb-8 text-center">
            <div className="h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mx-auto mb-4">
                {/* BRAND LOGO SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                  <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0zm1.5 0h11.25a6.75 6.75 0 00-11.25 0zm12.75 0a8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-6.75V15.75a.75.75 0 01-.75-.75 8.25 8.25 0 010-1.5z" clipRule="evenodd" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Intelligence Dashboard</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <input type="email" placeholder="name@company.com" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none font-semibold" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="••••••••" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none font-semibold" onChange={e => setFormData({...formData, password: e.target.value})} />
          <button className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-600 hover:shadow-lg transition-all mt-4">Sign In</button>
        </form>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-slate-500 text-sm font-medium">New User? <Link to="/register" className="text-blue-600 font-bold hover:text-blue-800 hover:underline">Create Account</Link></p>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};
export default Login;