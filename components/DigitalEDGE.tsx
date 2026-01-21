
import React, { useState } from 'react';
import { 
  Leaf, Award, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, 
  FileText, Zap, Recycle, Brain, Loader2, Lock,
  TrafficCone, TrendingUp, DollarSign, UploadCloud, ChevronRight, 
  BarChart3, Box, Layers, HelpCircle, ShieldCheck, FileCheck, Search,
  ScanLine, ImageIcon, Plus, Trash2, Wand2, Calculator, MessageSquare, ListChecks, Info
} from 'lucide-react';
import { getEdgeAdvisory, analyzeConstructionPlan, predictEdgeBaselines } from '../services/geminiService';
import { EdgeProject, EdgeMaterialStream, BimMaterial } from '../types';
import { supabase } from '../lib/supabaseClient';

// --- Sub-components ---

const ReadinessTrafficLight = ({ score, target }: { score: number, target: number }) => {
  const isReady = score >= target;
  const isRisk = score < 10;
  
  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg border shadow-sm ${
      isReady ? 'bg-green-50 border-green-200' :
      isRisk ? 'bg-red-50 border-red-200' :
      'bg-amber-50 border-amber-200'
    }`}>
      <div className={`w-4 h-4 rounded-full ${isReady ? 'bg-green-500 animate-pulse' : 'bg-green-200'}`}></div>
      <div className={`w-4 h-4 rounded-full ${!isReady && !isRisk ? 'bg-amber-500 animate-pulse' : 'bg-amber-200'}`}></div>
      <div className={`w-4 h-4 rounded-full ${isRisk ? 'bg-red-500 animate-pulse' : 'bg-red-200'}`}></div>
      <div className="pl-2 border-l border-slate-200/50 ml-2">
         <span className={`text-sm font-bold block leading-none ${
           isReady ? 'text-green-700' : isRisk ? 'text-red-700' : 'text-amber-700'
         }`}>
           {isReady ? 'EDGE Ready' : isRisk ? 'Not Compliant' : 'On Track'}
         </span>
         <span className="text-[10px] text-slate-500 uppercase font-medium">Certification Status</span>
      </div>
    </div>
  );
};

const SamplingCalculator = () => {
    const [typology, setTypology] = useState('Homes/Apartments');
    const [unitCount, setUnitCount] = useState(0);

    const calculateSample = () => {
        if (unitCount <= 0) return 0;
        if (typology === 'Retail/Office') return '40% Area';
        // Formula: Square root of units + 1
        return Math.ceil(Math.sqrt(unitCount) + 1);
    };

    const sampleSize = calculateSample();

    return (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
            <h4 className="font-bold text-slate-800 flex items-center mb-4">
                <Calculator className="w-5 h-5 mr-2 text-slate-600" /> Audit Sampling Calculator (v3.0)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Building Typology</label>
                    <select 
                        className="w-full text-sm border-slate-300 rounded-md p-2 bg-white"
                        value={typology}
                        onChange={(e) => setTypology(e.target.value)}
                    >
                        <option value="Homes/Apartments">Homes & Apartments</option>
                        <option value="Hotels/Resorts">Hotels & Resorts</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Retail/Office">Retail & Office</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Total Units/Rooms</label>
                    <input 
                        type="number" 
                        className="w-full text-sm border-slate-300 rounded-md p-2"
                        value={unitCount}
                        onChange={(e) => setUnitCount(parseInt(e.target.value) || 0)}
                        placeholder="e.g. 160"
                    />
                </div>
                <div className="bg-white border border-slate-200 rounded-md p-3 text-center">
                    <span className="block text-xs text-slate-400 uppercase font-bold">Required Sample</span>
                    <span className="text-xl font-bold text-green-600">{sampleSize}</span>
                    <span className="text-[10px] text-slate-400 block">
                        {typology === 'Retail/Office' ? 'of similar areas' : 'units/rooms'}
                    </span>
                </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
                *Based on EDGE User Guide Part 8, Table 10. For apartments, calculate per typology. For Retail/Office, verify 40% of similar areas.
            </p>
        </div>
    );
};

const AuditTrail = () => {
    const [comments, setComments] = useState([
        { id: 1, author: 'Auditor', role: 'Auditor', text: 'Documentation Requirements: Concise text to describe requirement 1 [located in specs.pdf, page 4]. Parameter: U-Value [0.45 W/m2K]. Checked and verified.', date: '2 hours ago' },
        { id: 2, author: 'Certifier Reviewer', role: 'Certifier', text: 'In case of rejection, the reason for rejection must be very clear. Please clarify the wall thickness assumption in MEM05.', date: '1 hour ago' }
    ]);
    const [newComment, setNewComment] = useState('');

    const addComment = () => {
        if(!newComment) return;
        setComments([...comments, { id: Date.now(), author: 'Project Team', role: 'Client', text: newComment, date: 'Just now' }]);
        setNewComment('');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
             <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center">
                    <ListChecks className="w-5 h-5 mr-2 text-blue-600" /> Official Audit Trail
                </h3>
                <span className="text-xs text-slate-500">v3.0 Protocol Compliance</span>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.map(c => (
                    <div key={c.id} className={`flex flex-col ${c.role === 'Client' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                            c.role === 'Auditor' ? 'bg-green-50 border border-green-100' : 
                            c.role === 'Certifier' ? 'bg-amber-50 border border-amber-100' :
                            'bg-slate-100 border border-slate-200'
                        }`}>
                            <div className="flex items-center space-x-2 mb-1">
                                <span className={`text-xs font-bold ${
                                     c.role === 'Auditor' ? 'text-green-700' : 
                                     c.role === 'Certifier' ? 'text-amber-700' : 'text-slate-700'
                                }`}>{c.author}</span>
                                <span className="text-[10px] text-slate-400">{c.date}</span>
                            </div>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.text}</p>
                        </div>
                    </div>
                ))}
             </div>
             <div className="p-4 border-t border-slate-200 bg-slate-50">
                <textarea 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Enter Client Comment (refer to filenames e.g. Roof_Areas_with_SRI-02.pdf)..."
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                    <button onClick={addComment} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                        Post to Audit Trail
                    </button>
                </div>
             </div>
        </div>
    );
};

const AUDITOR_QA = [
  {
    q: "Do outdoor pool covers count for savings?",
    a: "No. From EDGE v3.1, WEM12 only considers energy and water savings for INDOOR swimming pool covers. Outdoor pools impact demand but claim no savings. (WEM12)"
  },
  {
    q: "How must shower flow rate be measured?",
    a: "Flow rate must be quoted for an operating pressure of at least 3 bar (43.5 psi). On-site tests must verify this pressure. (WEM01)"
  },
  {
    q: "Does rainwater harvesting always count?",
    a: "No. WEM14 can only be claimed if it is demonstrated that the harvested water replaces municipal water supply (e.g. for toilet flushing or irrigation). (WEM14)"
  },
  {
    q: "What defines a 'Minor Information Gap' in v3.0?",
    a: "A circumstance where absence of data leads to <0.5% deviation in savings, and the 20% threshold is not impacted. (Pg 7)"
  },
  {
    q: "What are the Smart Meter requirements (WEM17)?",
    a: "They must measure use during offline periods, assist in leak detection, and display insights. For Core & Shell, landlords must have access to data."
  },
  {
    q: "What is the sampling rule for Apartments/Hotels?",
    a: "Square root of the number of units + 1 (√N + 1), rounded up, for each typology. (Table 10, Pg 50)"
  },
  {
    q: "Can I use 'Bucket Baths' or 'Bucket Flush'?",
    a: "Yes, but they result in 0% savings compared to the Base Case. (WEM01/WEM04)"
  },
  {
    q: "How to handle Data Centers?",
    a: "Verify PUE Category 2. Metering must be at PDU output (Point A). If measured at UPS (Point B), assume 3% loss. (Pg 40)"
  }
];

const DigitalEDGE: React.FC = () => {
  const [viewState, setViewState] = useState<'onboarding' | 'analysis'>('onboarding');
  const [activeTab, setActiveTab] = useState<'calculator' | 'bim' | 'auditor' | 'plan' | 'trail'>('calculator');
  
  const [project, setProject] = useState<EdgeProject>({
    project_id: 'new',
    project_name: '',
    location: '',
    project_type: 'Commercial',
    edge_target_level: 'Certified',
    gross_floor_area: 0,
    construction_phase: 'Construction'
  });
  
  const [streams, setStreams] = useState<EdgeMaterialStream[]>([]);
  const [advisory, setAdvisory] = useState<string | null>(null);
  const [loadingAdvisory, setLoadingAdvisory] = useState(false);
  const [isForecasting, setIsForecasting] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(0);
  
  // BIM State
  const [bimMaterials, setBimMaterials] = useState<BimMaterial[]>([]);
  const [isProcessingBim, setIsProcessingBim] = useState(false);
  const [qaSearch, setQaSearch] = useState('');

  // Plan Scan State
  const [planImage, setPlanImage] = useState<string | null>(null);
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [planAnalysis, setPlanAnalysis] = useState<string | null>(null);
  const [isScanningPlan, setIsScanningPlan] = useState(false);

  // --- Logic: Initialize Baseline with AI Forecast & Save to DB ---
  const initializeBaseline = async () => {
    if (project.gross_floor_area <= 0) return;
    setIsForecasting(true);

    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // 1. Forecast Data
        const forecast = await predictEdgeBaselines(project);
        let finalStreams: any[] = [];
        
        if (forecast && forecast.streams) {
            finalStreams = forecast.streams.map((s: any) => ({
                material_type: s.material_type || 'Concrete',
                category: s.category || 'Structure',
                baseline_quantity_tons: s.baseline_quantity_tons || 0,
                improved_quantity_tons: s.improved_quantity_tons || 0,
                disposal_method: s.disposal_method || 'Landfill',
                recovery_percentage: s.recovery_percentage || 0,
                source: 'Estimated'
            }));
        } else {
             // Fallback Logic
             const factor = project.project_type === 'Commercial' ? 0.08 : 0.05;
             const total = project.gross_floor_area * factor;
             finalStreams = [
               { material_type: 'Concrete', category: 'Structure', baseline_quantity_tons: total * 0.5, improved_quantity_tons: total * 0.5, disposal_method: 'Landfill', recovery_percentage: 0, source: 'Estimated' },
               { material_type: 'Steel', category: 'Structure', baseline_quantity_tons: total * 0.15, improved_quantity_tons: total * 0.15, disposal_method: 'Landfill', recovery_percentage: 0, source: 'Estimated' },
               { material_type: 'Timber', category: 'Finish', baseline_quantity_tons: total * 0.1, improved_quantity_tons: total * 0.1, disposal_method: 'Landfill', recovery_percentage: 0, source: 'Estimated' }
             ];
        }

        // 2. Save Project to DB
        if (user) {
            const { data: projData, error: projError } = await supabase
              .from('projects')
              .insert({
                owner_id: user.id,
                name: project.project_name,
                project_type: project.project_type,
                location: project.location,
                gross_floor_area: project.gross_floor_area,
                construction_phase: project.construction_phase,
                status: 'Active'
              })
              .select()
              .single();

            if (projError) throw projError;
            
            // Update local state with real ID
            setProject(prev => ({ ...prev, project_id: projData.id }));

            // 3. Save Streams to DB
            const streamsWithId = finalStreams.map(s => ({
              ...s,
              project_id: projData.id,
              evidence_status: 'Pending'
            }));

            const { data: streamData, error: streamError } = await supabase
              .from('edge_material_streams')
              .insert(streamsWithId)
              .select();
            
            if (streamError) throw streamError;

            // Map DB result to frontend types
            const mappedStreams: EdgeMaterialStream[] = (streamData || []).map((s: any) => ({
               material_id: s.id,
               material_type: s.material_type,
               category: s.category,
               baseline_quantity_tons: s.baseline_quantity_tons,
               improved_quantity_tons: s.improved_quantity_tons,
               disposal_method: s.disposal_method,
               recovery_percentage: s.recovery_percentage,
               evidence_status: s.evidence_status,
               source: s.source
            }));
            
            setStreams(mappedStreams);
            setViewState('analysis');
        }

    } catch (error) {
        console.error("Forecast/Save failed", error);
        alert("Error saving project. Check console.");
    } finally {
        setIsForecasting(false);
    }
  };

  const addStream = async () => {
    if (project.project_id === 'new') return;
    
    const newStream = {
      project_id: project.project_id,
      material_type: 'Concrete',
      category: 'Structure',
      baseline_quantity_tons: 0,
      improved_quantity_tons: 0,
      disposal_method: 'Landfill',
      recovery_percentage: 0,
      evidence_status: 'Pending',
      source: 'Manual Input'
    };

    const { data, error } = await supabase.from('edge_material_streams').insert(newStream).select().single();
    
    if (data) {
        const s: EdgeMaterialStream = {
           material_id: data.id,
           material_type: data.material_type,
           category: data.category,
           baseline_quantity_tons: data.baseline_quantity_tons,
           improved_quantity_tons: data.improved_quantity_tons,
           disposal_method: data.disposal_method,
           recovery_percentage: data.recovery_percentage,
           evidence_status: data.evidence_status,
           source: data.source
        };
        setStreams([...streams, s]);
    }
  };

  const removeStream = async (id: string) => {
    await supabase.from('edge_material_streams').delete().eq('id', id);
    setStreams(prev => prev.filter(s => s.material_id !== id));
  };

  // --- Logic: BIM Integration ---
  const handleBimUpload = () => {
    setIsProcessingBim(true);
    setTimeout(() => {
      // Mock parsing of an IFC file
      const extracted: BimMaterial[] = [
        { id: 'b1', element_name: 'Basic Wall: Cast-in-Place Concrete 300mm', bim_quantity: 4500, unit: 'm3', edge_category: 'Concrete', estimated_waste_rate: 5 },
        { id: 'b2', element_name: 'Structural Column: Steel W300x150', bim_quantity: 120, unit: 'm3', edge_category: 'Steel', estimated_waste_rate: 15 }, // High offcuts
        { id: 'b3', element_name: 'Floor: Timber Composite Deck', bim_quantity: 2200, unit: 'm2', edge_category: 'Timber', estimated_waste_rate: 8 },
      ];
      setBimMaterials(extracted);
      setIsProcessingBim(false);
    }, 2000);
  };

  const syncBimToEdge = () => {
    // Convert BIM quantities to Mass (simplified density logic)
    // Concrete ~ 2.4 t/m3, Steel ~ 7.8 t/m3, Timber ~ 0.6 t/m3 (proxy)
    let totalConcrete = 0;
    let totalSteel = 0;
    let totalTimber = 0;

    bimMaterials.forEach(m => {
       const wasteMass = m.bim_quantity * (m.estimated_waste_rate / 100); 
       // Simplified mass calc for waste portion
       if (m.edge_category === 'Concrete') totalConcrete += (wasteMass * 2.4);
       if (m.edge_category === 'Steel') totalSteel += (wasteMass * 7.8);
       if (m.edge_category === 'Timber') totalTimber += (wasteMass * 0.05); // m2 proxy
    });

    // Update streams with BIM data - Only updates IMPROVED quantities
    // In a real app, this would perform multiple DB updates
    setStreams(prev => prev.map(s => {
       if (s.material_type === 'Concrete') return { ...s, improved_quantity_tons: totalConcrete, source: 'BIM-Derived' };
       if (s.material_type === 'Steel') return { ...s, improved_quantity_tons: totalSteel, source: 'BIM-Derived' };
       if (s.material_type === 'Timber') return { ...s, improved_quantity_tons: totalTimber, source: 'BIM-Derived' };
       return s;
    }));
    setActiveTab('calculator');
  };

  // --- Logic: Plan Scanner ---
  const handlePlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setPlanFile(f);
      const r = new FileReader();
      r.onloadend = () => setPlanImage(r.result as string);
      r.readAsDataURL(f);
    }
  };

  const runPlanScan = async () => {
    if (!planImage || !planFile) return;
    setIsScanningPlan(true);
    setPlanAnalysis(null);
    try {
        const base64 = planImage.split(',')[1];
        const result = await analyzeConstructionPlan(base64, planFile.type);
        setPlanAnalysis(result);
    } catch (e) {
        console.error(e);
        setPlanAnalysis("Failed to analyze plan. Please try again.");
    }
    setIsScanningPlan(false);
  };


  // --- Logic: Material Efficiency ---
  const calculateEfficiency = () => {
    let baselineImpact = 0;
    let improvedImpact = 0;

    streams.forEach(s => {
      // Weighting factors for carbon intensity proxy
      const factor = s.material_type === 'Steel' ? 2.0 : s.material_type === 'Concrete' ? 0.5 : 1.0;
      baselineImpact += s.baseline_quantity_tons * factor;
      
      // Impact is material sent to landfill (not recovered)
      const landfilled = s.improved_quantity_tons * (1 - (s.recovery_percentage / 100));
      improvedImpact += landfilled * factor;
    });

    return baselineImpact > 0 ? ((baselineImpact - improvedImpact) / baselineImpact) * 100 : 0;
  };

  const score = calculateEfficiency();
  const target = project.edge_target_level === 'Zero Carbon' ? 100 : project.edge_target_level === 'Advanced' ? 40 : 20;

  const updateStream = async (id: string, field: keyof EdgeMaterialStream, value: any) => {
    // Optimistic Update
    setStreams(prev => prev.map(s => s.material_id === id ? { ...s, [field]: value } : s));
    
    // DB Update
    // Note: Debouncing recommended for production inputs
    if (field !== 'material_id' && field !== 'source' && field !== 'evidence_status') {
        await supabase.from('edge_material_streams').update({ [field]: value }).eq('id', id);
    }
  };

  const runAdvisory = async () => {
    setLoadingAdvisory(true);
    try {
      const report = await getEdgeAdvisory({ project, streams, score, target });
      setAdvisory(report);
    } catch (e) { console.error(e); }
    setLoadingAdvisory(false);
  };

  const handleManageDocs = () => {
    // Simulate document upload process
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.png,.jpg';
    input.onchange = (e: any) => {
       if (e.target.files.length > 0) {
          setEvidenceCount(c => c + 1);
          alert("Document uploaded successfully and linked to compliance record.");
       }
    };
    input.click();
  };

  // --- View: Onboarding ---
  if (viewState === 'onboarding') {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
             <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                   <Leaf className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold">EDGE Project Setup</h1>
             </div>
             <p className="text-slate-300">
               Step 1: Define project parameters. Our AI will forecast Design-Stage Baselines to calculate your potential Efficiency Score.
             </p>
          </div>
          <div className="p-8 space-y-6">
             <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                   <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Skyline Tower" 
                     value={project.project_name} onChange={e => setProject({...project, project_name: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Building Typology</label>
                   <select className="w-full px-4 py-2 border rounded-lg bg-white" 
                     value={project.project_type} onChange={e => setProject({...project, project_type: e.target.value as any})}>
                     <option value="Commercial">Commercial</option>
                     <option value="Residential">Residential</option>
                     <option value="Mixed">Mixed Use</option>
                     <option value="Retail">Retail</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                   <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Country / City"
                     value={project.location} onChange={e => setProject({...project, location: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Gross Floor Area (m²)</label>
                   <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="0"
                     value={project.gross_floor_area} onChange={e => setProject({...project, gross_floor_area: Number(e.target.value)})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Certification Target</label>
                   <select className="w-full px-4 py-2 border rounded-lg bg-white"
                     value={project.edge_target_level} onChange={e => setProject({...project, edge_target_level: e.target.value as any})}>
                     <option value="Certified">EDGE Certified (20%)</option>
                     <option value="Advanced">EDGE Advanced (40%)</option>
                     <option value="Zero Carbon">Zero Carbon (100%)</option>
                   </select>
                </div>
             </div>
             <div className="pt-4 flex justify-end">
                <button onClick={initializeBaseline} disabled={!project.project_name || project.gross_floor_area <= 0 || isForecasting}
                  className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center shadow-lg disabled:opacity-50 transition-all">
                  {isForecasting ? (
                     <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Forecasting with Gemini...</>
                  ) : (
                     <><Wand2 className="w-4 h-4 mr-2" /> Forecast & Create Project</>
                  )}
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- View: Analysis Dashboard ---
  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      {/* Top Bar: Readiness Status */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center space-x-4">
            <div className="p-2 bg-slate-100 rounded-lg"><Award className="w-6 h-6 text-slate-700" /></div>
            <div>
               <h2 className="font-bold text-slate-900">{project.project_name}</h2>
               <p className="text-xs text-slate-500">{project.location} • {project.project_type}</p>
            </div>
         </div>
         <div className="flex items-center space-x-6">
             <div className="text-right">
                <span className="block text-2xl font-bold text-slate-900">{score.toFixed(1)}%</span>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Efficiency Score</span>
             </div>
             <ReadinessTrafficLight score={score} target={target} />
             <div className="h-8 w-px bg-slate-200"></div>
             <button onClick={() => setViewState('onboarding')} className="text-slate-400 hover:text-slate-600"><RefreshCw className="w-5 h-5" /></button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('calculator')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'calculator' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          <Zap className="w-4 h-4 mr-2" /> Efficiency Engine
        </button>
        <button onClick={() => setActiveTab('bim')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'bim' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          <Box className="w-4 h-4 mr-2" /> BIM Integrator
        </button>
        <button onClick={() => setActiveTab('plan')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'plan' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          <ScanLine className="w-4 h-4 mr-2" /> Deep Plan Scanner
        </button>
        <button onClick={() => setActiveTab('auditor')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'auditor' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          <ShieldCheck className="w-4 h-4 mr-2" /> Auditor Guidance
        </button>
        <button onClick={() => setActiveTab('trail')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'trail' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          <MessageSquare className="w-4 h-4 mr-2" /> Audit Trail
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
         
         {/* LEFT PANEL: VARIES BY TAB */}
         <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* TAB: CALCULATOR */}
            {activeTab === 'calculator' && (
              <>
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                   <h3 className="font-bold text-slate-700 flex items-center">
                     <Zap className="w-4 h-4 mr-2 text-amber-500" /> Design-Stage Forecast
                   </h3>
                   <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600 font-medium flex items-center">
                     <Lock className="w-3 h-3 mr-1" /> Baseline Locked
                   </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white text-slate-500 font-medium sticky top-0 z-10 border-b border-slate-100">
                       <tr>
                          <th className="px-6 py-3">Material Stream</th>
                          <th className="px-6 py-3">Category</th>
                          <th className="px-6 py-3 bg-slate-50/50">Baseline (t)</th>
                          <th className="px-6 py-3">Improved (t)</th>
                          <th className="px-6 py-3">Recovery Strategy</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {streams.map(stream => {
                          const isManual = stream.source === 'Manual Input';
                          return (
                            <tr key={stream.material_id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                  {isManual ? (
                                    <select 
                                      value={stream.material_type}
                                      onChange={(e) => updateStream(stream.material_id, 'material_type', e.target.value)}
                                      className="w-full border border-slate-300 rounded p-1.5 text-sm bg-white"
                                    >
                                      <option value="Concrete">Concrete</option>
                                      <option value="Steel">Steel</option>
                                      <option value="Timber">Timber</option>
                                      <option value="Glass">Glass</option>
                                      <option value="Plastics">Plastics</option>
                                      <option value="Brick">Brick</option>
                                      <option value="Excavation">Excavation</option>
                                      <option value="Hazardous">Hazardous</option>
                                    </select>
                                  ) : (
                                    <>
                                      <span className="font-medium text-slate-800 block">{stream.material_type}</span>
                                      {stream.source === 'BIM-Derived' ? (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">BIM VERIFIED</span>
                                      ) : (
                                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">AI FORECAST</span>
                                      )}
                                    </>
                                  )}
                              </td>
                              <td className="px-6 py-4">
                                  {isManual ? (
                                    <select 
                                      value={stream.category}
                                      onChange={(e) => updateStream(stream.material_id, 'category', e.target.value)}
                                      className="w-full border border-slate-300 rounded p-1.5 text-sm bg-white"
                                    >
                                      <option value="Structure">Structure</option>
                                      <option value="Envelope">Envelope</option>
                                      <option value="Finish">Finish</option>
                                      <option value="Site">Site</option>
                                    </select>
                                  ) : (
                                    <span className="text-slate-500">{stream.category}</span>
                                  )}
                              </td>
                              <td className="px-6 py-4 bg-slate-50/50 font-mono text-slate-500">
                                  {isManual ? (
                                    <input 
                                      type="number" 
                                      value={stream.baseline_quantity_tons} 
                                      onChange={(e) => updateStream(stream.material_id, 'baseline_quantity_tons', Number(e.target.value))} 
                                      className="w-20 px-2 py-1 border rounded text-slate-900 font-medium" 
                                    />
                                  ) : (
                                    stream.baseline_quantity_tons.toFixed(1)
                                  )}
                              </td>
                              <td className="px-6 py-4">
                                  <input type="number" value={stream.improved_quantity_tons}
                                    onChange={(e) => updateStream(stream.material_id, 'improved_quantity_tons', Number(e.target.value))}
                                    className="w-20 px-2 py-1 border rounded text-slate-900 font-medium" />
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex flex-col space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Div. Rate:</span>
                                        <span className={`text-xs font-bold ${stream.recovery_percentage >= 40 ? 'text-green-600' : 'text-slate-500'}`}>{stream.recovery_percentage}%</span>
                                    </div>
                                    <input type="range" min="0" max="100" step="5" value={stream.recovery_percentage}
                                      onChange={(e) => updateStream(stream.material_id, 'recovery_percentage', Number(e.target.value))}
                                      className="h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
                                    <select className="text-xs border rounded p-1" value={stream.disposal_method}
                                        onChange={(e) => updateStream(stream.material_id, 'disposal_method', e.target.value)}>
                                        <option value="Landfill">Landfill</option>
                                        <option value="Recycle">Recycle</option>
                                        <option value="Reuse">Reuse</option>
                                    </select>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button onClick={() => removeStream(stream.material_id)} className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-slate-100">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                              </td>
                            </tr>
                          );
                       })}
                    </tbody>
                  </table>
                </div>
                {/* Add Stream Button */}
                <div className="p-4 border-t border-slate-100 bg-white">
                  <button 
                    onClick={addStream}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition-all flex items-center justify-center font-medium text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Material Stream
                  </button>
                </div>
              </>
            )}

            {/* TAB: BIM INTEGRATOR */}
            {activeTab === 'bim' && (
              <div className="flex-1 flex flex-col p-8">
                 <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 text-center mb-6">
                    <Box className="w-12 h-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">Upload BIM Model</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                      Upload your Revit export or IFC file to extract accurate material quantities and waste forecasts.
                    </p>
                    <button 
                      onClick={handleBimUpload}
                      disabled={isProcessingBim}
                      className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center"
                    >
                      {isProcessingBim ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                      {isProcessingBim ? 'Extracting Data...' : 'Select IFC / CSV File'}
                    </button>
                 </div>

                 {bimMaterials.length > 0 && (
                   <div className="flex-1 overflow-hidden flex flex-col animate-fade-in">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-slate-800">Extracted Quantities</h3>
                         <button 
                           onClick={syncBimToEdge}
                           className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                         >
                           Import to EDGE Calculator
                         </button>
                      </div>
                      <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                              <th className="px-4 py-2">BIM Element</th>
                              <th className="px-4 py-2">Quantity</th>
                              <th className="px-4 py-2">EDGE Map</th>
                              <th className="px-4 py-2">Est. Waste</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {bimMaterials.map(m => (
                               <tr key={m.id}>
                                  <td className="px-4 py-2 font-medium">{m.element_name}</td>
                                  <td className="px-4 py-2 text-slate-500 font-mono">{m.bim_quantity} {m.unit}</td>
                                  <td className="px-4 py-2"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{m.edge_category}</span></td>
                                  <td className="px-4 py-2 text-amber-600">{m.estimated_waste_rate}%</td>
                               </tr>
                             ))}
                          </tbody>
                        </table>
                      </div>
                   </div>
                 )}
              </div>
            )}

            {/* TAB: DEEP PLAN SCANNER */}
            {activeTab === 'plan' && (
              <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                 <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl mb-6 shadow-md">
                    <div className="flex items-start justify-between">
                       <div>
                          <h3 className="text-lg font-bold flex items-center mb-1">
                             <ScanLine className="w-5 h-5 mr-2 text-green-400" /> Deep Plan Scanner
                          </h3>
                          <p className="text-slate-300 text-sm max-w-lg">
                             Upload an architectural floor plan or section. Our AI Consultant will analyze it to suggest 
                             strategies for <strong>Water (>30%)</strong> and <strong>Energy (>30%)</strong> reduction, plus <strong>Zero Carbon</strong> material alternatives.
                          </p>
                       </div>
                       <label className="flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 transition-colors border border-white/20 rounded-lg p-3 cursor-pointer w-24 h-24">
                          {planImage ? (
                             <img src={planImage} alt="Plan" className="w-full h-full object-cover rounded" />
                          ) : (
                             <div className="flex flex-col items-center text-slate-300">
                                <ImageIcon className="w-6 h-6 mb-1" />
                                <span className="text-[10px]">Upload Plan</span>
                             </div>
                          )}
                          <input type="file" onChange={handlePlanUpload} accept="image/*" className="hidden" />
                       </label>
                    </div>
                    {planImage && (
                       <div className="mt-4 flex justify-end">
                          <button 
                            onClick={runPlanScan}
                            disabled={isScanningPlan}
                            className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center transition-all disabled:opacity-50"
                          >
                             {isScanningPlan ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ScanLine className="w-4 h-4 mr-2" />}
                             {isScanningPlan ? 'Analyzing Architecture...' : 'Scan for Net Zero'}
                          </button>
                       </div>
                    )}
                 </div>

                 {/* Analysis Result */}
                 {planAnalysis ? (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in overflow-hidden flex flex-col">
                       <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center border-b border-slate-100 pb-2">
                          <Brain className="w-5 h-5 mr-2 text-purple-600" /> Net Zero Readiness Report
                       </h3>
                       <div className="prose prose-sm prose-slate max-w-none flex-1 overflow-y-auto">
                          <div className="whitespace-pre-wrap">{planAnalysis}</div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50">
                       <ScanLine className="w-12 h-12 mb-3 opacity-20" />
                       <p className="text-sm">Upload a plan and scan to view the Net Zero strategy report.</p>
                    </div>
                 )}
              </div>
            )}

            {/* TAB: AUDITOR GUIDANCE */}
            {activeTab === 'auditor' && (
              <div className="flex-1 flex flex-col">
                 <div className="p-6 bg-slate-900 text-white">
                    <h3 className="text-lg font-bold flex items-center mb-2">
                       <ShieldCheck className="w-5 h-5 mr-2" /> Auditor Guidance (v3.0)
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                       Standardized protocols based on Auditor Guidance Part 8.
                    </p>
                    <div className="relative">
                       <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                       <input 
                         type="text" 
                         placeholder="Search audit topics (e.g. 'Sample', 'Remote')..." 
                         value={qaSearch}
                         onChange={e => setQaSearch(e.target.value)}
                         className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500"
                       />
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <SamplingCalculator />
                    <div className="space-y-4">
                       {AUDITOR_QA.filter(qa => qa.q.toLowerCase().includes(qaSearch.toLowerCase()) || qa.a.toLowerCase().includes(qaSearch.toLowerCase())).map((qa, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                             <h4 className="font-bold text-slate-900 mb-3 flex items-start">
                                <HelpCircle className="w-4 h-4 text-green-600 mt-1 mr-2 shrink-0" />
                                {qa.q}
                             </h4>
                             <div className="pl-6 border-l-2 border-slate-100 text-slate-600 text-sm leading-relaxed">
                                {qa.a}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {/* TAB: AUDIT TRAIL */}
            {activeTab === 'trail' && (
                <div className="flex-1 flex flex-col p-6 bg-slate-50 overflow-y-auto">
                    <AuditTrail />
                </div>
            )}

            {/* FOOTER: EVIDENCE UPLOAD (Always visible on Calculator/Auditor) */}
            {activeTab !== 'bim' && activeTab !== 'plan' && activeTab !== 'trail' && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                     <div className="p-2 bg-white border border-slate-200 rounded text-slate-400">
                        <UploadCloud className="w-4 h-4" />
                     </div>
                     <div>
                        <p className="text-sm font-medium text-slate-800">Compliance Evidence</p>
                        <p className="text-xs text-slate-500">Weighbridge tickets & recycling certs required for audit.</p>
                     </div>
                  </div>
                  <button 
                     onClick={handleManageDocs}
                     className="text-xs bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded font-medium text-slate-700"
                  >
                     Manage Documents ({evidenceCount}/4)
                  </button>
              </div>
            )}
         </div>

         {/* RIGHT PANEL: ADVISORY (Always visible) */}
         <div className="flex flex-col space-y-4 h-full overflow-hidden">
            {/* Rule-Based Alerts */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
               <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center">
                 <Lock className="w-3 h-3 mr-1" /> Auditor Rules
               </h4>
               <div className="space-y-2">
                  {score < 20 && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
                       <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 shrink-0" />
                       <div className="text-xs text-red-800">
                         <strong>Certification Risk:</strong><br/>Efficiency must be > 20%. Current strategy fails.
                       </div>
                    </div>
                  )}
                  {streams.find(s => s.material_type === 'Concrete' && s.recovery_percentage < 40) && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start">
                       <TrafficCone className="w-4 h-4 text-amber-600 mt-0.5 mr-2 shrink-0" />
                       <div className="text-xs text-amber-800">
                         <strong>Concrete Alert:</strong><br/>Recovery &lt; 40%. Consider on-site crushing for sub-base.
                       </div>
                    </div>
                  )}
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
                       <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 shrink-0" />
                       <div className="text-xs text-blue-800">
                         <strong>v3.0 Sampling:</strong><br/>For apartments, ensure sample size = √N + 1.
                       </div>
                  </div>
               </div>
            </div>

            {/* AI Advisor Panel */}
            <div className="flex-1 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                     <Brain className="w-4 h-4 text-purple-400" />
                     <span className="font-bold text-sm">Auditor Engine</span>
                  </div>
                  <button onClick={runAdvisory} disabled={loadingAdvisory}
                    className="text-xs bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded text-white disabled:opacity-50">
                    {loadingAdvisory ? 'Analyzing...' : 'Run Audit'}
                  </button>
               </div>
               <div className="flex-1 p-4 overflow-y-auto text-sm text-slate-300 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                  {loadingAdvisory ? (
                     <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-70">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        <p className="text-center text-xs">Simulating IFC EDGE Audit (v3.0)...</p>
                     </div>
                  ) : advisory ? (
                     <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                        {advisory}
                     </div>
                  ) : (
                     <div className="text-center pt-8 opacity-50 px-4">
                        <p className="text-xs">Run analysis to generate a strategic v3.0 Auditor Report.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DigitalEDGE;
