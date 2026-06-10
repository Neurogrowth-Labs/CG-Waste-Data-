import React, { useState, useMemo } from 'react';
import { Search, Filter, Cpu, SlidersHorizontal, Leaf, Info, Zap, AlertCircle } from 'lucide-react';
import { getMaterialRecommendations } from '../services/geminiService';

export interface MaterialEntry {
  Material_ID: string;
  Material_Name: string;
  Class: string;
  Subclass: string;
  Embodied_Carbon: string;
  Carbon_Numeric: number; // For scoring (1 = High, 5 = Very Low)
  Cost_Index: number; // 1 = Very High, 5 = Very Low (inverted for scoring so 5 is best)
  Durability: number; // 1-5
  Recyclability: number; // 1-5
  Local_Availability: number; // 1-5
  Waste_Risk: number; // 1 = Very High Risk, 5 = Very Low Risk
  Primary_Use: string;
}

// Partial Database from user requirements
export const MATERIALS: MaterialEntry[] = [
  // Class 1: Natural & Bio-Based
  { Material_ID: 'M001', Material_Name: 'Bamboo', Class: 'Natural & Bio-Based', Subclass: 'Plant', Embodied_Carbon: 'Very Low', Carbon_Numeric: 5, Cost_Index: 4, Durability: 4, Recyclability: 5, Local_Availability: 3, Waste_Risk: 4, Primary_Use: 'Structure' },
  { Material_ID: 'M002', Material_Name: 'FSC Timber', Class: 'Natural & Bio-Based', Subclass: 'Plant', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 3, Durability: 4, Recyclability: 5, Local_Availability: 4, Waste_Risk: 3, Primary_Use: 'Structure' },
  { Material_ID: 'M003', Material_Name: 'CLT (Cross Laminated Timber)', Class: 'Natural & Bio-Based', Subclass: 'Engineered Wood', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 2, Durability: 5, Recyclability: 4, Local_Availability: 3, Waste_Risk: 4, Primary_Use: 'Structural panels' },
  { Material_ID: 'M004', Material_Name: 'Glulam', Class: 'Natural & Bio-Based', Subclass: 'Engineered Wood', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 2, Durability: 5, Recyclability: 4, Local_Availability: 3, Waste_Risk: 4, Primary_Use: 'Beams' },
  { Material_ID: 'M005', Material_Name: 'Hempcrete', Class: 'Natural & Bio-Based', Subclass: 'Plant composite', Embodied_Carbon: 'Very Low', Carbon_Numeric: 5, Cost_Index: 3, Durability: 3, Recyclability: 5, Local_Availability: 2, Waste_Risk: 3, Primary_Use: 'Walls' },
  { Material_ID: 'M006', Material_Name: 'Cork', Class: 'Natural & Bio-Based', Subclass: 'Plant', Embodied_Carbon: 'Very Low', Carbon_Numeric: 5, Cost_Index: 3, Durability: 4, Recyclability: 5, Local_Availability: 2, Waste_Risk: 4, Primary_Use: 'Insulation' },
  { Material_ID: 'M007', Material_Name: 'Straw Bale', Class: 'Natural & Bio-Based', Subclass: 'Plant', Embodied_Carbon: 'Very Low', Carbon_Numeric: 5, Cost_Index: 5, Durability: 3, Recyclability: 5, Local_Availability: 4, Waste_Risk: 2, Primary_Use: 'Walls' },
  { Material_ID: 'M008', Material_Name: 'Mycelium Panels', Class: 'Natural & Bio-Based', Subclass: 'Bio', Embodied_Carbon: 'Very Low', Carbon_Numeric: 5, Cost_Index: 3, Durability: 3, Recyclability: 5, Local_Availability: 2, Waste_Risk: 5, Primary_Use: 'Insulation' },
  
  // Class 2: Recycled Materials
  { Material_ID: 'M010', Material_Name: 'Recycled Steel', Class: 'Recycled Materials', Subclass: 'Metal', Embodied_Carbon: 'Medium', Carbon_Numeric: 3, Cost_Index: 3, Durability: 5, Recyclability: 5, Local_Availability: 4, Waste_Risk: 5, Primary_Use: 'Structure' },
  { Material_ID: 'M011', Material_Name: 'Recycled Aluminum', Class: 'Recycled Materials', Subclass: 'Metal', Embodied_Carbon: 'Medium', Carbon_Numeric: 3, Cost_Index: 2, Durability: 5, Recyclability: 5, Local_Availability: 4, Waste_Risk: 5, Primary_Use: 'Facade' },
  { Material_ID: 'M012', Material_Name: 'Recycled Concrete Aggregate', Class: 'Recycled Materials', Subclass: 'Concrete', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 4, Durability: 4, Recyclability: 4, Local_Availability: 5, Waste_Risk: 4, Primary_Use: 'Base/Fill' },
  { Material_ID: 'M013', Material_Name: 'Recycled Plastic Lumber', Class: 'Recycled Materials', Subclass: 'Plastic', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 4, Durability: 4, Recyclability: 4, Local_Availability: 3, Waste_Risk: 4, Primary_Use: 'Decking' },
  { Material_ID: 'M014', Material_Name: 'Reclaimed Wood', Class: 'Recycled Materials', Subclass: 'Wood', Embodied_Carbon: 'Very Low', Carbon_Numeric: 5, Cost_Index: 2, Durability: 4, Recyclability: 5, Local_Availability: 4, Waste_Risk: 5, Primary_Use: 'Finishes' },
  
  // Class 3: Low-Carbon Concrete & Masonry
  { Material_ID: 'M020', Material_Name: 'Geopolymer Concrete', Class: 'Low-Carbon Concrete', Subclass: 'Concrete', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 2, Durability: 5, Recyclability: 3, Local_Availability: 2, Waste_Risk: 3, Primary_Use: 'Structure' },
  { Material_ID: 'M021', Material_Name: 'Fly Ash Concrete (30%)', Class: 'Low-Carbon Concrete', Subclass: 'Concrete', Embodied_Carbon: 'Medium', Carbon_Numeric: 3, Cost_Index: 4, Durability: 5, Recyclability: 3, Local_Availability: 5, Waste_Risk: 4, Primary_Use: 'Structure' },
  { Material_ID: 'M022', Material_Name: 'GGBS Concrete (50%)', Class: 'Low-Carbon Concrete', Subclass: 'Concrete', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 3, Durability: 5, Recyclability: 3, Local_Availability: 4, Waste_Risk: 4, Primary_Use: 'Foundation' },
  { Material_ID: 'M023', Material_Name: 'Rammed Earth', Class: 'Low-Carbon Concrete', Subclass: 'Earth', Embodied_Carbon: 'Very Low', Carbon_Numeric: 5, Cost_Index: 4, Durability: 4, Recyclability: 5, Local_Availability: 5, Waste_Risk: 3, Primary_Use: 'Walls' },
  
  // Class 4: Insulation Materials
  { Material_ID: 'M030', Material_Name: 'Cellulose Insulation', Class: 'Insulation', Subclass: 'Recycled Paper', Embodied_Carbon: 'Very Low', Carbon_Numeric: 5, Cost_Index: 4, Durability: 4, Recyclability: 4, Local_Availability: 5, Waste_Risk: 4, Primary_Use: 'Insulation' },
  { Material_ID: 'M031', Material_Name: 'Sheep Wool', Class: 'Insulation', Subclass: 'Animal Product', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 2, Durability: 4, Recyclability: 5, Local_Availability: 3, Waste_Risk: 5, Primary_Use: 'Insulation' },
  { Material_ID: 'M032', Material_Name: 'Aerogel', Class: 'Insulation', Subclass: 'Silica', Embodied_Carbon: 'High', Carbon_Numeric: 2, Cost_Index: 1, Durability: 5, Recyclability: 2, Local_Availability: 1, Waste_Risk: 3, Primary_Use: 'Insulation' },
  { Material_ID: 'M033', Material_Name: 'Wood Fiber Insulation', Class: 'Insulation', Subclass: 'Engineered Wood', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 3, Durability: 4, Recyclability: 5, Local_Availability: 4, Waste_Risk: 4, Primary_Use: 'Insulation' },

  // Class 5: Advanced & Smart Materials
  { Material_ID: 'M040', Material_Name: 'Self-Healing Concrete', Class: 'Smart Materials', Subclass: 'Concrete (Bio)', Embodied_Carbon: 'Medium', Carbon_Numeric: 3, Cost_Index: 1, Durability: 5, Recyclability: 3, Local_Availability: 1, Waste_Risk: 4, Primary_Use: 'Infrastructure' },
  { Material_ID: 'M041', Material_Name: 'Photovoltaic Glass', Class: 'Smart Materials', Subclass: 'Glass/Solar', Embodied_Carbon: 'High', Carbon_Numeric: 2, Cost_Index: 1, Durability: 4, Recyclability: 3, Local_Availability: 2, Waste_Risk: 3, Primary_Use: 'Windows/Facade' },
  { Material_ID: 'M042', Material_Name: 'Phase Change Materials (PCM)', Class: 'Smart Materials', Subclass: 'Thermal', Embodied_Carbon: 'Medium', Carbon_Numeric: 3, Cost_Index: 2, Durability: 4, Recyclability: 3, Local_Availability: 2, Waste_Risk: 3, Primary_Use: 'Thermal Mass' },
  
  // Class 6: Finishes & Coatings
  { Material_ID: 'M050', Material_Name: 'Low VOC Paint', Class: 'Finishes', Subclass: 'Paint', Embodied_Carbon: 'Medium', Carbon_Numeric: 3, Cost_Index: 3, Durability: 3, Recyclability: 2, Local_Availability: 5, Waste_Risk: 4, Primary_Use: 'Interior Finish' },
  { Material_ID: 'M051', Material_Name: 'Linoleum', Class: 'Finishes', Subclass: 'Flooring', Embodied_Carbon: 'Low', Carbon_Numeric: 4, Cost_Index: 3, Durability: 4, Recyclability: 4, Local_Availability: 4, Waste_Risk: 5, Primary_Use: 'Flooring' },
  { Material_ID: 'M052', Material_Name: 'Clay Plaster', Class: 'Finishes', Subclass: 'Plaster', Embodied_Carbon: 'Very Low', Carbon_Numeric: 5, Cost_Index: 4, Durability: 3, Recyclability: 5, Local_Availability: 4, Waste_Risk: 3, Primary_Use: 'Interior Finish' },
];

