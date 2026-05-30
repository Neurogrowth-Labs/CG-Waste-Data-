import React, { useState } from 'react';
import { GraduationCap, PlayCircle, Award, BookOpen, Globe2, BarChart3, Users } from 'lucide-react';

export default function EducationHub() {
  const [activeTab, setActiveTab] = useState<'courses' | 'public'>('courses');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Education & Awareness</h2>
          <p className="text-slate-500">Sustainability Learning Hub & Public Transparency Dashboard.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors flex items-center ${
            activeTab === 'courses' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4 inline mr-2" />
          Sustainability Learning Hub
        </button>
        <button
          onClick={() => setActiveTab('public')}
          className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors flex items-center ${
            activeTab === 'public' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Globe2 className="w-4 h-4 inline mr-2" />
          Public Awareness Dashboard
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'courses' ? (
           <div className="space-y-8">
              {/* Featured Course */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
                 <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
                 <div className="z-10 md:w-2/3">
                    <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-500/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">Featured Certification</span>
                    <h3 className="text-2xl font-bold mb-3">African Green Construction Standards 2026</h3>
                    <p className="text-indigo-200 text-sm mb-6 max-w-lg">Master the latest compliance metrics, material lifecycle analysis, and circular economy principles tailored for rapid urbanization in emerging markets.</p>
                    <button className="bg-white text-indigo-900 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center hover:bg-indigo-50 transition-colors">
                       <PlayCircle className="w-5 h-5 mr-2" /> Start Course
                    </button>
                 </div>
                 <div className="hidden md:flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm relative z-10 w-48">
                    <Award className="w-12 h-12 text-yellow-400 mb-2" />
                    <span className="text-xs text-center font-medium">Earn Official CPD Points</span>
                 </div>
              </div>

              {/* Course Grid */}
              <div>
                 <h4 className="font-bold text-slate-800 mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-indigo-600" /> Professional Case Studies & Modules</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Designing for Deconstruction', duration: '2 Hrs', modules: 4, level: 'Advanced' },
                      { title: 'IoT Waste Tracking Basics', duration: '45 Min', modules: 2, level: 'Beginner' },
                      { title: 'Global Circular Networks', duration: '1.5 Hrs', modules: 3, level: 'Intermediate' }
                    ].map((course, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
                         <h5 className="font-semibold text-slate-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors">{course.title}</h5>
                         <div className="flex space-x-4 text-xs text-slate-500 mb-4">
                            <span>{course.duration}</span>
                            <span>•</span>
                            <span>{course.modules} Modules</span>
                            <span>•</span>
                            <span>{course.level}</span>
                         </div>
                         <div className="w-full bg-slate-100 rounded-full h-1 mb-2">
                           <div className="bg-indigo-500 h-1 rounded-full w-0 group-hover:w-1/4 transition-all duration-500"></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        ) : (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-emerald-900 to-slate-900 rounded-xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
                 <div className="z-10 text-center">
                    <Globe2 className="w-12 h-12 text-emerald-400 mx-auto mb-4 opacity-80" />
                    <h3 className="text-3xl font-bold mb-2">City-Level Sustainability Performance</h3>
                    <p className="text-emerald-100/70 max-w-xl mx-auto">Providing transparent, real-time insights to citizens on construction waste reduction and circular economy progress.</p>
                 </div>
                 {/* Abstract Globe BG */}
                 <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none mix-blend-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjE4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjQgNCIvPjwvc3ZnPg==')] bg-no-repeat bg-right-center"></div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
                 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                 </div>
                 <div>
                    <h4 className="text-2xl font-bold text-slate-800">42,500 Tons</h4>
                    <p className="text-sm text-slate-500">Waste Diverted from Landfill (City-wide YTD)</p>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                    <h4 className="text-2xl font-bold text-slate-800">18 Active Projects</h4>
                    <p className="text-sm text-slate-500">Registered Green Construction Zones</p>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
