
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ReferenceArea, AreaChart, Area
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Recycle, Trash2, Truck, AlertTriangle, 
  Activity, MapPin, FileCheck, DollarSign, Globe, ShieldCheck, 
  Leaf, TrendingUp, Users, Factory, AlertOctagon, Search,
  ChevronUp, ChevronDown, Calendar, Filter, Download, Mail, Printer, FileText, X, Check
} from 'lucide-react';

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

// Mock Data
const dataWasteComp = [
  { name: 'Concrete', value: 400 },
  { name: 'Metal', value: 300 },
  { name: 'Wood', value: 300 },
  { name: 'Plastic', value: 200 },
  { name: 'HazMat', value: 50 },
];

const dataDiversion = [
  { name: 'Jan', rate: 65, target: 70 },
  { name: 'Feb', rate: 68, target: 70 },
  { name: 'Mar', rate: 75, target: 75 },
  { name: 'Apr', rate: 72, target: 75 },
  { name: 'May', rate: 80, target: 80 },
  { name: 'Jun', rate: 85, target: 80 },
];

const dataSiteRisk = [
  { name: 'Site Alpha', volume: 850, compliance: 30, risk: 'high' },
  { name: 'Site Beta', volume: 420, compliance: 45, risk: 'high' },
  { name: 'Site Gamma', volume: 150, compliance: 92, risk: 'low' },
  { name: 'Site Delta', volume: 600, compliance: 65, risk: 'med' },
  { name: 'Site Epsilon', volume: 300, compliance: 78, risk: 'med' },
  { name: 'Site Zeta', volume: 900, compliance: 88, risk: 'low' },
  { name: 'Site Eta', volume: 200, compliance: 20, risk: 'high' },
];

const dataESG = [
  { month: 'Q1', carbon: 400, savings: 240 },
  { month: 'Q2', carbon: 300, savings: 390 },
  { month: 'Q3', carbon: 200, savings: 580 },
  { month: 'Q4', carbon: 150, savings: 720 },
];

// --- Shared Components ---

const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass = "bg-white" }: any) => (
  <div className={`${colorClass} p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
    </div>
    {trend && (
      <div className={`flex items-center mt-4 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        <span>{trendValue}</span>
        <span className="text-slate-400 ml-1">vs last period</span>
      </div>
    )}
  </div>
);

// --- Role Views ---

const SiteManagerView = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Operational KPIs */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <KPICard title="Total Waste (Today)" value="12.4 t" icon={Trash2} trend="up" trendValue="12%" />
      <KPICard title="Diversion Rate" value="82.4%" icon={Recycle} trend="up" trendValue="5.2%" />
      <KPICard title="Transport Costs" value="$1.2k" icon={DollarSign} trend="down" trendValue="8%" />
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
         <div>
            <p className="text-sm text-slate-500 font-medium">Compliance Status</p>
            <h3 className="text-xl font-bold text-green-700 mt-1">Compliant</h3>
            <p className="text-xs text-green-600 mt-1">Last audit: 2 days ago</p>
         </div>
         <ShieldCheck className="w-8 h-8 text-green-500" />
      </div>
    </div>

    {/* Quick Actions & Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Quick Actions</h3>
          <div className="space-y-3">
             <button className="w-full py-3 px-4 bg-[#1F7A5B] hover:bg-[#155E46] text-white rounded-lg flex items-center justify-center font-medium transition-colors">
                <Trash2 className="w-4 h-4 mr-2" /> Log New Waste Load
             </button>
             <button className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center font-medium transition-colors">
                <Truck className="w-4 h-4 mr-2" /> Request Pickup
             </button>
             <button className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center font-medium transition-colors">
                <FileCheck className="w-4 h-4 mr-2" /> View Manifests
             </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
             <h4 className="text-xs font-semibold text-slate-500 mb-3">Active Alerts</h4>
             <div className="space-y-2">
                <div className="flex items-start p-3 bg-amber-50 rounded-lg border border-amber-100">
                   <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 mr-2" />
                   <div>
                      <p className="text-xs font-semibold text-amber-800">HazMat Threshold Near</p>
                      <p className="text-[10px] text-amber-600">Site B Asbestos bin is 90% full.</p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Waste Stream Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={dataWasteComp} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#1F7A5B" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
          </div>
       </div>
    </div>
  </div>
);

const TransporterView = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <KPICard title="Active Pickups" value="8" icon={Truck} colorClass="bg-blue-50 border-blue-100" />
      <KPICard title="On-Time Rate" value="94%" icon={Activity} trend="up" trendValue="2%" />
      <KPICard title="Manifests (Pending)" value="3" icon={FileCheck} trend="down" trendValue="1" />
      <KPICard title="Fleet Utilization" value="88%" icon={Factory} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
       <div className="lg:col-span-2 bg-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-300">
          {/* Mock Map */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/San_Francisco_OpenStreetMap.png')] bg-cover bg-center"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="bg-white p-3 rounded-full shadow-lg mb-2 animate-bounce">
                <MapPin className="w-6 h-6 text-[#1F7A5B]" />
             </div>
             <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow">Unit 402 • En Route</span>
          </div>
       </div>
       
       <div className="bg-white p-0 rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h3 className="font-semibold text-slate-800">Job Queue</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
             {[1,2,3,4].map(i => (
               <div key={i} className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer group">
                  <div className="flex justify-between mb-1">
                     <span className="text-sm font-medium text-slate-900">Site Alpha • Load #{2020+i}</span>
                     <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Assigned</span>
                  </div>
                  <p className="text-xs text-slate-500">Concrete • 12 Tons • Dest: Recycler A</p>
                  <button className="mt-2 w-full py-1 text-xs border border-slate-300 rounded text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">Start Job</button>
               </div>
             ))}
          </div>
       </div>
    </div>
  </div>
);