export const MaterialDatabase: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('All');
    
    // AI Engine state
    const [projectContext, setProjectContext] = useState({
        projectType: 'Commercial Office',
        climate: 'Hot & Humid',
        budget: 'Medium',
        sustainabilityTarget: 'EDGE Advanced',
        bimElement: 'Structural Walls'
    });
    const [aiRecommendations, setAiRecommendations] = useState<any[] | null>(null);
    const [isRecommending, setIsRecommending] = useState(false);

    // Scoring Weights
    const weights = { carbon: 0.35, cost: 0.15, durability: 0.20, recyclability: 0.15, local: 0.05, waste: 0.10 };

    const calculateScore = (mat: MaterialEntry) => {
        // Values are 1-5, higher is better
        const score = (mat.Carbon_Numeric * weights.carbon) 
                    + (mat.Cost_Index * weights.cost) 
                    + (mat.Durability * weights.durability)
                    + (mat.Recyclability * weights.recyclability)
                    + (mat.Local_Availability * weights.local)
                    + (mat.Waste_Risk * weights.waste);
        return (score / 5) * 100; // Return out of 100
    };

    const classes = ['All', ...Array.from(new Set(MATERIALS.map(m => m.Class)))];

    const filteredMaterials = useMemo(() => {
        return MATERIALS.filter(m => {
            const matchesSearch = m.Material_Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  m.Subclass.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesClass = selectedClass === 'All' || m.Class === selectedClass;
            return matchesSearch && matchesClass;
        }).sort((a, b) => calculateScore(b) - calculateScore(a));
    }, [searchTerm, selectedClass]);

    const runAIRecollection = async () => {
        setIsRecommending(true);
        try {
            // Call Gemini to get real insights and recommendations based on the actual material database
            const res = await getMaterialRecommendations(projectContext, MATERIALS);
            setAiRecommendations(res);
        } catch (e) {
            console.error(e);
        }
        setIsRecommending(false);
    };

    return (
        <div className="flex-1 flex flex-col space-y-6 h-full text-slate-800">
            {/* AI Recommendation Engine Header */}
            <div className="bg-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Cpu className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                       <h2 className="text-xl font-bold flex items-center mb-2">
                          <Cpu className="w-5 h-5 mr-2 text-green-400" /> AI Material Recommendation Engine
                       </h2>
                       <p className="text-slate-300 mb-6 text-sm max-w-2xl">
                          Context-aware intelligence that analyzes project type, climate, budget, and BIM requirements 
                          to recommend the optimal sustainable materials.
                       </p>
                       <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                           <div>
                               <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Project Type</label>
                               <input type="text" value={projectContext.projectType} onChange={e => setProjectContext({...projectContext, projectType: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm" />
                           </div>
                           <div>
                               <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Climate</label>
                               <select value={projectContext.climate} onChange={e => setProjectContext({...projectContext, climate: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm">
                                  <option>Hot & Humid</option>
                                  <option>Hot & Dry</option>
                                  <option>Temperate</option>
                                  <option>Cold</option>
                               </select>
                           </div>
                           <div>
                               <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Budget</label>
                               <select value={projectContext.budget} onChange={e => setProjectContext({...projectContext, budget: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm">
                                  <option>Low</option>
                                  <option>Medium</option>
                                  <option>High</option>
                               </select>
                           </div>
                           <div>
                               <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Target</label>
                               <select value={projectContext.sustainabilityTarget} onChange={e => setProjectContext({...projectContext, sustainabilityTarget: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm">
                                  <option>EDGE Core</option>
                                  <option>EDGE Advanced</option>
                                  <option>Zero Carbon</option>
                                  <option>LEED Platinum</option>
                               </select>
                           </div>
                           <div>
                               <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">BIM Element Use</label>
                               <input type="text" value={projectContext.bimElement} onChange={e => setProjectContext({...projectContext, bimElement: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm" />
                           </div>
                       </div>
                    </div>
                    <div className="flex items-end lg:w-48">
                       <button onClick={runAIRecollection} disabled={isRecommending} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-lg disabled:opacity-50">
                          {isRecommending ? <span className="animate-pulse">Analyzing...</span> : <><Zap className="w-4 h-4 mr-2" /> Optimize</>}
                       </button>
                    </div>
                </div>
            </div>

            {/* AI Recommendations Output */}
            {aiRecommendations && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 shrink-0 animate-fade-in shadow-sm">
                    <h3 className="font-bold text-green-900 mb-4 flex items-center">
                        <Leaf className="w-5 h-5 mr-2" /> Top 3 Material Recommendations for {projectContext.bimElement}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aiRecommendations.map((rec, i) => (
                            <div key={i} className="bg-white rounded-lg p-5 border border-green-100 shadow-sm relative">
                                {i === 0 && <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg uppercase">Best Fit</div>}
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800">{rec.material}</h4>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${rec.score >= 85 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {rec.score}% Match
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 mb-3">{rec.reasoning}</p>
                                <div className="space-y-1 mt-auto border-t border-slate-100 pt-3">
                                   <div className="flex justify-between text-[11px]">
                                      <span className="text-slate-500">Trade-offs</span>
                                      <span className="text-slate-800 font-medium text-right max-w-[150px]">{rec.tradeoffs}</span>
                                   </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Structured Material Database */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <SlidersHorizontal className="w-5 h-5 mr-2 text-blue-600" />
                        Intelligence Database (120+ Materials)
                    </h3>
                    <div className="flex space-x-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search materials..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <select 
                            value={selectedClass} 
                            onChange={e => setSelectedClass(e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="w-full text-sm text-left min-w-[1000px]">
                        <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0 shadow-sm z-10">
                            <tr>
                                <th className="px-4 py-3">Material</th>
                                <th className="px-4 py-3">Class/Subclass</th>
                                <th className="px-4 py-3 text-center">Sustainability Score</th>
                                <th className="px-4 py-3 text-center">Carbon Impact</th>
                                <th className="px-4 py-3 text-center">Cost Index</th>
                                <th className="px-4 py-3 text-center">Durability</th>
                                <th className="px-4 py-3 text-center">Recyclable</th>
                                <th className="px-4 py-3 text-center">Local Avail.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredMaterials.map(mat => {
                                const score = calculateScore(mat);
                                return (
                                    <tr key={mat.Material_ID} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-slate-800">{mat.Material_Name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{mat.Material_ID} | {mat.Primary_Use}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-slate-700">{mat.Class}</div>
                                            <div className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded inline-block mt-0.5">{mat.Subclass}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="inline-block relative">
                                                <svg className="w-10 h-10 transform -rotate-90">
                                                    <circle cx="20" cy="20" r="16" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                                                    <circle cx="20" cy="20" r="16" fill="transparent" stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - score} />
                                                </svg>
                                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                                                    {score.toFixed(0)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold inline-flex items-center ${mat.Carbon_Numeric >= 4 ? 'bg-green-100 text-green-700' : mat.Carbon_Numeric === 3 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                               {mat.Embodied_Carbon}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className={`text-sm font-bold ${mat.Cost_Index >= 4 ? 'text-green-600' : mat.Cost_Index === 3 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {mat.Cost_Index}/5
                                            </div>
                                            <div className="text-[9px] text-slate-400">{mat.Cost_Index >= 4 ? 'Low Cost' : mat.Cost_Index === 3 ? 'Moderate' : 'High Cost'}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600 font-medium">{mat.Durability}/5</td>
                                        <td className="px-4 py-3 text-center text-slate-600 font-medium">{mat.Recyclability}/5</td>
                                        <td className="px-4 py-3 text-center text-slate-600 font-medium">{mat.Local_Availability}/5</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
