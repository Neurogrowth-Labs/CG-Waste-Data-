import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Truck, Compass, Navigation, ArrowRight, Route, ShieldAlert, 
  Fuel, Leaf, Layers, Play, RefreshCw, CheckCircle2, ChevronRight, Zap, 
  BarChart2, Clock, Table, CornerUpRight, RotateCcw
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  OSRMCoordinate, OSRMProfile, OSRMRouteResult, OSRMMatrixResult, OSRMTripResult,
  PRESET_OSRM_NODES, calculateOsrmRoute, calculateOsrmMatrix, optimizeOsrmTrip 
} from '../lib/osrmEngine';

export const OsrmMapEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'route' | 'matrix' | 'tsp'>('route');
  const [profile, setProfile] = useState<OSRMProfile>('heavy_haulage');
  
  // Waypoint Selections
  const [originNode, setOriginNode] = useState<OSRMCoordinate>(PRESET_OSRM_NODES[0]);
  const [destinationNode, setDestinationNode] = useState<OSRMCoordinate>(PRESET_OSRM_NODES[1]);

  // Calculated Results
  const [routeResult, setRouteResult] = useState<OSRMRouteResult | null>(null);
  const [matrixResult, setMatrixResult] = useState<OSRMMatrixResult | null>(null);
  const [tripResult, setTripResult] = useState<OSRMTripResult | null>(null);
  
  // Animation simulation along route
  const [simulatingTruck, setSimulatingTruck] = useState<boolean>(false);
  const [truckProgress, setTruckProgress] = useState<number>(0);

  // Recalculate Route whenever origin/destination/profile changes
  useEffect(() => {
    const res = calculateOsrmRoute([originNode, destinationNode], profile);
    setRouteResult(res);
  }, [originNode, destinationNode, profile]);

  // Recalculate Matrix
  useEffect(() => {
    const origins = [PRESET_OSRM_NODES[0], PRESET_OSRM_NODES[4]];
    const destinations = [PRESET_OSRM_NODES[1], PRESET_OSRM_NODES[2], PRESET_OSRM_NODES[3], PRESET_OSRM_NODES[5]];
    const mat = calculateOsrmMatrix(origins, destinations);
    setMatrixResult(mat);
  }, []);

  // Recalculate TSP Trip
  useEffect(() => {
    const trip = optimizeOsrmTrip(PRESET_OSRM_NODES);
    setTripResult(trip);
  }, []);

  // Truck Driving Simulation loop
  useEffect(() => {
    let timer: any;
    if (simulatingTruck) {
      timer = setInterval(() => {
        setTruckProgress((prev) => {
          if (prev >= 100) {
            setSimulatingTruck(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [simulatingTruck]);

  const handleStartSimulation = () => {
    setTruckProgress(0);
    setSimulatingTruck(true);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded uppercase font-mono">
              Project-OSRM v5.27
            </span>
            <h2 className="text-xl font-bold flex items-center">
              <Route className="w-5 h-5 mr-2 text-emerald-400" />
              OSRM Haulage Route Engine & Navigation
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Shortest path routing algorithms, turn-by-turn text instructions, multi-site distance matrices, and Travelling Salesperson (TSP) haulage fleet optimization.
          </p>
        </div>

        {/* Profile Selector */}
        <div className="flex items-center space-x-2 shrink-0 bg-slate-800 p-1 rounded-lg border border-slate-700">
          {(
            [
              { id: 'heavy_haulage', label: '30t Heavy Tipper' },
              { id: 'waste_compactor', label: 'Municipal Compactor' },
              { id: 'light_van', label: 'Recovery Van' },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              onClick={() => setProfile(p.id)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                profile === p.id
                  ? 'bg-[#0B8F6C] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-sm shrink-0">
        <button
          onClick={() => setActiveTab('route')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'route'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Interactive Route & Instructions</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'matrix'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Distance/Duration Matrix (/table/v1)</span>
        </button>

        <button
          onClick={() => setActiveTab('tsp')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'tsp'
              ? 'border-[#0B8F6C] text-[#0B8F6C] font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Multi-Stop TSP Optimizer (/trip/v1)</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-8">
        
        {/* TAB 1: INTERACTIVE ROUTE & TURN-BY-TURN */}
        {activeTab === 'route' && routeResult && (
          <div className="space-y-6">
            
            {/* Control Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Origin Pickup Node</label>
                <select
                  value={originNode.name}
                  onChange={(e) => {
                    const found = PRESET_OSRM_NODES.find((n) => n.name === e.target.value);
                    if (found) setOriginNode(found);
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#0B8F6C]"
                >
                  {PRESET_OSRM_NODES.map((n, i) => (
                    <option key={i} value={n.name}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Destination Facility Node</label>
                <select
                  value={destinationNode.name}
                  onChange={(e) => {
                    const found = PRESET_OSRM_NODES.find((n) => n.name === e.target.value);
                    if (found) setDestinationNode(found);
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#0B8F6C]"
                >
                  {PRESET_OSRM_NODES.map((n, i) => (
                    <option key={i} value={n.name}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end items-end space-x-2">
                <button
                  onClick={handleStartSimulation}
                  disabled={simulatingTruck}
                  className="w-full py-2.5 bg-[#0B8F6C] text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center shadow-md disabled:opacity-50"
                >
                  <Play className="w-4 h-4 mr-1.5 fill-current" />
                  {simulatingTruck ? `Driving... (${truckProgress}%)` : 'Simulate Haulage Run'}
                </button>
              </div>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Route Distance</div>
                <div className="text-2xl font-extrabold text-slate-800 font-data">{routeResult.distanceKm} <span className="text-xs text-slate-500 font-normal">km</span></div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">OSRM Map-Matched Polyline</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Travel Duration</div>
                <div className="text-2xl font-extrabold text-slate-800 font-data">{routeResult.durationMin} <span className="text-xs text-slate-500 font-normal">mins</span></div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Profile: {profile.replace('_', ' ').toUpperCase()}</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fuel Consumption</div>
                <div className="text-2xl font-extrabold text-amber-600 font-data">{routeResult.fuelConsumptionLiters} <span className="text-xs text-slate-500 font-normal">liters</span></div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Diesel Engine Estimate</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Carbon Footprint</div>
                <div className="text-2xl font-extrabold text-[#0B8F6C] font-data">{routeResult.co2EmissionsKg} <span className="text-xs text-slate-500 font-normal">kg CO2e</span></div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">-14% vs Unoptimized Urban Path</div>
              </div>
            </div>

            {/* Main Interactive Map & Guidance Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Vector Interactive Map Canvas */}
              <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg flex flex-col h-[480px] relative">
                {/* HUD Top Overlay */}
                <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center text-xs text-slate-300 z-10">
                  <span className="font-mono flex items-center text-emerald-400 font-bold">
                    <Compass className="w-3.5 h-3.5 mr-1.5 animate-spin" /> OSRM REAL-TIME MAP CANVAS
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                    PROJECTION: EPSG:3857 (SPHERICAL MERCATOR)
                  </span>
                </div>

                {/* Map Vector Graphic Rendering */}
                <div className="flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                  {/* SVG Route Line & Waypoint Markers */}
                  <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 600 400">
                    <defs>
                      <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0B8F6C" />
                        <stop offset="100%" stopColor="#00C2A8" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Secondary roads background mesh */}
                    <path d="M 50 100 Q 200 80 350 180 T 550 320" fill="none" stroke="#1e293b" strokeWidth="6" />
                    <path d="M 120 350 Q 250 200 480 80" fill="none" stroke="#1e293b" strokeWidth="6" />

                    {/* Main OSRM Polyline */}
                    <path
                      d="M 80 320 Q 220 120 380 250 T 520 80"
                      fill="none"
                      stroke="url(#routeGrad)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />

                    {/* Origin Marker */}
                    <g transform="translate(80, 320)">
                      <circle r="16" fill="#0B8F6C" fillOpacity="0.3" className="animate-ping" />
                      <circle r="10" fill="#0B8F6C" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="24" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                        ORIGIN: {originNode.name.split(' ')[0]}
                      </text>
                    </g>

                    {/* Destination Marker */}
                    <g transform="translate(520, 80)">
                      <circle r="16" fill="#EF4444" fillOpacity="0.3" className="animate-ping" />
                      <circle r="10" fill="#EF4444" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="-14" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                        DEST: {destinationNode.name.split(' ')[0]}
                      </text>
                    </g>

                    {/* Animated Truck Icon on path */}
                    {simulatingTruck && (
                      <g transform={`translate(${80 + (520 - 80) * (truckProgress / 100)}, ${320 + (80 - 320) * (truckProgress / 100)})`}>
                        <circle r="12" fill="#3B82F6" stroke="#ffffff" strokeWidth="2" />
                        <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9">🚛</text>
                      </g>
                    )}
                  </svg>

                  {/* Overlay Controls */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded px-3 py-1.5 text-[10px] font-mono text-slate-300 z-20 flex items-center space-x-3">
                    <span className="text-emerald-400 font-bold">OSRM NODE: ACTIVE</span>
                    <span>BEARING: 042° NNE</span>
                    <span>ALT: 1,480m</span>
                  </div>
                </div>

                {/* Elevation & Speed Profile Chart */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 h-32">
                  <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Route Elevation (Meters) & Speed Profile</span>
                    <span className="text-emerald-400">OSRM Topographic Trace</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={routeResult.elevationProfile}>
                      <Area type="monotone" dataKey="elevationM" stroke="#0B8F6C" fill="#0B8F6C" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px', backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: Turn-by-Turn Instruction List (osrm-text-instructions) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[480px]">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 flex items-center">
                    <CornerUpRight className="w-3.5 h-3.5 mr-1.5 text-[#0B8F6C]" />
                    Turn-by-Turn Guidance (osrm-text-instructions)
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {routeResult.legs[0]?.steps.length || 0} Maneuvers
                  </span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {routeResult.legs[0]?.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-start space-x-3"
                    >
                      <div className="p-2 bg-emerald-50 text-[#0B8F6C] rounded-lg shrink-0 mt-0.5 border border-emerald-100">
                        {step.maneuver.type === 'depart' ? (
                          <Navigation className="w-4 h-4" />
                        ) : step.maneuver.type === 'arrive' ? (
                          <MapPin className="w-4 h-4 text-red-600" />
                        ) : (
                          <CornerUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          {step.instructionText}
                        </p>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-medium mt-1">
                          <span>Dist: <strong className="text-slate-700">{step.distanceKm} km</strong></span>
                          <span>Est: <strong className="text-slate-700">{step.durationMin} mins</strong></span>
                          <span className="font-mono text-slate-400">{step.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DISTANCE & DURATION MATRIX */}
        {activeTab === 'matrix' && matrixResult && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center">
                  <Table className="w-4 h-4 mr-2 text-[#0B8F6C]" />
                  OSRM Multi-Site Distance & Duration Matrix Engine (/table/v1)
                </h3>
                <p className="text-xs text-slate-500">
                  Computes all-pairs shortest travel times between waste pickup origins and multi-region recycling plants.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-white font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Pickup Origin Site</th>
                      {matrixResult.destinations.map((d, i) => (
                        <th key={i} className="px-4 py-3 font-mono">{d.name.split(' ')[0]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {matrixResult.origins.map((orig, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-800">{orig.name}</td>
                        {matrixResult.destinations.map((_, j) => {
                          const dist = matrixResult.distancesKm[i][j];
                          const dur = matrixResult.durationsMin[i][j];
                          return (
                            <td key={j} className="px-4 py-3">
                              <div className="font-bold text-slate-900 font-data">{dist} km</div>
                              <div className="text-[10px] text-slate-500">{dur} mins</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TSP MULTI-STOP TRIP OPTIMIZER */}
        {activeTab === 'tsp' && tripResult && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-[#0B8F6C]" />
                    OSRM Travelling Salesperson (TSP) Fleet Optimizer (/trip/v1)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Re-orders multi-stop haulage pickups to eliminate deadhead transport mileage and lower Scope 3 carbon output.
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Saved {tripResult.savingsKm} km ({tripResult.savingsPercent}% Mileage Reduction)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unoptimized Sequence</span>
                  <div className="text-xl font-bold text-slate-800">88.4 km Total Travel</div>
                  <p className="text-xs text-slate-500">Random pickup sequence causes redundant cross-city backhauls.</p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">OSRM TSP Optimized Sequence</span>
                  <div className="text-xl font-bold text-emerald-900 font-data">{tripResult.totalDistanceKm} km Total Travel</div>
                  <p className="text-xs text-emerald-700">Optimal nearest-neighbor TSP loop saves time and fuel.</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Optimized Haulage Pickup Sequence</h4>
                <div className="space-y-2">
                  {tripResult.optimizedCoordinates.map((pt, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{pt.name}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                        {pt.type || 'waypoint'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OsrmMapEngine;