const RecyclerView = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-end">
       <div>
         <h2 className="text-2xl font-bold text-slate-800">Facility Operations</h2>
         <p className="text-slate-500">Material Recovery Center #4</p>
       </div>
       <button className="bg-[#1F7A5B] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
         <Recycle className="w-4 h-4 mr-2" /> Process Batch
       </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Daily Intake</p>
          <div className="flex items-end space-x-2 mt-1">
             <h3 className="text-3xl font-bold text-slate-900">145t</h3>
             <span className="text-sm text-green-600 mb-1">↑ 15%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
             <div className="bg-slate-900 h-1.5 rounded-full" style={{width: '65%'}}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">65% Capacity</p>
       </div>
       <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Recovery Yield</p>
          <div className="flex items-end space-x-2 mt-1">
             <h3 className="text-3xl font-bold text-[#D4AF37]">92.4%</h3>
             <span className="text-sm text-green-600 mb-1">↑ 1.2%</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Quality Score: A+</p>
       </div>
       <div className="bg-white p-6 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Residue (Landfill)</p>
          <div className="flex items-end space-x-2 mt-1">
             <h3 className="text-3xl font-bold text-slate-900">11t</h3>
             <span className="text-sm text-green-600 mb-1">↓ 5%</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Below threshold</p>
       </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
       <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-800">Incoming Batches</h3>
          <Search className="w-4 h-4 text-slate-400" />
       </div>
       <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 font-medium border-b border-slate-200">
             <tr>
                <th className="px-6 py-3">Batch ID</th>
                <th className="px-6 py-3">Source Project</th>
                <th className="px-6 py-3">Material Stream</th>
                <th className="px-6 py-3">Contamination</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {[1,2,3].map(i => (
                <tr key={i} className="hover:bg-slate-50">
                   <td className="px-6 py-4 font-mono text-slate-600">BATCH-2023-{i}09</td>
                   <td className="px-6 py-4">Skyline Tower</td>
                   <td className="px-6 py-4">Mixed Construction</td>
                   <td className="px-6 py-4 text-green-600">Low (2%)</td>
                   <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Processing</span></td>
                   <td className="px-6 py-4 text-blue-600 font-medium cursor-pointer">Grade</td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  </div>
);

const ExecutiveView = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <KPICard title="Portfolio Diversion" value="84%" icon={Globe} trend="up" trendValue="3.5%" colorClass="bg-slate-900 text-white border-slate-800" />
      <KPICard title="ESG Index Score" value="92/100" icon={Leaf} trend="up" trendValue="1 pt" />
      <KPICard title="Compliance Risk" value="Low" icon={ShieldCheck} />
      <KPICard title="Cost Savings" value="$245k" icon={DollarSign} trend="up" trendValue="12%" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-6">Financial & Carbon Impact</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataESG}>
                   <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#12B76A" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#12B76A" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#2FA4FF" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#2FA4FF" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="month" />
                   <YAxis yAxisId="left" />
                   <YAxis yAxisId="right" orientation="right" />
                   <Tooltip />
                   <Area yAxisId="left" type="monotone" dataKey="savings" stroke="#12B76A" fillOpacity={1} fill="url(#colorSavings)" name="Savings ($)" />
                   <Area yAxisId="right" type="monotone" dataKey="carbon" stroke="#2FA4FF" fillOpacity={1} fill="url(#colorCarbon)" name="Carbon (tCO2)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">SDG Alignment</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 border border-slate-100 rounded-lg flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm">11</div>
                <div>
                   <p className="text-sm font-bold text-slate-800">Sustainable Cities</p>
                   <p className="text-xs text-slate-500">Target: 90% Diversion</p>
                </div>
             </div>
             <div className="p-4 border border-slate-100 rounded-lg flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-500 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm">12</div>
                <div>
                   <p className="text-sm font-bold text-slate-800">Consumption</p>
                   <p className="text-xs text-slate-500">Recycled: 15,000t</p>
                </div>
             </div>
             <div className="p-4 border border-slate-100 rounded-lg flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm">13</div>
                <div>
                   <p className="text-sm font-bold text-slate-800">Climate Action</p>
                   <p className="text-xs text-slate-500">-450 tCO2e</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
);

const RegulatorView = () => (
   <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 text-white p-6 rounded-xl flex justify-between items-center shadow-md">
         <div>
            <h2 className="text-xl font-bold">City Governance Dashboard</h2>
            <p className="text-slate-400 text-sm">Jurisdiction: Metro Area 1 • Code: EN-2024</p>
         </div>
         <div className="flex space-x-4">
             <div className="text-center">
                <p className="text-2xl font-bold">142</p>
                <p className="text-xs text-slate-400">Active Permits</p>
             </div>
             <div className="text-center">
                <p className="text-2xl font-bold text-red-400">3</p>
                <p className="text-xs text-slate-400">Critical Violations</p>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
               <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" /> Compliance Risk Heatmap
            </h3>
            <p className="text-xs text-slate-500 mb-4">Correlation of Waste Volume vs Compliance Score</p>
            <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis type="number" dataKey="volume" name="Volume" unit="t" />
                     <YAxis type="number" dataKey="compliance" name="Score" unit="%" />
                     <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                     <ReferenceArea y1={0} y2={50} fill="#fee2e2" fillOpacity={0.4} />
                     <ReferenceArea y1={50} y2={80} fill="#fef3c7" fillOpacity={0.3} />
                     <Scatter name="Sites" data={dataSiteRisk} fill="#8884d8">
                        {dataSiteRisk.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.risk === 'high' ? '#ef4444' : entry.risk === 'med' ? '#f59e0b' : '#22c55e'} />
                        ))}
                     </Scatter>
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-0 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
               <h3 className="text-red-800 font-semibold text-sm">Enforcement Alerts</h3>
               <AlertOctagon className="w-4 h-4 text-red-600" />
            </div>
            <div className="divide-y divide-slate-100">
               <div className="p-4">
                  <p className="text-sm font-medium text-slate-800">Illegal Dumping Flag</p>
                  <p className="text-xs text-slate-500 mt-1">Site Beta reported 5t waste missing from manifest.</p>
                  <button className="mt-2 text-xs text-red-600 font-bold uppercase tracking-wide">Investigate</button>
               </div>
               <div className="p-4">
                  <p className="text-sm font-medium text-slate-800">Permit Expired</p>
                  <p className="text-xs text-slate-500 mt-1">Project Delta operation continues without renewal.</p>
                  <button className="mt-2 text-xs text-red-600 font-bold uppercase tracking-wide">Issue Fine</button>
               </div>
            </div>
         </div>
      </div>
   </div>
);

