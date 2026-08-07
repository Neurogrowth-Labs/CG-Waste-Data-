import React, { useState } from 'react';
import {
  Camera, MapPin, Truck, Radio, CheckCircle, AlertTriangle, Play, Smartphone,
  Loader2, Sparkles, Send, Database, Recycle, Shield, Route
} from 'lucide-react';
import { classifyWasteMaterial } from '../services/geminiService';
import { WasteDataStructure } from '../lib/wasteData';
import { OsrmMapEngine } from './OsrmMapEngine';
import { BiometricStudio } from './BiometricStudio';

export default function FieldOperations() {
  const [activeTab, setActiveTab] = useState<'capture' | 'iot' | 'biometric'>('capture');

  // Waste Tracker Integration
  const [inputText, setInputText] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [classifiedWaste, setClassifiedWaste] = useState<WasteDataStructure[] | null>(null);

  const handleClassify = async () => {
    if (!inputText.trim()) return;
    setIsClassifying(true);
    try {
      const results = await classifyWasteMaterial(inputText);
      setClassifiedWaste(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Field Operations & Access Tools</h2>
          <p className="text-slate-500">Smart Site Diagnostics, OSRM Haulage Map Routing, and Multi-Modal Biometric Gate Security.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('capture')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'capture' ? 'border-green-600 text-green-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Smartphone className="w-4 h-4 inline mr-2" />
          AI Waste Diagnostics Logger
        </button>
        <button
          onClick={() => setActiveTab('iot')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'iot' ? 'border-green-600 text-green-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Route className="w-4 h-4 inline mr-2 text-[#0B8F6C]" />
          OSRM Route Logistics & Map Engine
        </button>
        <button
          onClick={() => setActiveTab('biometric')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === 'biometric' ? 'border-green-600 text-green-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2 text-indigo-600" />
          Biometric Multi-Modal Gate Access
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'capture' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-6">

            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center">
                 <Sparkles className="w-5 h-5 mr-2 text-indigo-600" /> Auto-Classifier
              </h3>
              <p className="text-sm text-slate-500 mb-6">Describe the demolition output or scan debris to automatically split, categorize, and route to marketplace/recyclers.</p>

              <div className="flex-1 flex flex-col">
                <textarea
                  className="w-full border border-slate-300 rounded-xl p-4 flex-1 resize-none outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium text-slate-700"
                  placeholder="E.g. '50 tons of concrete rubble mixed with steel rebar and some wood scaffolding from site sectors 4'"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                <button
                  onClick={handleClassify}
                  disabled={isClassifying || !inputText.trim()}
                  className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-medium shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClassifying ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing Neural Scan...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Analyze & Categorize Stream</>
                  )}
                </button>
              </div>

               <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                 <span className="flex items-center"><Camera className="w-3 h-3 mr-1"/> Vision API Ready</span>
                 <span className="flex items-center"><Database className="w-3 h-3 mr-1"/> 19 Classes Mapped</span>
               </div>
            </div>

            <div className="lg:col-span-2 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col">
               <div className="bg-slate-800 p-4 shrink-0 flex justify-between items-center text-white">
                 <h3 className="font-bold flex items-center text-sm"><Recycle className="w-4 h-4 mr-2 text-green-400" /> Platform Multi-Pathway Routing</h3>
                 {classifiedWaste && <span className="bg-indigo-600/30 border border-indigo-400/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-mono">Found {classifiedWaste.length} Streams</span>}
               </div>

               <div className="flex-1 overflow-y-auto p-6">
                 {!classifiedWaste && !isClassifying && (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                      <Recycle className="w-16 h-16 mb-4 text-slate-400" />
                      <p className="font-medium text-slate-600 text-lg">Awaiting Site Manager Input</p>
                      <p className="text-sm text-slate-500 max-w-sm text-center mt-2">Log site waste records to classify, quantify, predict impact and redirect immediately.</p>
                    </div>
                 )}

                 {isClassifying && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <Sparkles className="w-6 h-6 text-emerald-500 absolute -top-2 -right-2 animate-pulse" />
                      </div>
                      <p className="font-medium text-slate-600 mt-6 animate-pulse">Running Multi-Material Classification...</p>
                    </div>
                 )}

                 {classifiedWaste && !isClassifying && (
                     <div className="space-y-4">
                       {classifiedWaste.map((cw, idx) => (
                         <div key={idx} className="bg-white border text-left border-slate-200 hover:border-slate-300 transition-all rounded-xl p-5 shadow-sm relative overflow-hidden">
                            {cw.Hazard_Level === 'Critical' || cw.Hazard_Level === 'High' ? (
                              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl-xl shadow-sm flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-1" /> {cw.Hazard_Level} Hazard
                              </div>
                            ) : (
                              <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl-xl shadow-sm flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" /> Safe
                              </div>
                            )}

                            <div className="flex justify-between items-start mb-4 pr-24">
                               <div>
                                 <h4 className="text-lg font-bold text-slate-900">{cw.Sub_Type || cw.Type}</h4>
                                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono mt-1 inline-block border border-slate-200">{cw.Category}</span>
                               </div>
                               <div className="text-right">
                                  <strong className="block text-2xl font-bold text-indigo-700">{cw.Quantity}</strong>
                                  <span className="text-xs text-slate-500 uppercase tracking-wide">Tons (Est.)</span>
                               </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Recyclability</span>
                                <span className={`text-sm font-semibold ${cw.Recyclability_Score === 'High' ? 'text-emerald-600' : cw.Recyclability_Score === 'Medium' ? 'text-amber-600' : 'text-red-500'}`}>{cw.Recyclability_Score}</span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Reuse Potential</span>
                                <span className={`text-sm font-semibold ${cw.Reuse_Potential === 'High' ? 'text-emerald-600' : cw.Reuse_Potential === 'Medium' ? 'text-amber-600' : 'text-slate-600'}`}>{cw.Reuse_Potential}</span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Carbon Impact</span>
                                <span className="text-sm font-semibold text-slate-700">{cw.Carbon_Impact ? `${cw.Carbon_Impact} kgCO2e` : 'Calc..'}</span>
                              </div>
                            </div>

                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex justify-between items-center">
                               <div>
                                 <span className="block text-[10px] uppercase font-bold text-indigo-500 tracking-wider mb-1">AI Recommendation</span>
                                 <p className="text-sm font-medium text-indigo-900">{cw.Disposal_Option}</p>
                               </div>
                               <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex shrink-0 ml-4 items-center">
                                 Redirect <Truck className="w-4 h-4 ml-2" />
                               </button>
                            </div>
                         </div>
                       ))}
                     </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {/* OSRM MAP & LOGISTICS ENGINE */}
        {activeTab === 'iot' && (
          <div className="pb-6">
            <OsrmMapEngine />
          </div>
        )}

        {/* BIOMETRIC MULTI-MODAL GATE CONTROL */}
        {activeTab === 'biometric' && (
          <div className="pb-6">
            <BiometricStudio />
          </div>
        )}
      </div>
    </div>
  );
}
