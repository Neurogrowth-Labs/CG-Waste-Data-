import React, { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bot, Crosshair, Layers, LocateFixed, Radio, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export type ProjectMapSite = { id: string; name: string; location?: string | null; latitude?: number | string | null; longitude?: number | string | null };
type Area = { id: string; project_id: string; name: string; status: string; geometry: { type: 'Polygon'; coordinates: number[][][] }; estimated_waste_volume?: number | null; estimated_recyclable_volume?: number | null };
type Device = { id: string; project_id: string; demolition_area_id?: string | null; display_name: string; device_type: 'drone' | 'ground_robot'; connection_status: string; battery_percent?: number | null; last_telemetry_at?: string | null };
type Telemetry = { id: string; device_id: string; latitude: number; longitude: number; heading?: number | null; recorded_at: string };
type Detection = { id: string; project_id: string; demolition_area_id?: string | null; material_type: string; material_category?: string | null; confidence_score: number; latitude: number; longitude: number; quantity_estimate?: number | null; unit?: string | null; verification_status: string; detected_at: string };

const validPoint = (lat: number, lng: number) => Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
const toLatLngs = (geometry: Area['geometry']): [number, number][] => geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
const toGeometry = (points: LatLng[]): Area['geometry'] => ({ type: 'Polygon', coordinates: [[...points.map(({ lat, lng }) => [lng, lat]), [points[0].lng, points[0].lat]]] });

function DrawingHandler({ drawing, onPoint }: { drawing: boolean; onPoint: (point: LatLng) => void }) {
  useMapEvents({ click: event => { if (drawing) onPoint(event.latlng); } });
  return null;
}

export function DemolitionIntelligenceMap({ projects }: { projects: ProjectMapSite[] }) {
  const site = projects.find(p => validPoint(Number(p.latitude), Number(p.longitude)));
  const center: [number, number] = site ? [Number(site.latitude), Number(site.longitude)] : [0, 0];
  const [areas, setAreas] = useState<Area[]>([]); const [devices, setDevices] = useState<Device[]>([]); const [telemetry, setTelemetry] = useState<Telemetry[]>([]); const [detections, setDetections] = useState<Detection[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(site?.id ?? ''); const [draft, setDraft] = useState<LatLng[]>([]); const [drawing, setDrawing] = useState(false); const [areaName, setAreaName] = useState(''); const [connectOpen, setConnectOpen] = useState(false); const [deviceName, setDeviceName] = useState(''); const [deviceType, setDeviceType] = useState<Device['device_type']>('drone'); const [selectedAreaId, setSelectedAreaId] = useState(''); const [saving, setSaving] = useState(false); const [notice, setNotice] = useState('');
  const selectedAreas = areas.filter(area => area.project_id === selectedProjectId);
  const latestTelemetry = useMemo(() => telemetry.reduce<Record<string, Telemetry>>((current, item) => !current[item.device_id] || new Date(item.recorded_at) > new Date(current[item.device_id].recorded_at) ? { ...current, [item.device_id]: item } : current, {}), [telemetry]);

  const load = async () => {
    const [areaResult, deviceResult, telemetryResult, detectionResult] = await Promise.all([
      supabase.from('demolition_areas').select('*').eq('project_id', selectedProjectId).order('updated_at', { ascending: false }),
      supabase.from('field_devices').select('*').eq('project_id', selectedProjectId),
      supabase.from('device_telemetry').select('*').eq('project_id', selectedProjectId).order('recorded_at', { ascending: false }).limit(500),
      supabase.from('material_detections').select('*').eq('project_id', selectedProjectId).order('detected_at', { ascending: false }).limit(500),
    ]);
    if (areaResult.error || deviceResult.error || telemetryResult.error || detectionResult.error) { setNotice('Live intelligence is unavailable until the demolition migration and permissions are applied.'); return; }
    setAreas(areaResult.data as Area[]); setDevices(deviceResult.data as Device[]); setTelemetry(telemetryResult.data as Telemetry[]); setDetections(detectionResult.data as Detection[]);
  };
  useEffect(() => { if (!selectedProjectId) return; load(); }, [selectedProjectId]);
  useEffect(() => {
    if (!selectedProjectId) return;
    const channel = supabase.channel(`demolition-map:${selectedProjectId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'demolition_areas', filter: `project_id=eq.${selectedProjectId}` }, load).on('postgres_changes', { event: '*', schema: 'public', table: 'field_devices', filter: `project_id=eq.${selectedProjectId}` }, load).on('postgres_changes', { event: '*', schema: 'public', table: 'device_telemetry', filter: `project_id=eq.${selectedProjectId}` }, load).on('postgres_changes', { event: '*', schema: 'public', table: 'material_detections', filter: `project_id=eq.${selectedProjectId}` }, load).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedProjectId]);
  const saveArea = async () => { if (!selectedProjectId || draft.length < 3 || !areaName.trim()) return; setSaving(true); const { error } = await supabase.from('demolition_areas').insert({ project_id: selectedProjectId, name: areaName.trim(), geometry: toGeometry(draft), status: 'active' }); setSaving(false); if (error) { setNotice(error.message); return; } setDraft([]); setAreaName(''); setDrawing(false); load(); };
  const archiveArea = async (id: string) => { const { error } = await supabase.from('demolition_areas').update({ status: 'archived' }).eq('id', id); if (error) setNotice(error.message); else load(); };
  const connectDevice = async () => { if (!selectedProjectId || !deviceName.trim()) return; setSaving(true); const { error } = await supabase.from('field_devices').insert({ project_id: selectedProjectId, demolition_area_id: selectedAreaId || null, display_name: deviceName.trim(), device_type: deviceType, adapter_type: 'external_gateway', connection_status: 'connecting' }); setSaving(false); if (error) { setNotice(error.message); return; } setDeviceName(''); setConnectOpen(false); load(); };
  return <div className="relative h-[620px] bg-slate-100">
    <MapContainer center={center} zoom={site ? 15 : 2} className="h-full w-full" style={{ zIndex: 0 }}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><DrawingHandler drawing={drawing} onPoint={point => setDraft(current => [...current, point])} />
      {projects.map(project => validPoint(Number(project.latitude), Number(project.longitude)) && <Marker key={project.id} position={[Number(project.latitude), Number(project.longitude)]}><Popup><strong>{project.name}</strong><br />{project.location}</Popup></Marker>)}
      {selectedAreas.map(area => <Polygon key={area.id} positions={toLatLngs(area.geometry)} pathOptions={{ color: area.status === 'archived' ? '#64748b' : '#0B8F6C', fillOpacity: .15 }}><Popup><strong>{area.name}</strong><br />{area.status}<br /><button onClick={() => archiveArea(area.id)}>Archive area</button></Popup></Polygon>)}
      {draft.length > 0 && <Polyline positions={draft} pathOptions={{ color: '#2563eb', dashArray: '6 6' }} />}
      {devices.map(device => { const point = latestTelemetry[device.id]; return point && <Marker key={device.id} position={[point.latitude, point.longitude]} icon={L.divIcon({ className: 'device-marker', html: `<div style="background:#0f172a;color:#fff;border:2px solid #34d399;border-radius:50%;padding:6px;font-size:14px">${device.device_type === 'drone' ? '▲' : '●'}</div>` })}><Popup><strong>{device.display_name}</strong><br />{device.connection_status} · {device.battery_percent ?? '—'}% battery<br />{new Date(point.recorded_at).toLocaleString()}</Popup></Marker>; })}
      {devices.map(device => { const trail = telemetry.filter(point => point.device_id === device.id).slice(0, 100).reverse().map(point => [point.latitude, point.longitude] as [number, number]); return trail.length > 1 && <Polyline key={`${device.id}-trail`} positions={trail} pathOptions={{ color: '#38bdf8', weight: 3 }} />; })}
      {detections.map(detection => <CircleMarker key={detection.id} center={[detection.latitude, detection.longitude]} radius={7} pathOptions={{ color: detection.verification_status === 'human_verified' ? '#16a34a' : '#f59e0b', fillOpacity: .85 }}><Popup><strong>{detection.material_type}</strong><br />{Math.round(detection.confidence_score * 100)}% confidence · {detection.verification_status}<br />Estimated: {detection.quantity_estimate ?? '—'} {detection.unit ?? ''}</Popup></CircleMarker>)}
    </MapContainer>
    <div className="absolute left-3 top-3 z-[500] w-72 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg space-y-2"><div className="flex items-center justify-between"><strong className="text-sm text-slate-800">Demolition intelligence</strong><Radio className="h-4 w-4 text-emerald-600" /></div><select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="w-full rounded border p-2 text-sm">{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><div className="grid grid-cols-2 gap-2"><button onClick={() => setDrawing(!drawing)} className="rounded bg-emerald-600 px-2 py-2 text-xs font-semibold text-white"><Crosshair className="mr-1 inline h-3 w-3" />{drawing ? 'Drawing…' : 'Draw area'}</button><button onClick={() => setConnectOpen(true)} className="rounded bg-slate-900 px-2 py-2 text-xs font-semibold text-white"><Bot className="mr-1 inline h-3 w-3" />Connect Robot</button></div><div className="flex gap-3 text-xs text-slate-600"><span><Layers className="mr-1 inline h-3 w-3" />{selectedAreas.length} areas</span><span><LocateFixed className="mr-1 inline h-3 w-3" />{detections.length} detections</span></div>{notice && <p className="text-xs text-amber-700">{notice}</p>}</div>
    {drawing && <div className="absolute bottom-3 left-3 z-[500] w-80 rounded-xl bg-white p-3 shadow-lg"><div className="mb-2 flex justify-between text-sm font-semibold">New demolition area <button onClick={() => { setDrawing(false); setDraft([]); }}><X className="h-4 w-4" /></button></div><p className="mb-2 text-xs text-slate-500">Click at least three boundary vertices. Geometry is stored as WGS 84 GeoJSON; area is calculated in m².</p><input value={areaName} onChange={e => setAreaName(e.target.value)} placeholder="Area name" className="mb-2 w-full rounded border p-2 text-sm"/><button onClick={saveArea} disabled={saving || draft.length < 3 || !areaName.trim()} className="w-full rounded bg-emerald-600 p-2 text-xs font-semibold text-white disabled:opacity-50"><Save className="mr-1 inline h-3 w-3" />Save boundary ({draft.length} vertices)</button></div>}
    {connectOpen && <div className="absolute right-3 top-3 z-[500] w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"><div className="mb-3 flex justify-between"><strong>Connect Robot</strong><button onClick={() => setConnectOpen(false)}><X className="h-4 w-4" /></button></div><p className="mb-3 text-xs text-slate-500">Credentials remain in the device gateway. This registers an adapter-backed device only.</p><input value={deviceName} onChange={e => setDeviceName(e.target.value)} placeholder="Device name" className="mb-2 w-full rounded border p-2 text-sm"/><select value={deviceType} onChange={e => setDeviceType(e.target.value as Device['device_type'])} className="mb-2 w-full rounded border p-2 text-sm"><option value="drone">Drone</option><option value="ground_robot">Ground Robot</option></select><select value={selectedAreaId} onChange={e => setSelectedAreaId(e.target.value)} className="mb-3 w-full rounded border p-2 text-sm"><option value="">No assigned area</option>{selectedAreas.filter(a => a.status !== 'archived').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select><button onClick={connectDevice} disabled={saving || !deviceName.trim()} className="w-full rounded bg-slate-900 p-2 text-sm font-semibold text-white disabled:opacity-50">Establish connection</button></div>}
  </div>;
}
