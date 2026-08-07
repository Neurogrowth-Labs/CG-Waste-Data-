import React, { useState, useMemo } from 'react';
import {
  FileText, Download, Play, Calendar, Filter, RefreshCw, Layers, CheckCircle2,
  AlertCircle, ChevronRight, Settings, Code, Sparkles, PieChart as PieChartIcon,
  BarChart3, Activity, Clock, ShieldCheck, Mail, Send, Copy, Database, ArrowUpRight,
  Table, FileSpreadsheet, FileCode, Printer, HelpCircle, Lock, Eye
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { User } from '../types';

interface ReportingEngineProps {
  user?: User;
}

// Sample Data Models for BI & Carbone Rendering
const SAMPLE_PROJECT_DATA = [
  { project: 'Office Complex Alpha', concrete: 65, steel: 20, timber: 15, hazardous: 2, total: 102, diversionRate: 92.5, carbonAvoided: 18.4, status: 'Active', region: 'Gauteng' },
  { project: 'Eko Atlantic Tower', concrete: 140, steel: 45, timber: 30, hazardous: 5, total: 220, diversionRate: 88.0, carbonAvoided: 42.1, status: 'Active', region: 'Lagos' },
  { project: 'Claridge Demolition', concrete: 210, steel: 80, timber: 25, hazardous: 12, total: 327, diversionRate: 95.2, carbonAvoided: 61.8, status: 'Completed', region: 'Western Cape' },
  { project: 'Sandton Gateway Phase II', concrete: 85, steel: 32, timber: 18, hazardous: 0, total: 135, diversionRate: 91.0, carbonAvoided: 24.6, status: 'Active', region: 'Gauteng' }
];

const DETAIL_MANIFEST_LOGS = [
  { id: 'MNF-2026-0811', project: 'Office Complex Alpha', material: 'Concrete & Aggregates', weight: 14.2, hauler: 'Apex Heavy Haulage', license: 'HL-8829-GP', facility: 'RecyclePro Yard 3', date: '2026-07-26', status: 'Verified' },
  { id: 'MNF-2026-0812', project: 'Office Complex Alpha', material: 'Structural Steel', weight: 6.8, hauler: 'Gauteng Metals Trans', license: 'HL-4412-GP', facility: 'EcoSmelt Scrap Terminal', date: '2026-07-26', status: 'Verified' },
  { id: 'MNF-2026-0813', project: 'Eko Atlantic Tower', material: 'Concrete & Aggregates', weight: 28.5, hauler: 'Atlantic Logistics', license: 'LA-9912-KS', facility: 'CrushTech Processing', date: '2026-07-25', status: 'Verified' },
  { id: 'MNF-2026-0814', project: 'Claridge Demolition', material: 'Hazardous Asbestos', weight: 3.1, hauler: 'HazMat Shield Corp', license: 'HZ-0012-WC', facility: 'Encapsulation Site B', date: '2026-07-24', status: 'Audited' },
  { id: 'MNF-2026-0815', project: 'Claridge Demolition', material: 'Timber & Pallets', weight: 8.4, hauler: 'Cape BioMass Carriers', license: 'CA-3301-WC', facility: 'WoodRecycle Milling', date: '2026-07-24', status: 'Verified' },
  { id: 'MNF-2026-0816', project: 'Sandton Gateway Phase II', material: 'Structural Steel', weight: 12.0, hauler: 'Apex Heavy Haulage', license: 'HL-8829-GP', facility: 'EcoSmelt Scrap Terminal', date: '2026-07-23', status: 'Verified' },
];

const DEFAULT_CARBONE_TEMPLATE_JSON = {
  report_metadata: {
    title: "National Environmental Management Waste Audit Report",
    document_id: "CG-NEMA-2026-Q3-009",
    generated_at: "2026-07-27T15:40:00Z",
    regulatory_framework: "NEMA (Act No. 107 of 1998) & DFFE Guidelines",
    compliance_score: 98.4,
    sha256_seal: "0a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a"
  },
  organization: {
    name: "CG WasteData Intelligence Enterprise",
    tax_id: "VAT-4920192831",
    officer: "Elena Vance (Lead Environmental Auditor)"
  },
  summary_metrics: {
    total_waste_tons: 784.0,
    diverted_waste_tons: 729.1,
    overall_diversion_percent: 93.0,
    co2_emissions_avoided_tons: 146.9,
    landfill_tax_saved_usd: 54200.0
  },
  material_breakdown: [
    { category: "Concrete & Masonry", tons: 500.0, recovery_method: "Crushed Aggregate Reuse", percentage: 63.8 },
    { category: "Structural Steel", tons: 177.0, recovery_method: "Smelting & Recycled Rebar", percentage: 22.6 },
    { category: "Timber & Wood", tons: 88.0, recovery_method: "Chipped Biomass Fuel", percentage: 11.2 },
    { category: "Hazardous Materials", tons: 19.0, recovery_method: "Licensed HazMat Containment", percentage: 2.4 }
  ]
};

const DEFAULT_SCHEDULED_JOBS = [
  { id: 'JOB-101', name: 'Weekly Executive Waste Digest', cron: '0 8 * * 1', scheduleDesc: 'Every Monday at 08:00 AM', format: 'PDF', recipients: 'execs@cgwastedata.com', lastRun: '2026-07-21 08:00', status: 'Active', targetChannel: 'Email + Webhook' },
  { id: 'JOB-102', name: 'Monthly NEMA Compliance Audit Export', cron: '0 0 1 * *', scheduleDesc: '1st day of every month', format: 'XLSX + PDF', recipients: 'nema-portal-api.gov.za', lastRun: '2026-07-01 00:00', status: 'Active', targetChannel: 'Government API Webhook' },
  { id: 'JOB-103', name: 'Quarterly Scope 3 Carbon Disclosures', cron: '0 0 1 1,4,7,10 *', scheduleDesc: 'Quarterly on 1st day', format: 'CSV + PDF', recipients: 'esg-audit@cgwastedata.com', lastRun: '2026-07-01 00:00', status: 'Active', targetChannel: 'Email' }
];

export const ReportingEngine: React.FC<ReportingEngineProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'visualize' | 'carbone' | 'reportserver'>('visualize');

  // --- 1. Jaspersoft JS-Visualize Parameters & State ---
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('YTD');
  const [selectedFramework, setSelectedFramework] = useState<string>('NEMA');
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string>('All');
  const [chartType, setChartType] = useState<'bar' | 'area' | 'donut'>('bar');
  const [selectedDrillMaterial, setSelectedDrillMaterial] = useState<string | null>(null);

  // --- 2. Carbone Template Engine State ---
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify(DEFAULT_CARBONE_TEMPLATE_JSON, null, 2));
  const [templateTagExpr, setTemplateTagExpr] = useState<string>('{d.summary_metrics.overall_diversion_percent:percent()}');
  const [carboneFormat, setCarboneFormat] = useState<'pdf' | 'xlsx' | 'csv' | 'json'>('pdf');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [renderSuccess, setRenderSuccess] = useState<boolean>(false);

  // --- 3. Infofabrik ReportServer State ---
  const [scheduledJobs, setScheduledJobs] = useState(DEFAULT_SCHEDULED_JOBS);
  const [newJobName, setNewJobName] = useState('');
  const [newJobCron, setNewJobCron] = useState('0 9 * * 5');
  const [newJobFormat, setNewJobFormat] = useState('PDF');
  const [newJobChannel, setNewJobChannel] = useState('Email');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [jobSuccessMessage, setJobSuccessMessage] = useState<string | null>(null);

  // Filtered dataset for Jaspersoft BI Canvas
  const filteredProjects = useMemo(() => {
    return SAMPLE_PROJECT_DATA.filter(p => {
      if (selectedProject !== 'All' && p.project !== selectedProject) return false;
      return true;
    });
  }, [selectedProject]);

  const filteredManifests = useMemo(() => {
    return DETAIL_MANIFEST_LOGS.filter(m => {
      if (selectedProject !== 'All' && m.project !== selectedProject) return false;
      if (selectedDrillMaterial && !m.material.toLowerCase().includes(selectedDrillMaterial.toLowerCase())) return false;
      if (selectedMaterialFilter !== 'All' && !m.material.toLowerCase().includes(selectedMaterialFilter.toLowerCase())) return false;
      return true;
    });
  }, [selectedProject, selectedDrillMaterial, selectedMaterialFilter]);

  // Handle Carbone JSON compiler
  const handleCarboneCompile = () => {
    try {
      JSON.parse(jsonInput);
      setJsonError(null);
      setRenderSuccess(true);
      setTimeout(() => setRenderSuccess(false), 3000);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  // Handle Export Download
  const handleExportDocument = (format: 'pdf' | 'xlsx' | 'csv' | 'json') => {
    let content = '';
    let mimeType = 'text/plain';
    let fileName = `waste-report-${Date.now()}.${format}`;

    let parsedData = DEFAULT_CARBONE_TEMPLATE_JSON;
    try {
      parsedData = JSON.parse(jsonInput);
    } catch (e) {
      // fallback
    }

    if (format === 'json') {
      content = JSON.stringify(parsedData, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      content = `Project,Material,Weight_Tons,Hauler,Status,Date\n`;
      filteredManifests.forEach(m => {
        content += `"${m.project}","${m.material}",${m.weight},"${m.hauler}","${m.status}","${m.date}"\n`;
      });
      mimeType = 'text/csv';
    } else if (format === 'xlsx') {
      content = `[XLSX-EXCEL WORKBOOK BINARY CONTAINER]\n`;
      content += `SHEET: Summary Metrics\n`;
      content += `Total Waste Tons: ${parsedData.summary_metrics?.total_waste_tons || 784}\n`;
      content += `Diverted Tons: ${parsedData.summary_metrics?.diverted_waste_tons || 729}\n`;
      content += `Diversion Rate: ${parsedData.summary_metrics?.overall_diversion_percent || 93}%\n`;
      content += `Formulas: =SUM(C2:C100), =AVERAGE(D2:D100)\n`;
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else {
      // PDF Mock Output String
      content = `%PDF-1.7\n%CG WasteData Enterprise Report - Carbone Generated\nTitle: ${parsedData.report_metadata?.title || 'Audit Report'}\nSHA256 Seal: ${parsedData.report_metadata?.sha256_seal}\nTotal Diverted: ${parsedData.summary_metrics?.diverted_waste_tons} tons\nGenerated via Carbone Engine v3.2`;
      mimeType = 'application/pdf';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Add Scheduled Job (ReportServer)
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobName) return;
    const created = {
      id: `JOB-${Date.now().toString(36).toUpperCase()}`,
      name: newJobName,
      cron: newJobCron,
      scheduleDesc: `Cron expression (${newJobCron})`,
      format: newJobFormat,
      recipients: 'compliance-team@cgwastedata.com',
      lastRun: 'Pending First Trigger',
      status: 'Active',
      targetChannel: newJobChannel
    };
    setScheduledJobs([created, ...scheduledJobs]);
    setNewJobName('');
    setShowScheduleModal(false);
    setJobSuccessMessage(`Scheduled Job "${created.name}" created successfully!`);
    setTimeout(() => setJobSuccessMessage(null), 4000);
  };

  const COLORS = ['#0B8F6C', '#00C2A8', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-gradient-to-br from-[#0B8F6C] to-[#00C2A8] text-white rounded-xl shadow-md shadow-[#0B8F6C]/20">
                <BarChart3 className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-800">Enterprise Reporting & BI Studio</h2>
                <p className="text-xs sm:text-sm text-slate-500">Powered by JS-Visualize, Carbone JSON Templates & ReportServer Automation</p>
             </div>
          </div>
        </div>

        {/* Quick Format Export Pills */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => handleExportDocument('pdf')}
            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-semibold flex items-center shadow-sm transition-all"
          >
             <FileText className="w-3.5 h-3.5 mr-1.5" /> PDF Executive
          </button>
          <button
            onClick={() => handleExportDocument('xlsx')}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center shadow-sm transition-all"
          >
             <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> XLSX Excel
          </button>
          <button
            onClick={() => handleExportDocument('csv')}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold flex items-center shadow-sm transition-all"
          >
             <Table className="w-3.5 h-3.5 mr-1.5" /> CSV Ledger
          </button>
        </div>
      </div>

      {/* Main Feature Tabs (Jaspersoft BI, Carbone Engine, ReportServer) */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-sm shrink-0">
        <button
          onClick={() => setActiveTab('visualize')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'visualize'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PieChartIcon className="w-4 h-4" />
          <span>Interactive BI Canvas (Jaspersoft)</span>
        </button>

        <button
          onClick={() => setActiveTab('carbone')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'carbone'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>JSON Template Engine (Carbone.io)</span>
        </button>

        <button
          onClick={() => setActiveTab('reportserver')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'reportserver'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>ReportServer Automation & Scheduler</span>
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-8">

        {/* ========================================================= */}
        {/* TAB 1: JASPERSOFT JS-VISUALIZE INTERACTIVE BI CANVAS */}
        {/* ========================================================= */}
        {activeTab === 'visualize' && (
          <div className="space-y-6">

            {/* Jaspersoft Parameter Control Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                   <Filter className="w-3.5 h-3.5 mr-1.5 text-[#0B8F6C]" /> Jaspersoft BI Parameter Controls
                 </span>
                 {selectedDrillMaterial && (
                   <button
                     onClick={() => setSelectedDrillMaterial(null)}
                     className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md font-medium border border-amber-200 flex items-center hover:bg-amber-100 transition-colors"
                   >
                     Clear Chart Drilldown ({selectedDrillMaterial}) &times;
                   </button>
                 )}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Project Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Project Context</label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B8F6C]"
                    >
                      <option value="All">All Projects (Portfolio)</option>
                      {SAMPLE_PROJECT_DATA.map((p, idx) => (
                        <option key={idx} value={p.project}>{p.project}</option>
                      ))}
                    </select>
                  </div>

                  {/* Time Range */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Reporting Horizon</label>
                    <select
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B8F6C]"
                    >
                      <option value="Q1">Q1 2026 Audit</option>
                      <option value="Q2">Q2 2026 Audit</option>
                      <option value="YTD">Year To Date (2026)</option>
                      <option value="LIFECYCLE">Full Project Lifecycle</option>
                    </select>
                  </div>

                  {/* Regulatory Framework */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Regulatory Standard</label>
                    <select
                      value={selectedFramework}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B8F6C]"
                    >
                      <option value="NEMA">NEMA / DFFE (South Africa)</option>
                      <option value="LEED">LEED v4.1 Circular Economy</option>
                      <option value="BREEAM">BREEAM Waste Diversion</option>
                      <option value="EU">EU Taxonomy Annex II</option>
                    </select>
                  </div>

                  {/* Material Stream Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Material Category</label>
                    <select
                      value={selectedMaterialFilter}
                      onChange={(e) => setSelectedMaterialFilter(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B8F6C]"
                    >
                      <option value="All">All Streams</option>
                      <option value="Concrete">Concrete & Aggregates</option>
                      <option value="Steel">Structural Steel</option>
                      <option value="Timber">Timber & Pallets</option>
                      <option value="Hazardous">Hazardous Materials</option>
                    </select>
                  </div>
               </div>
            </div>

            {/* KPI Summary Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Portfolio Diversion Rate</div>
                  <div className="text-2xl font-extrabold text-slate-800 font-data">92.8%</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2.4% vs Regulatory Target
                  </div>
               </div>

               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Waste Tracked</div>
                  <div className="text-2xl font-extrabold text-slate-800 font-data">784.0 <span className="text-xs font-normal text-slate-500">tons</span></div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">
                     Across {filteredProjects.length} Active Sites
                  </div>
               </div>

               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Avoided Scope 3 CO2e</div>
                  <div className="text-2xl font-extrabold text-[#0B8F6C] font-data">146.9 <span className="text-xs font-normal text-slate-500">MT</span></div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-1">
                     Verified for Carbon Credit Offset
                  </div>
               </div>

               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Landfill Tax Savings</div>
                  <div className="text-2xl font-extrabold text-slate-800 font-data">$54,200</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">
                     Recovery Value Yield: $18,400
                  </div>
               </div>
            </div>

            {/* Jaspersoft BI Interactive Canvas */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                 <div>
                   <h3 className="font-bold text-slate-800 text-base">Ad-Hoc Visual Analytics Canvas</h3>
                   <p className="text-xs text-slate-500">Click any chart bar or wedge to activate dynamic drill-down detail filtering below.</p>
                 </div>

                 {/* Chart Type Toggle Buttons */}
                 <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        chartType === 'bar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Bar Stack
                    </button>
                    <button
                      onClick={() => setChartType('area')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        chartType === 'area' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Area Cumulative
                    </button>
                    <button
                      onClick={() => setChartType('donut')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        chartType === 'donut' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Donut Stream
                    </button>
                 </div>
               </div>

               {/* Chart Render Area */}
               <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   {chartType === 'bar' ? (
                     <BarChart data={filteredProjects} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="project" tick={{ fontSize: 11, fill: '#64748b' }} />
                       <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="t" />
                       <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                       <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                       <Bar
                         dataKey="concrete"
                         name="Concrete & Aggregates"
                         fill="#0B8F6C"
                         stackId="a"
                         onClick={(data) => setSelectedDrillMaterial('Concrete')}
                         className="cursor-pointer hover:opacity-80"
                       />
                       <Bar
                         dataKey="steel"
                         name="Structural Steel"
                         fill="#00C2A8"
                         stackId="a"
                         onClick={(data) => setSelectedDrillMaterial('Steel')}
                         className="cursor-pointer hover:opacity-80"
                       />
                       <Bar
                         dataKey="timber"
                         name="Timber & Wood"
                         fill="#3B82F6"
                         stackId="a"
                         onClick={(data) => setSelectedDrillMaterial('Timber')}
                         className="cursor-pointer hover:opacity-80"
                       />
                       <Bar
                         dataKey="hazardous"
                         name="Hazardous Material"
                         fill="#EF4444"
                         stackId="a"
                         onClick={(data) => setSelectedDrillMaterial('Hazardous')}
                         className="cursor-pointer hover:opacity-80"
                       />
                     </BarChart>
                   ) : chartType === 'area' ? (
                     <AreaChart data={filteredProjects} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="project" tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="t" />
                        <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="total" name="Total Waste Tonnage" stroke="#0B8F6C" fill="#0B8F6C" fillOpacity={0.2} strokeWidth={2} />
                        <Area type="monotone" dataKey="carbonAvoided" name="CO2e Avoided (MT)" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
                     </AreaChart>
                   ) : (
                     <PieChart>
                       <Pie
                         data={[
                           { name: 'Concrete & Aggregates', value: 500, color: '#0B8F6C' },
                           { name: 'Structural Steel', value: 177, color: '#00C2A8' },
                           { name: 'Timber & Pallets', value: 88, color: '#3B82F6' },
                           { name: 'Hazardous Materials', value: 19, color: '#EF4444' },
                         ]}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={100}
                         paddingAngle={5}
                         dataKey="value"
                         onClick={(entry) => setSelectedDrillMaterial(entry.name.split(' ')[0])}
                         className="cursor-pointer"
                       >
                         {[
                           { name: 'Concrete', color: '#0B8F6C' },
                           { name: 'Steel', color: '#00C2A8' },
                           { name: 'Timber', color: '#3B82F6' },
                           { name: 'Hazardous', color: '#EF4444' },
                         ].map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                       <Legend wrapperStyle={{ fontSize: '12px' }} />
                     </PieChart>
                   )}
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Drill-Through Detail Record Ledger */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center">
                      <Table className="w-4 h-4 mr-2 text-[#0B8F6C]" />
                      Drill-Through Detail Manifest Ledger ({filteredManifests.length} Records)
                    </h4>
                    <p className="text-xs text-slate-500">Live transaction records linked to selected Jaspersoft parameters.</p>
                 </div>
                 <button
                   onClick={() => handleExportDocument('csv')}
                   className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50 transition-colors flex items-center shadow-sm"
                 >
                    <Download className="w-3.5 h-3.5 mr-1" /> Export Table
                 </button>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-xs text-left">
                   <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                     <tr>
                        <th className="px-4 py-3">Manifest ID</th>
                        <th className="px-4 py-3">Project</th>
                        <th className="px-4 py-3">Material Stream</th>
                        <th className="px-4 py-3">Weight (Tons)</th>
                        <th className="px-4 py-3">Hauler Company</th>
                        <th className="px-4 py-3">Facility Yard</th>
                        <th className="px-4 py-3">Audit Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredManifests.map((m, idx) => (
                       <tr key={idx} className="hover:bg-slate-50 transition-colors">
                         <td className="px-4 py-3 font-mono font-bold text-slate-800">{m.id}</td>
                         <td className="px-4 py-3 font-medium text-slate-700">{m.project}</td>
                         <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                              {m.material}
                            </span>
                         </td>
                         <td className="px-4 py-3 font-bold text-slate-900 font-data">{m.weight} t</td>
                         <td className="px-4 py-3 text-slate-600">{m.hauler} ({m.license})</td>
                         <td className="px-4 py-3 text-slate-600">{m.facility}</td>
                         <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center w-fit">
                              <ShieldCheck className="w-3 h-3 mr-1" /> {m.status}
                            </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CARBONE.IO JSON DATA TEMPLATE ENGINE */}
        {/* ========================================================= */}
        {activeTab === 'carbone' && (
          <div className="space-y-6">

            {/* Banner Intro */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-xl border border-slate-700 shadow-md">
               <div className="flex items-start justify-between">
                 <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                       <span className="px-2 py-0.5 text-[10px] font-bold bg-[#0B8F6C] text-white rounded uppercase">Carbone.io Engine v3.2</span>
                       <h3 className="font-bold text-lg">Dynamic JSON-to-Document Template Studio</h3>
                    </div>
                    <p className="text-xs text-slate-300 max-w-2xl">
                      Inject structured JSON payloads into custom document templates with dynamic tag bindings like <code className="text-emerald-400 font-mono">{`{d.summary_metrics.total_waste_tons:formatNumber(2)}`}</code> and generate PDF, XLSX, or CSV reports on demand.
                    </p>
                 </div>
                 <button
                   onClick={handleCarboneCompile}
                   className="px-4 py-2 bg-[#0B8F6C] text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center shadow-md shrink-0"
                 >
                   <Play className="w-3.5 h-3.5 mr-1.5" /> Compile Template
                 </button>
               </div>
            </div>

            {/* Template Tag Assistant Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Carbone Tag Expression Inspector</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={templateTagExpr}
                      onChange={(e) => setTemplateTagExpr(e.target.value)}
                      className="flex-1 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0B8F6C]"
                      placeholder="{d.summary_metrics.overall_diversion_percent:percent()}"
                    />
                    <button
                      onClick={() => alert(`Tag Test Evaluation Output:\n${templateTagExpr} => 93.0%`)}
                      className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
                    >
                      Test Tag
                    </button>
                  </div>
               </div>

               <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs text-slate-500 font-semibold">Target Output:</span>
                  {(['pdf', 'xlsx', 'csv', 'json'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setCarboneFormat(fmt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        carboneFormat === fmt
                          ? 'bg-[#0B8F6C] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
               </div>
            </div>

            {/* Split Screen: Left JSON Payload, Right Template Output Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

               {/* Left: JSON Input Code Editor */}
               <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-md flex flex-col h-[520px]">
                  <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
                     <span className="font-mono flex items-center text-emerald-400 font-semibold">
                       <Code className="w-3.5 h-3.5 mr-1.5" /> carbone_context.json
                     </span>
                     <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">UTF-8 JSON</span>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto">
                     <textarea
                       value={jsonInput}
                       onChange={(e) => setJsonInput(e.target.value)}
                       className="w-full h-full bg-transparent font-mono text-xs text-emerald-300 focus:outline-none resize-none leading-relaxed"
                       spellCheck={false}
                     />
                  </div>

                  {jsonError && (
                    <div className="p-3 bg-red-950/80 border-t border-red-800 text-red-300 text-xs flex items-center">
                       <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-red-400" />
                       <span className="truncate">{jsonError}</span>
                    </div>
                  )}

                  {renderSuccess && (
                    <div className="p-3 bg-emerald-950/80 border-t border-emerald-800 text-emerald-300 text-xs flex items-center">
                       <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-emerald-400" />
                       <span>Template compiled successfully! Output updated in preview.</span>
                    </div>
                  )}
               </div>

               {/* Right: Compiled Document Output Preview */}
               <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[520px]">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-700 flex items-center">
                       <Eye className="w-3.5 h-3.5 mr-1.5 text-[#0B8F6C]" /> Carbone Live Rendered Document
                     </span>
                     <button
                       onClick={() => handleExportDocument(carboneFormat)}
                       className="px-3 py-1 bg-[#0B8F6C] text-white text-xs font-bold rounded hover:bg-emerald-600 transition-colors flex items-center shadow-sm"
                     >
                        <Download className="w-3 h-3 mr-1" /> Export {carboneFormat.toUpperCase()}
                     </button>
                  </div>

                  {/* Document Page Simulation */}
                  <div className="flex-1 p-6 overflow-y-auto bg-slate-100">
                     <div className="bg-white p-6 rounded-lg shadow border border-slate-200 max-w-lg mx-auto font-sans text-xs space-y-4">

                        {/* Letterhead Header */}
                        <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
                           <div>
                              <div className="font-bold text-slate-900 text-sm">CG WASTEDATA INTELLIGENCE</div>
                              <div className="text-[10px] text-slate-500">Environmental Compliance Audit Report</div>
                           </div>
                           <div className="text-right">
                              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                                 SEAL: VERIFIED
                              </span>
                           </div>
                        </div>

                        {/* Metadata Tag Render */}
                        <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                           <div className="flex justify-between">
                              <span className="text-slate-500">Document ID:</span>
                              <span className="font-mono font-bold text-slate-800">CG-NEMA-2026-Q3-009</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-slate-500">Regulatory Standard:</span>
                              <span className="font-medium text-slate-800">NEMA Act No. 107 & DFFE</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-slate-500">Auditor Officer:</span>
                              <span className="font-medium text-slate-800">Elena Vance</span>
                           </div>
                        </div>

                        {/* Summary Metrics Grid */}
                        <div>
                           <div className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Executive Summary Metrics</div>
                           <div className="grid grid-cols-2 gap-2 text-center">
                              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-100">
                                 <div className="text-[10px] text-emerald-700 font-bold uppercase">Overall Diversion Rate</div>
                                 <div className="text-xl font-extrabold text-emerald-900 font-data">93.0%</div>
                              </div>
                              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                                 <div className="text-[10px] text-slate-500 font-bold uppercase">Avoided CO2e</div>
                                 <div className="text-xl font-extrabold text-slate-800 font-data">146.9 MT</div>
                              </div>
                           </div>
                        </div>

                        {/* Material Breakdown Table */}
                        <div>
                           <div className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Material Stream Breakdown</div>
                           <table className="w-full text-[11px] text-left border-collapse">
                              <thead>
                                 <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                                    <th className="py-1">Category</th>
                                    <th className="py-1 text-right">Tons</th>
                                    <th className="py-1 text-right">% Total</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 <tr>
                                    <td className="py-1.5 font-medium text-slate-800">Concrete & Masonry</td>
                                    <td className="py-1.5 text-right font-data font-bold">500.0 t</td>
                                    <td className="py-1.5 text-right font-data">63.8%</td>
                                 </tr>
                                 <tr>
                                    <td className="py-1.5 font-medium text-slate-800">Structural Steel</td>
                                    <td className="py-1.5 text-right font-data font-bold">177.0 t</td>
                                    <td className="py-1.5 text-right font-data">22.6%</td>
                                 </tr>
                                 <tr>
                                    <td className="py-1.5 font-medium text-slate-800">Timber & Wood</td>
                                    <td className="py-1.5 text-right font-data font-bold">88.0 t</td>
                                    <td className="py-1.5 text-right font-data">11.2%</td>
                                 </tr>
                                 <tr>
                                    <td className="py-1.5 font-medium text-slate-800">Hazardous Materials</td>
                                    <td className="py-1.5 text-right font-data font-bold">19.0 t</td>
                                    <td className="py-1.5 text-right font-data">2.4%</td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>

                        {/* Checksum Footer */}
                        <div className="pt-3 border-t border-slate-200 text-[9px] text-slate-400 font-mono truncate">
                           SHA256: 0a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
                        </div>
                     </div>
                  </div>
               </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: INFOFABRIK REPORTSERVER AUTOMATION & SCHEDULER */}
        {/* ========================================================= */}
        {activeTab === 'reportserver' && (
          <div className="space-y-6">

            {/* Header & New Schedule Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <div>
                  <h3 className="font-bold text-slate-800 text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-[#0B8F6C]" />
                    Infofabrik ReportServer Job Scheduler
                  </h3>
                  <p className="text-xs text-slate-500">Configure automated report distribution, cron triggers, email digests, and regulatory API webhooks.</p>
               </div>
               <button
                 onClick={() => setShowScheduleModal(true)}
                 className="px-4 py-2 bg-[#0B8F6C] text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center shadow-sm shrink-0"
               >
                 <Send className="w-3.5 h-3.5 mr-1.5" /> Create Scheduled Dispatch
               </button>
            </div>

            {jobSuccessMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center">
                 <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                 {jobSuccessMessage}
              </div>
            )}

            {/* Scheduled Jobs Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Active Automated Report Schedules ({scheduledJobs.length})
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-xs text-left">
                   <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                     <tr>
                        <th className="px-4 py-3">Job ID</th>
                        <th className="px-4 py-3">Report Name</th>
                        <th className="px-4 py-3">Cron Expression</th>
                        <th className="px-4 py-3">Target Format</th>
                        <th className="px-4 py-3">Distribution Channel</th>
                        <th className="px-4 py-3">Last Execution</th>
                        <th className="px-4 py-3">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {scheduledJobs.map((job, idx) => (
                       <tr key={idx} className="hover:bg-slate-50 transition-colors">
                         <td className="px-4 py-3 font-mono font-bold text-slate-800">{job.id}</td>
                         <td className="px-4 py-3 font-semibold text-slate-800">{job.name}</td>
                         <td className="px-4 py-3 font-mono text-slate-600">
                           <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px]">{job.cron}</span>
                         </td>
                         <td className="px-4 py-3">
                           <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded">
                             {job.format}
                           </span>
                         </td>
                         <td className="px-4 py-3 text-slate-600 font-medium">{job.targetChannel} ({job.recipients})</td>
                         <td className="px-4 py-3 text-slate-500">{job.lastRun}</td>
                         <td className="px-4 py-3">
                           <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                             {job.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Execution Audit Archive & Checksum Verification */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
               <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center">
                 <ShieldCheck className="w-4 h-4 mr-2 text-[#0B8F6C]" /> ReportServer Execution Archive & SHA-256 Audit Trail
               </h4>

               <div className="space-y-3">
                  {[
                    { file: 'ESG_Q2_2026_Full_Disclosure.pdf', date: '2026-07-26 18:00', duration: '412 ms', size: '2.4 MB', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
                    { file: 'NEMA_Monthly_Waste_Ledger_July.xlsx', date: '2026-07-01 00:00', duration: '280 ms', size: '1.1 MB', hash: '8f9b2a1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a' },
                    { file: 'Scope3_Transport_Carbon_Audit.csv', date: '2026-06-30 23:59', duration: '120 ms', size: '480 KB', hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b' }
                  ].map((arch, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100 transition-colors">
                       <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 text-xs flex items-center">
                             <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> {arch.file}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                             Generated: {arch.date} | Time: {arch.duration} | Size: {arch.size}
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono truncate">
                             SHA256: {arch.hash}
                          </div>
                       </div>

                       <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => handleExportDocument('pdf')}
                            className="px-3 py-1 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50 transition-colors shadow-sm"
                          >
                             Re-Download
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: CREATE SCHEDULED JOB */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                 <h3 className="font-bold text-slate-800 text-base">Schedule New Report Dispatch</h3>
                 <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
              </div>

              <form onSubmit={handleAddJob} className="space-y-4">
                 <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Report Name</label>
                    <input
                      type="text"
                      required
                      value={newJobName}
                      onChange={(e) => setNewJobName(e.target.value)}
                      placeholder="e.g. Daily Demolition Waste Summary"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B8F6C]"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cron Schedule (5-part format)</label>
                    <input
                      type="text"
                      required
                      value={newJobCron}
                      onChange={(e) => setNewJobCron(e.target.value)}
                      placeholder="0 8 * * 1"
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B8F6C]"
                    />
                    <span className="text-[10px] text-slate-500">Preset: <code>0 8 * * 1</code> = Every Monday at 08:00 AM</span>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="block text-xs font-semibold text-slate-700 mb-1">Target Format</label>
                       <select
                         value={newJobFormat}
                         onChange={(e) => setNewJobFormat(e.target.value)}
                         className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                       >
                          <option value="PDF">PDF Report</option>
                          <option value="XLSX">XLSX Excel</option>
                          <option value="CSV">CSV Flat Data</option>
                          <option value="PDF + XLSX">PDF + XLSX Bundle</option>
                       </select>
                    </div>

                    <div>
                       <label className="block text-xs font-semibold text-slate-700 mb-1">Channel</label>
                       <select
                         value={newJobChannel}
                         onChange={(e) => setNewJobChannel(e.target.value)}
                         className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                       >
                          <option value="Email">Email Digest</option>
                          <option value="Government API Webhook">Government API Webhook</option>
                          <option value="FTP Cloud Storage">FTP Cloud Archive</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowScheduleModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
                    >
                       Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0B8F6C] text-white rounded-lg text-xs font-bold hover:bg-emerald-600"
                    >
                       Save Schedule
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default ReportingEngine;
