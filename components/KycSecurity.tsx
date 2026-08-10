import React, { useMemo, useState } from 'react';
import { AlertTriangle, BadgeCheck, Camera, Database, FileCheck2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { FACEONLIVE_WINDOWS_REPOSITORY, FaceOnLiveKycResult, KycApplicant, runFaceOnLiveKycCheck } from '../lib/kycFaceOnLive';

const SAMPLE_APPLICANTS: KycApplicant[] = [
  {
    id: 'usr-haul-8829',
    fullName: 'Marcus Vance',
    documentNumber: 'HAUL-8829-GP',
    documentType: 'employee_badge',
    referenceImageSeed: 'Marcus Vance',
    selfieImageSeed: 'Marcus Vance'
  },
  {
    id: 'usr-vendor-1170',
    fullName: 'Amina Okafor',
    documentNumber: 'PASS-1170-NG',
    documentType: 'passport',
    referenceImageSeed: 'Amina Okafor passport',
    selfieImageSeed: 'Amina Okafor live selfie'
  }
];

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  manual_review: 'bg-amber-100 text-amber-700 border-amber-200',
  rejected: 'bg-red-100 text-red-700 border-red-200'
};

const KycSecurity: React.FC = () => {
  const [selectedApplicantId, setSelectedApplicantId] = useState(SAMPLE_APPLICANTS[0].id);
  const [result, setResult] = useState<FaceOnLiveKycResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const applicant = useMemo(
    () => SAMPLE_APPLICANTS.find((item) => item.id === selectedApplicantId) || SAMPLE_APPLICANTS[0],
    [selectedApplicantId]
  );

  const runCheck = async () => {
    setIsChecking(true);
    const verification = await runFaceOnLiveKycCheck(applicant);
    setResult(verification);
    setIsChecking(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">KYC Security</span>
              <span className="px-2 py-1 rounded-md bg-indigo-500/15 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">FaceOnLive SDK Adapter</span>
            </div>
            <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-emerald-400" /> Face Recognition Identity Assurance</h2>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl">
              Adds a KYC gate for drivers, suppliers, contractors, and privileged staff using FaceOnLive-compatible face matching, liveness, audit hashes, and SQL-backed verification records.
            </p>
          </div>
          <a href={FACEONLIVE_WINDOWS_REPOSITORY} target="_blank" rel="noreferrer" className="text-xs font-mono text-cyan-300 hover:text-cyan-200 break-all">
            {FACEONLIVE_WINDOWS_REPOSITORY}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileCheck2 className="w-5 h-5 text-emerald-600" /> Applicant</h3>
          <select value={selectedApplicantId} onChange={(event) => setSelectedApplicantId(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {SAMPLE_APPLICANTS.map((item) => <option key={item.id} value={item.id}>{item.fullName}</option>)}
          </select>
          <div className="rounded-xl bg-slate-50 p-4 text-sm space-y-2 border border-slate-200">
            <div className="flex justify-between"><span className="text-slate-500">Document</span><span className="font-mono text-slate-800">{applicant.documentNumber}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="capitalize text-slate-800">{applicant.documentType.replace('_', ' ')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Subject ID</span><span className="font-mono text-slate-800">{applicant.id}</span></div>
          </div>
          <button onClick={runCheck} disabled={isChecking} className="w-full py-3 rounded-lg bg-[#0B8F6C] text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" /> {isChecking ? 'Running liveness check...' : 'Run Face KYC Check'}
          </button>
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><BadgeCheck className="w-5 h-5 text-indigo-600" /> Verification Result</h3>
          {result ? (
            <div className="space-y-5">
              <div className={`inline-flex border px-3 py-1 rounded-full text-xs font-bold uppercase ${statusStyles[result.decision]}`}>{result.decision.replace('_', ' ')}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Metric label="Face Match" value={`${result.matchScore}%`} />
                <Metric label="Liveness" value={`${result.livenessScore}%`} />
                <Metric label="Anti-spoofing" value={result.antiSpoofingStatus.replace('_', ' ')} />
              </div>
              <div className="rounded-xl bg-slate-950 text-slate-100 p-4 font-mono text-xs space-y-2">
                <div>audit_id: {result.auditId}</div>
                <div>template_sha256: {result.faceTemplateHash}</div>
                <div>checked_at: {result.checkedAt}</div>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {result.reasons.map((reason) => <li key={reason} className="flex gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{reason}</li>)}
              </ul>
            </div>
          ) : (
            <div className="h-64 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <LockKeyhole className="w-10 h-10 text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">No KYC verification has been run yet.</p>
              <p className="text-sm max-w-md mt-1">Run a check to generate a FaceOnLive-compatible match score, liveness decision, anti-spoofing status, and immutable audit values.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Control icon={<Database className="w-5 h-5" />} title="SQL evidence vault" text="Stores verification sessions, encrypted template hashes, and document metadata without retaining raw selfies." />
        <Control icon={<AlertTriangle className="w-5 h-5" />} title="Manual review route" text="Borderline liveness or match scores are held for compliance review instead of granting access." />
        <Control icon={<LockKeyhole className="w-5 h-5" />} title="RLS enforcement" text="Applicants see only their KYC record, while auditors and admins can review exception queues." />
      </div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</div>
    <div className="text-2xl font-bold text-slate-900 mt-1 capitalize">{value}</div>
  </div>
);

const Control: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
    <div className="text-emerald-600 mb-2">{icon}</div>
    <h4 className="font-bold text-slate-800">{title}</h4>
    <p className="text-sm text-slate-500 mt-1">{text}</p>
  </div>
);

export default KycSecurity;
