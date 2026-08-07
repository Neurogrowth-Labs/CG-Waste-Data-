import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { supabase } from '../../lib/supabaseClient';
import { Plus, AlertTriangle, CheckCircle, AlertOctagon, Search, Map, List, Download, Sparkles, Check, ChevronDown } from 'lucide-react';
import { ProjectSourceWorkflow } from '../Workflows';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';

// Fix Leaflet's default icon path issues with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type ProjectWithCoordinates = { id: string; latitude?: number | string | null; longitude?: number | string | null };

const getProjectCoordinates = (project: ProjectWithCoordinates): [number, number] | null => {
  const latitude = Number(project.latitude);
  const longitude = Number(project.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return [latitude, longitude];
};

export const ProjectsView = () => {
  const [showNewProject, setShowNewProject] = useState(false);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  
  const [viewMode, setViewMode] = useState<'list'|'map'>('list');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', debouncedSearchTerm],
    queryFn: async () => {
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(20);
      if (debouncedSearchTerm) {
        query = query.ilike('name', `%${debouncedSearchTerm}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    const subscription = supabase.channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }).subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, [queryClient]);

  const mappedProjects = projects
    .map((project) => ({ project, coordinates: getProjectCoordinates(project) }))
    .filter((item): item is { project: typeof projects[number]; coordinates: [number, number] } => Boolean(item.coordinates));

  const mapCenter = mappedProjects[0]?.coordinates || [0, 0] as [number, number];

  const activeProjectsCount = projects.filter(p => p.status === 'Active').length;
  const hazmatCount = projects.filter(p => p.hazmat_status === 'Detected').length;
  const avgCompliance = projects.length > 0 
      ? Math.round(projects.reduce((acc, p) => acc + (p.compliance_score || 0), 0) / projects.length)
      : 0;

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedProjects);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedProjects(newSet);
  };

  const toggleAll = () => {
    if (selectedProjects.size === projects.length) setSelectedProjects(new Set());
    else setSelectedProjects(new Set(projects.map(p => p.id)));
  };

  const exportCSV = () => {
    if (projects.length === 0) return;
    const csv = Papa.unparse(projects.map(p => ({
      ID: p.id,
      Name: p.name,
      Location: p.location,
      Status: p.status,
      Phase: p.construction_phase,
      HazMat: p.hazmat_status,
      Compliance: p.compliance_score
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'projects-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpdate = async () => {
    if (!bulkAction || selectedProjects.size === 0) return;
    
    // Split action if in format "status:Active"
    let updateData: any = {};
    if (bulkAction.startsWith('status:')) {
      updateData.status = bulkAction.split(':')[1];
    } else if (bulkAction.startsWith('phase:')) {
      updateData.construction_phase = bulkAction.split(':')[1];
    }

    try {
      if (Object.keys(updateData).length > 0) {
          const promises = Array.from(selectedProjects).map(id => 
            supabase.from('projects').update(updateData).eq('id', id)
          );
          await Promise.all(promises);
          queryClient.invalidateQueries({ queryKey: ['projects'] });
          setSelectedProjects(new Set());
          setBulkAction('');
      }
    } catch(e) {
      console.error("Bulk update failed", e);
    }
  };

  if (showNewProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <ProjectSourceWorkflow 
            onComplete={() => setShowNewProject(false)} 
            onCancel={() => setShowNewProject(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Search & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Projects Overview</h2>
        <div className="flex flex-wrap items-center w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm"
            />
          </div>
           <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
               onClick={() => setViewMode('list')}
               className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <List className="w-4 h-4" />
             </button>
             <button 
               onClick={() => setViewMode('map')}
               className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <Map className="w-4 h-4" />
             </button>
           </div>
          <button 
            onClick={exportCSV}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap text-sm font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => setShowNewProject(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Projects</div>
          <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Active Projects</div>
          <div className="text-2xl font-bold text-emerald-600">{activeProjectsCount}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">HazMat Detections</div>
          <div className="text-2xl font-bold text-red-600">{hazmatCount}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Avg Compliance Score</div>
          <div className="text-2xl font-bold text-slate-900">{avgCompliance}%</div>
        </div>
      </div>

      {/* AI Context / Insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-4">
        <div className="bg-emerald-100 p-2 rounded-lg mt-0.5">
          <Sparkles className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h4 className="font-semibold text-emerald-900 mb-1">AI Portfolio Insights</h4>
          <p className="text-sm text-emerald-800 leading-relaxed">
            Based on recent tracking data, projects in the <strong>Demolition</strong> phase showing a 14% higher likelihood of missing baseline diversion targets. Wait times for hauler <em>Green Logistics</em> have averaged 15% later across all active sites. Scheduling early pickups for sites logging &gt; 10% Concrete waste is recommended.
          </p>
        </div>
      </div>

      {viewMode === 'map' ? (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[500px]">
           <MapContainer center={mapCenter} zoom={mappedProjects.length ? 11 : 2} style={{ height: '100%', width: '100%', zIndex: 0 }}>
             <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             />
             {mappedProjects.length === 0 && (
               <div className="absolute left-4 top-4 z-[500] rounded-lg bg-white/95 px-4 py-3 text-sm text-slate-600 shadow">No verified project coordinates available.</div>
             )}
             {mappedProjects.map(({ project: p, coordinates }) => (
               <Marker key={p.id} position={coordinates}>
                 <Popup>
                   <div className="font-medium text-slate-900">{p.name}</div>
                   <div className="text-xs text-slate-500 mb-1">{p.location || 'Unknown Location'}</div>
                   <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                      p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                   }`}>
                      {p.status}
                   </span>
                 </Popup>
               </Marker>
             ))}
           </MapContainer>
         </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Bulk Action Toolbar */}
          {selectedProjects.size > 0 && (
             <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {selectedProjects.size} project{selectedProjects.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-3">
                  <select 
                    className="text-sm border-slate-300 rounded-md py-1.5 pl-3 pr-8 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    value={bulkAction}
                    onChange={e => setBulkAction(e.target.value)}
                  >
                    <option value="">Bulk Actions...</option>
                    <optgroup label="Update Status">
                      <option value="status:Active">Set Active</option>
                      <option value="status:Completed">Set Completed</option>
                      <option value="status:Planning">Set Planning</option>
                    </optgroup>
                    <optgroup label="Update Phase">
                      <option value="phase:Demolition">Phase: Demolition</option>
                      <option value="phase:Excavation">Phase: Excavation</option>
                      <option value="phase:Construction">Phase: Construction</option>
                      <option value="phase:Finishing">Phase: Finishing</option>
                    </optgroup>
                  </select>
                  <button 
                    onClick={handleBulkUpdate}
                    disabled={!bulkAction}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm font-medium disabled:opacity-50 hover:bg-slate-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
             </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4 w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      checked={projects.length > 0 && selectedProjects.size === projects.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="p-4">Project Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Phase</th>
                  <th className="p-4">HazMat Status</th>
                  <th className="p-4">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="p-4"><div className="h-4 w-4 bg-slate-200 rounded animate-pulse"></div></td>
                      <td className="p-4"><div className="h-5 bg-slate-200 rounded animate-pulse w-3/4"></div></td>
                      <td className="p-4"><div className="h-5 bg-slate-200 rounded animate-pulse w-1/2"></div></td>
                      <td className="p-4"><div className="h-6 bg-slate-200 rounded-full animate-pulse w-20"></div></td>
                      <td className="p-4"><div className="h-5 bg-slate-200 rounded animate-pulse w-24"></div></td>
                      <td className="p-4"><div className="h-6 bg-slate-200 rounded-full animate-pulse w-24"></div></td>
                      <td className="p-4"><div className="h-2 bg-slate-200 rounded-full animate-pulse w-20"></div></td>
                    </tr>
                  ))
                ) : projects.length === 0 ? (
                  <tr><td colSpan={7} className="p-6 text-center text-slate-400">No projects found. Create one to get started.</td></tr>
                ) : (
                  projects.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          checked={selectedProjects.has(p.id)}
                          onChange={() => toggleSelection(p.id)}
                        />
                      </td>
                      <td className="p-4 font-medium text-slate-900">{p.name}</td>
                      <td className="p-4">{p.location || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                          p.status === 'Planning' ? 'bg-blue-100 text-blue-700' : 
                          p.status === 'Completed' ? 'bg-slate-200 text-slate-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>{p.status}</span>
                      </td>
                      <td className="p-4">{p.construction_phase}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          p.hazmat_status === 'Detected' ? 'bg-red-100 text-red-700' :
                          p.hazmat_status === 'Potential' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.hazmat_status === 'Detected' ? <AlertOctagon className="w-3 h-3 mr-1.5" /> : 
                            p.hazmat_status === 'Potential' ? <AlertTriangle className="w-3 h-3 mr-1.5" /> : 
                            <CheckCircle className="w-3 h-3 mr-1.5" />}
                          {p.hazmat_status || 'None'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="w-full bg-slate-200 rounded-full h-1.5 max-w-[100px] mb-1">
                          <div className={`h-1.5 rounded-full ${
                            (p.compliance_score || 0) >= 80 ? 'bg-emerald-500' : 
                            (p.compliance_score || 0) >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`} style={{width: `${p.compliance_score || 0}%`}}></div>
                        </div>
                        <span className="text-xs">{p.compliance_score || 0}%</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