// Mock Data for Investor View
const MOCK_AUDIT_LOGS = [
   { id: 'TX-0982', action: 'Site Alpha waste logged', user: 'John Doe', role: 'Manager', timestamp: '2023-10-26T10:00:00', status: 'Verified' },
   { id: 'TX-0981', action: 'Manifest #209 signed', user: 'Jane Smith', role: 'Transporter', timestamp: '2023-10-26T08:30:00', status: 'Verified' },
   { id: 'TX-0980', action: 'Compliance Report Gen', user: 'System', role: 'System', timestamp: '2023-10-25T14:15:00', status: 'Verified' },
   { id: 'TX-0979', action: 'HazMat Alert Acknowledged', user: 'Mike Ross', role: 'Manager', timestamp: '2023-10-25T09:45:00', status: 'Pending' },
   { id: 'TX-0978', action: 'Permit Renewal', user: 'Sarah Lee', role: 'Regulator', timestamp: '2023-10-24T16:20:00', status: 'Verified' },
   { id: 'TX-0977', action: 'Diversion Target Update', user: 'Exec Team', role: 'Executive', timestamp: '2023-10-24T09:00:00', status: 'Verified' },
 ];

const InvestorView = () => {
   const [logs] = useState(MOCK_AUDIT_LOGS);
   const [filterRole, setFilterRole] = useState('All');
   const [searchAction, setSearchAction] = useState('');
   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');
   const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({ key: 'timestamp', direction: 'desc' });
   
   // UI States for Export/Email
   const [showEmailModal, setShowEmailModal] = useState(false);
   const [email, setEmail] = useState('');
   const [emailSent, setEmailSent] = useState(false);
 
   // Filtering Logic
   const filteredLogs = logs.filter(log => {
     const matchesRole = filterRole === 'All' || log.role === filterRole;
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
      // Simulate API call
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
    
         <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-8">Material Traceability Chain</h3>
            <div className="relative flex items-center justify-between">
               {/* Line */}
               <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
               
               {/* Steps */}
               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center border-4 border-white shadow-sm mb-2">
                     <Factory className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Generation</p>
                  <p className="text-[10px] text-slate-400">Verified IoT</p>
               </div>
               
               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center border-4 border-white shadow-sm mb-2">
                     <Truck className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Transport</p>
                  <p className="text-[10px] text-slate-400">GPS Tracked</p>
               </div>
    
               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center border-4 border-white shadow-sm mb-2">
                     <Recycle className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Recovery</p>
                  <p className="text-[10px] text-slate-400">Certified Facility</p>
               </div>
    
               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center border-4 border-white shadow-sm mb-2">
                     <DollarSign className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Market</p>
                  <p className="text-[10px] text-slate-400">Sold as Secondary</p>
               </div>
            </div>
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
                       {sortedLogs.map(log => (
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
               {sortedLogs.length === 0 && (
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
