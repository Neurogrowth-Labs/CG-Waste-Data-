import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface WasteLogRecord {
  id: string;
  material?: string | null;
  weight?: number | null;
  status?: string | null;
  hauler?: string | null;
  destination?: string | null;
  created_at?: string | null;
}

export interface PlatformMetrics {
  logs: WasteLogRecord[];
  totalWaste: number;
  divertedWaste: number;
  diversionRate: number;
  activeManifests: number;
  inTransit: number;
  verified: number;
  rejected: number;
  materialBreakdown: Array<{ name: string; value: number }>;
}

const EMPTY_METRICS: PlatformMetrics = {
  logs: [],
  totalWaste: 0,
  divertedWaste: 0,
  diversionRate: 0,
  activeManifests: 0,
  inTransit: 0,
  verified: 0,
  rejected: 0,
  materialBreakdown: [],
};

const DIVERTED_STATUSES = new Set(['verified', 'recycled', 'reused', 'diverted']);
const DIVERTIBLE_MATERIALS = new Set(['concrete', 'metal', 'steel', 'wood', 'timber', 'glass', 'brick']);

const toWeight = (value: number | null | undefined) => Number(value || 0);

export const normalizePlatformMetrics = (logs: WasteLogRecord[]): PlatformMetrics => {
  const metrics = logs.reduce<PlatformMetrics>((acc, log) => {
    const material = log.material || 'Unclassified';
    const normalizedMaterial = material.toLowerCase();
    const normalizedStatus = (log.status || '').toLowerCase();
    const weight = toWeight(log.weight);

    acc.totalWaste += weight;
    acc.activeManifests += 1;
    if (normalizedStatus === 'in transit') acc.inTransit += 1;
    if (normalizedStatus === 'verified') acc.verified += 1;
    if (normalizedStatus === 'rejected') acc.rejected += 1;
    if (DIVERTED_STATUSES.has(normalizedStatus) || DIVERTIBLE_MATERIALS.has(normalizedMaterial)) acc.divertedWaste += weight;

    const existing = acc.materialBreakdown.find(item => item.name === material);
    if (existing) existing.value += weight;
    else acc.materialBreakdown.push({ name: material, value: weight });

    return acc;
  }, { ...EMPTY_METRICS, logs, materialBreakdown: [] });

  metrics.diversionRate = metrics.totalWaste > 0 ? (metrics.divertedWaste / metrics.totalWaste) * 100 : 0;
  metrics.materialBreakdown.sort((a, b) => b.value - a.value);
  return metrics;
};

export const usePlatformMetrics = () => {
  const query = useQuery({
    queryKey: ['platform_metrics'],
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase.from('waste_logs').select('*').order('created_at', { ascending: false }).limit(500);
      if (error) throw error;
      return (data || []) as WasteLogRecord[];
    },
  });

  const metrics = useMemo(() => normalizePlatformMetrics(query.data || []), [query.data]);
  return { ...query, metrics };
};
