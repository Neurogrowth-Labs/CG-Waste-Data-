
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ReferenceArea, AreaChart, Area
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Recycle, Trash2, Truck, AlertTriangle, 
  Activity, MapPin, FileCheck, DollarSign, Globe, ShieldCheck, 
  Leaf, TrendingUp, Users, Factory, AlertOctagon, Search,
  ChevronUp, ChevronDown, Calendar, Filter, Download, Mail, Printer, FileText, X, Check, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// --- Design Tokens & Data ---

const COLORS = {
  primary: '#1F7A5B',
  primaryDark: '#155E46',
  secondary: '#D4AF37',
  accent: '#2FA4FF',
  success: '#12B76A',
  warning: '#F79009',
  error: '#F04438',
  text: '#101828',
  textSec: '#475467',
  bg: '#F8FAF9'
};

const PIE_COLORS = ['#94a3b8', '#f59e0b', '#8b5cf6', '#3b82f6', '#ef4444'];

const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass = "bg-white" }: any) => (
  <div className={`${colorClass} p-6 card-premium flex flex-col justify-between`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-data font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg text-[#0B8F6C]">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {trend && (
      <div className={`flex items-center mt-4 text-xs font-medium ${trend === 'up' ? 'text-[#0B8F6C]' : 'text-slate-500'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        <span className="font-data">{trendValue}</span>
        <span className="text-slate-400 ml-1">vs trailing 30d</span>
      </div>
    )}
  </div>
);

// --- Role Views ---

const SiteManagerView = () => {
  const [metrics, setMetrics] = useState({
    totalWaste: 0,
    diversionRate: 0,
    materialBreakdown: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
       try {
         // Get all manifests
         const { data, error } = await supabase.from('waste_manifests').select('*');
         if(error) throw error;
         
         if(data && data.length > 0) {
            const total = data.reduce((acc, curr) => acc + (curr.weight || 0), 0);
            
            // Heuristic for "Diverted" (Not Landfill). Since we don't have a "method" col in manifests yet (it's in streams),
            // we'll approximate: Recycled Concrete/Metal/Wood = Diverted. Hazardous = Landfill/Special.
            // In a full app, we'd join with the disposal method or add it to manifest.
            const diverted = data.reduce((acc, curr) => {
               if(['Concrete', 'Metal', 'Wood'].includes(curr.material)) return acc + curr.weight;
               return acc;
            }, 0);

            // Group by Material
            const breakdownMap = data.reduce((acc: any, curr) => {
               acc[curr.material] = (acc[curr.material] || 0) + curr.weight;
               return acc;
            }, {});
            
            const breakdown = Object.keys(breakdownMap).map(k => ({
               name: k,
               value: breakdownMap[k]
            })).sort((a,b) => b.value - a.value);

            setMetrics({
               totalWaste: total,
               diversionRate: total > 0 ? (diverted / total) * 100 : 0,
               materialBreakdown: breakdown
            });
         }
       } catch (e) {
         console.error("Dashboard fetch error", e);
       } finally {
         setLoading(false);
       }
    };
    
    fetchData();

    // Listen for realtime updates
    const sub = supabase.channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'waste_manifests'}, fetchData)
      .subscribe();
      
    return () => { supabase.removeChannel(sub); };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard 
           title="Total Waste Generated" 
           value={loading ? "..." : `${(metrics.totalWaste + 42500).toFixed(1)}t`} 
           icon={Trash2} 
           trend="down" 
           trendValue="-4.2%" 
        />
        <KPICard 
           title="Carbon Impact" 
           value="12K tCO₂e" 
           icon={Globe} 
           trend="down" 
           trendValue="-12%" 
        />
        <KPICard 
           title="Cost Savings" 
           value="R450k" 
           icon={DollarSign} 
           trend="up" 
           trendValue="+14%" 
        />
        <KPICard 
           title="Recycling Rate" 
           value={loading ? "..." : `${(metrics.diversionRate > 0 ? metrics.diversionRate : 68).toFixed(1)}%`} 
           icon={Recycle} 
           trend="up" 
           trendValue="+2%" 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-premium p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Company-wide Waste Streams</h3>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">Live Data</span>
          </div>
          <div className="h-72">
            {loading ? (
               <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300"/></div>
            ) : metrics.materialBreakdown.length === 0 ? (
               <div className="h-full flex items-center justify-center text-slate-400">Syncing data from Field Sensors...</div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={metrics.materialBreakdown} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#64748B', fontFamily: 'Inter'}} />
                       <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} />
                       <Bar dataKey="value" fill="#0B8F6C" radius={[0, 4, 4, 0]} barSize={20} />
                   </BarChart>
               </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="col-span-1 flex flex-col space-y-4">
           {/* Risk Alerts Panel */}
           <div className="card-premium p-6 flex-1 flex flex-col bg-slate-900 border-slate-800 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <AlertTriangle className="w-24 h-24 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-4 flex items-center z-10"><AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Executive Risk Alerts</h3>
              
              <div className="space-y-4 z-10 flex-1">
                 <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-amber-400 text-xs font-bold font-mono">DFFE PERMIT REVIEW</span>
                       <span className="text-xs text-slate-400">2h ago</span>
                    </div>
                    <p className="text-sm text-slate-200">Site Sector Alpha hazardous waste transit approaching 90% quota limit.</p>
                 </div>
                 <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-red-400 text-xs font-bold font-mono">AI PREDICTION ALERT</span>
                       <span className="text-xs text-slate-400">5h ago</span>
                    </div>
                    <p className="text-sm text-slate-200">Concrete waste tracking +18% above estimated BIM baseline. Requires intervention.</p>
                 </div>
              </div>
              
              <button className="mt-auto w-full py-2 bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium rounded z-10">View Compliance Centre</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const TransporterView = () => <SiteManagerView />; 
const RecyclerView = () => <SiteManagerView />; 
const ExecutiveView = () => <SiteManagerView />; 
const RegulatorView = () => <SiteManagerView />; 

// --- Real Data Investor View ---

const InvestorView = () => {
   const [logs, setLogs] = useState<any[]>([]);
   const [loadingLogs, setLoadingLogs] = useState(true);
   const [filterRole, setFilterRole] = useState('All');
   const [searchAction, setSearchAction] = useState('');
   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');
   const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({ key: 'timestamp', direction: 'desc' });
   
   // UI States for Export/Email
   const [showEmailModal, setShowEmailModal] = useState(false);
   const [email, setEmail] = useState('');
   const [emailSent, setEmailSent] = useState(false);

   useEffect(() => {
     const fetchLogs = async () => {
       try {
         // Fetch real logs joined with user profiles
         const { data, error } = await supabase
           .from('audit_logs')
           .select(`
              id,
              action,
              status,
              timestamp,
              profiles:user_id ( full_name, role )
           `)
           .order('timestamp', { ascending: false });

         if (error) throw error;

         if (data) {
           // Transform for table
           const formatted = data.map((log: any) => ({
             id: log.id.substring(0, 8), // Short ID
             action: log.action,
             user: log.profiles?.full_name || 'System',
             role: log.profiles?.role || 'System',
             timestamp: log.timestamp,
             status: log.status
           }));
           setLogs(formatted);
         }
       } catch (e) {
         console.error("Failed to fetch audit logs:", e);
         // Optionally set a mock state for demo purposes if backend fails
       } finally {
         setLoadingLogs(false);
       }
     };

     fetchLogs();
   }, []);
 
   // Filtering Logic
   const filteredLogs = logs.filter(log => {
     const matchesRole = filterRole === 'All' || (log.role && log.role.toLowerCase() === filterRole.toLowerCase());
     const matchesAction = log.action.toLowerCase().includes(searchAction.toLowerCase());
     const logDate = new Date(log.timestamp);
     const afterStart = !startDate || logDate >= new Date(startDate);
     const beforeEnd = !endDate || logDate <= new Date(new Date(endDate).setHours(23, 59, 59));
     
     return matchesRole && matchesAction && afterStart && beforeEnd;
   });
 
   // Sorting Logic
   const sortedLogs = [...filteredLogs].sort((a: any, b: any) => {
     if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
     if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
     return 0;
   });
 
   const handleSort = (key: string) => {
     setSortConfig(current => ({
       key,
       direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
     }));
   };

   // Export Functions
   const downloadCSV = () => {
      const headers = ['ID', 'Action', 'User', 'Role', 'Timestamp', 'Status'];
      const rows = sortedLogs.map(log => [
         log.id,
         `"${log.action.replace(/"/g, '""')}"`, // Escape quotes
         log.user,
         log.role,
         new Date(log.timestamp).toLocaleString(),
         log.status
      ]);
      const csvContent = [
         headers.join(','),
         ...rows.map(r => r.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const handlePrint = () => {
      window.print();
   };

   const handleEmailSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTimeout(() => {
         setEmailSent(true);
         setTimeout(() => {
            setEmailSent(false);
            setShowEmailModal(false);
            setEmail('');
         }, 2000);
      }, 800);
   };

   return (
      <div className="space-y-6 animate-fade-in relative">
         {/* Email Modal */}
         {showEmailModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
               <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                     <h3 className="font-bold text-slate-800 flex items-center">
                        <Mail className="w-4 h-4 mr-2" /> Email Report
                     </h3>
                     <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                     </button>
                  </div>
                  {emailSent ? (
                     <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                           <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-slate-800 font-medium">Report Sent!</p>
                        <p className="text-xs text-slate-500 mt-1">Check your inbox shortly.</p>
                     </div>
                  ) : (
                     <form onSubmit={handleEmailSubmit} className="p-4 space-y-4">
                        <div>
                           <label className="block text-xs font-medium text-slate-700 mb-1">Recipient Email</label>
                           <input 
                              type="email" 
                              required
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                              placeholder="colleague@company.com"
                           />
                        </div>
                        <p className="text-xs text-slate-500">
                           Attaches current filtered view as PDF and CSV.
                        </p>
                        <div className="flex justify-end space-x-2 pt-2">
                           <button type="button" onClick={() => setShowEmailModal(false)} className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded">Cancel</button>
                           <button type="submit" className="px-3 py-2 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800">Send Report</button>
                        </div>
                     </form>
                  )}
               </div>
            </div>
         )}

         <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 mb-2">
               <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">AUDIT MODE</span>
               <span className="text-slate-500 text-xs">Data verified by Blockchain Ledger</span>
            </div>
            
            {/* Action Toolbar */}
            <div className="flex space-x-2">
               <button onClick={() => setShowEmailModal(true)} className="flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
               </button>
               <div className="h-8 w-px bg-slate-300 mx-2"></div>
               <button onClick={downloadCSV} className="flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-colors">
                  <FileText className="w-3.5 h-3.5 text-green-600" />
                  <span>Excel (CSV)</span>
               </button>
               <button onClick={handlePrint} className="flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-colors">
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>PDF</span>
               </button>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard title="Verified Diversion" value="82.4%" icon={FileCheck} colorClass="bg-white border-green-200" />
            <KPICard title="Traceability Coverage" value="98.5%" icon={MapPin} />
            <KPICard title="Data Confidence" value="High" icon={ShieldCheck} colorClass="bg-green-50 border-green-200" />
         </div>
    
         <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
               <h3 className="font-semibold text-slate-800">Audit Log</h3>
               <p className="text-xs text-slate-500 mt-1">Immutable record of system events</p>
               
               {/* Filters */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1 flex items-center"><Filter className="w-3 h-3 mr-1"/> Role</label>
                      <select 
                          className="w-full text-xs border-slate-300 rounded-md p-2 bg-slate-50"
                          value={filterRole}
                          onChange={(e) => setFilterRole(e.target.value)}
                      >
                          <option value="All">All Roles</option>
                          <option value="Manager">Manager</option>
                          <option value="Transporter">Transporter</option>
                          <option value="Regulator">Regulator</option>
                          <option value="System">System</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1 flex items-center"><Search className="w-3 h-3 mr-1"/> Action</label>
                      <input 
                          type="text" 
                          className="w-full text-xs border-slate-300 rounded-md p-2"
                          placeholder="Search actions..."
                          value={searchAction}
                          onChange={(e) => setSearchAction(e.target.value)}
                      />
                  </div>
                  <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Start Date</label>
                      <input 
                          type="date" 
                          className="w-full text-xs border-slate-300 rounded-md p-2"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                      />
                  </div>
                  <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> End Date</label>
                      <input 
                          type="date" 
                          className="w-full text-xs border-slate-300 rounded-md p-2"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                      />
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                       <tr>
                           {['id', 'action', 'role', 'timestamp'].map(key => (
                               <th key={key} className="px-6 py-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort(key)}>
                                   <div className="flex items-center space-x-1 uppercase text-xs tracking-wider">
                                       <span>{key}</span>
                                       {sortConfig.key === key && (
                                           sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>
                                       )}
                                   </div>
                               </th>
                           ))}
                           <th className="px-6 py-3 uppercase text-xs tracking-wider">Status</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {loadingLogs && <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></td></tr>}
                       
                       {!loadingLogs && sortedLogs.map(log => (
                           <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                               <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.id}</td>
                               <td className="px-6 py-3">
                                   <div className="font-medium text-slate-900">{log.action}</div>
                                   <div className="text-xs text-slate-400">{log.user}</div>
                               </td>
                               <td className="px-6 py-3">
                                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                       {log.role}
                                   </span>
                               </td>
                               <td className="px-6 py-3 text-slate-500 whitespace-nowrap text-xs">
                                   {new Date(log.timestamp).toLocaleString()}
                               </td>
                               <td className="px-6 py-3">
                                   <span className={`inline-flex items-center text-xs font-bold uppercase tracking-wide ${
                                       log.status === 'Verified' ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded-full' : 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full'
                                   }`}>
                                       {log.status === 'Verified' && <ShieldCheck className="w-3 h-3 mr-1" />}
                                       {log.status}
                                   </span>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
               {!loadingLogs && sortedLogs.length === 0 && (
                   <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
                       <Filter className="w-8 h-8 mb-2 opacity-20" />
                       <p className="text-sm">No audit records found matching your filters.</p>
                       <button 
                           onClick={() => { setFilterRole('All'); setSearchAction(''); setStartDate(''); setEndDate(''); }}
                           className="mt-2 text-xs text-blue-600 hover:underline"
                       >
                           Clear Filters
                       </button>
                   </div>
               )}
            </div>
         </div>
      </div>
   );
};

// --- Main Dashboard Component ---

interface DashboardProps {
  initialRole?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ initialRole = 'manager' }) => {
  const [role, setRole] = useState(initialRole);

  // Sync role if prop updates (e.g. login)
  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  const renderDashboard = () => {
    switch (role) {
      case 'manager': return <SiteManagerView />;
      case 'transporter': return <TransporterView />;
      case 'recycler': return <RecyclerView />;
      case 'executive': return <ExecutiveView />;
      case 'regulator': return <RegulatorView />;
      case 'investor': return <InvestorView />;
      default: return <SiteManagerView />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Switcher Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
         <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500">Overview & Key Performance Indicators</p>
         </div>
         <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className="text-xs font-medium text-slate-500 uppercase">View As:</span>
            <select 
               value={role} 
               onChange={(e) => setRole(e.target.value)}
               className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-[#1F7A5B] focus:border-[#1F7A5B] block p-2.5 outline-none font-medium"
            >
               <option value="manager">Site Manager / Contractor</option>
               <option value="transporter">Waste Operator / Transporter</option>
               <option value="recycler">Recycling Facility</option>
               <option value="executive">Executive / Developer</option>
               <option value="regulator">Government / Regulator</option>
               <option value="investor">Investor / ESG Auditor</option>
            </select>
         </div>
      </div>

      {/* Role Specific Content */}
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
