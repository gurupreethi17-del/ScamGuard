import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { DashboardStats, ThreatAnalysis } from '../types/index.ts';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  ArrowRight,
  FileSearch,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface DashboardProps {
  onSelectAnalysis: (analysis: ThreatAnalysis) => void;
  onNavigateToAnalyzer: () => void;
  onNavigateToHistory: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectAnalysis,
  onNavigateToAnalyzer,
  onNavigateToHistory,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.dashboard.stats();
        if (!cancelled) {
          setStats(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to load dashboard metrics.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="h-20 bg-slate-900/60 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-slate-900/60 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="w-full max-w-5xl mx-auto rounded-lg border border-slate-800 bg-slate-900 p-8 text-center space-y-3">
        <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-100">Unable to load dashboard</h3>
        <p className="text-xs text-slate-400">{error || 'Please sign in or refresh the page.'}</p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="px-3.5 py-1.5 text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 rounded cursor-pointer transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onNavigateToAnalyzer}
            className="px-3.5 py-1.5 text-xs bg-cyan-600 text-white rounded hover:bg-cyan-500 cursor-pointer transition-colors"
          >
            Go to Analyzer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Activity className="h-3.5 w-3.5" />
            Cyber Threat Posture Center
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Security Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistics from analyses saved to your account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToAnalyzer}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Scan New Threat</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metric Cards strictly matching user requirements */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total Analyses */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Analyses</span>
            <FileSearch className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-100 tabular-nums">
              {stats.totalAnalyses}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Inspected items</div>
          </div>
        </div>

        {/* Critical Threats */}
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-rose-300">
            <span>Critical Threats</span>
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-rose-400 tabular-nums">
              {stats.criticalCount}
            </div>
            <div className="text-[11px] text-rose-300/80 mt-0.5">Score 75–100</div>
          </div>
        </div>

        {/* High Risk */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>High Risk</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-400 tabular-nums">
              {stats.highCount}
            </div>
            <div className="text-[11px] text-amber-300/80 mt-0.5">Score 50–74</div>
          </div>
        </div>

        {/* Medium Risk */}
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-950/20 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-yellow-300">
            <span>Medium Risk</span>
            <AlertCircle className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-yellow-400 tabular-nums">
              {stats.mediumCount}
            </div>
            <div className="text-[11px] text-yellow-300/80 mt-0.5">Score 25–49</div>
          </div>
        </div>

        {/* Low Risk */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>Low Risk</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
              {stats.lowCount}
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">Score 0–24</div>
          </div>
        </div>
      </div>

      {/* Empty State Banner when 0 analyses exist */}
      {stats.totalAnalyses === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-8 text-center space-y-4 shadow-lg">
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-base font-bold text-slate-100">
              No analyses yet
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyze your first suspicious message, link, email, screenshot or QR code.
            </p>
          </div>
          <div>
            <button
              onClick={onNavigateToAnalyzer}
              className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Analyze a Threat</span>
            </button>
          </div>
        </div>
      )}

      {/* Visual Distribution Charts & Threat Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Risk Level Distribution Bar Chart */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Risk Level Breakdown
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Actual User Data</span>
          </div>

          {stats.totalAnalyses === 0 ? (
            <div className="py-10 text-center space-y-1.5">
              <p className="text-xs font-medium text-slate-300">No analyses yet</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Analyze your first suspicious message, link, email, screenshot or QR code.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Critical */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-rose-400 font-medium">Critical Risk (75-100)</span>
                  <span className="font-mono text-slate-300 tabular-nums">
                    {stats.criticalCount} ({Math.round((stats.criticalCount / stats.totalAnalyses) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${(stats.criticalCount / stats.totalAnalyses) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* High */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-amber-400 font-medium">High Risk (50-74)</span>
                  <span className="font-mono text-slate-300 tabular-nums">
                    {stats.highCount} ({Math.round((stats.highCount / stats.totalAnalyses) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${(stats.highCount / stats.totalAnalyses) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-400 font-medium">Medium Risk (25-49)</span>
                  <span className="font-mono text-slate-300 tabular-nums">
                    {stats.mediumCount} ({Math.round((stats.mediumCount / stats.totalAnalyses) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${(stats.mediumCount / stats.totalAnalyses) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Low */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400 font-medium">Low / Benign (0-24)</span>
                  <span className="font-mono text-slate-300 tabular-nums">
                    {stats.lowCount} ({Math.round((stats.lowCount / stats.totalAnalyses) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${(stats.lowCount / stats.totalAnalyses) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Most Common Threat Types */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Top Threat Categories Detected
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">By Frequency</span>
          </div>

          {stats.threatTypeBreakdown.length === 0 ? (
            <div className="py-10 text-center space-y-1.5">
              <p className="text-xs font-medium text-slate-300">No analyses yet</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Analyze your first suspicious message, link, email, screenshot or QR code.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.threatTypeBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded bg-slate-950/70 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2 truncate max-w-[240px]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-800 text-[10px] font-mono text-cyan-400">
                      {idx + 1}
                    </span>
                    <span className="truncate text-slate-200">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-slate-400 text-[11px]">
                    <span className="text-slate-100 font-semibold">{item.count}</span>
                    <span>({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Recent Intelligence Analyses
          </h3>
          <button
            onClick={onNavigateToHistory}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All History</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {stats.recentAnalyses.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item)}
              className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 rounded transition-colors cursor-pointer"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-sm">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                    {item.type}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-lg">
                  {item.threatType} · {item.summary}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold tabular-nums ${
                      item.riskLevel === 'CRITICAL'
                        ? 'text-rose-400'
                        : item.riskLevel === 'HIGH'
                        ? 'text-amber-400'
                        : item.riskLevel === 'MEDIUM'
                        ? 'text-yellow-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {item.riskScore}/100
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      item.riskLevel === 'CRITICAL'
                        ? 'border-rose-500/30 text-rose-300 bg-rose-500/10'
                        : item.riskLevel === 'HIGH'
                        ? 'border-amber-500/30 text-amber-300 bg-amber-500/10'
                        : item.riskLevel === 'MEDIUM'
                        ? 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10'
                        : 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                    }`}
                  >
                    {item.riskLevel}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}

          {stats.recentAnalyses.length === 0 && (
            <div className="py-10 text-center space-y-1.5">
              <p className="text-xs font-medium text-slate-300">No analyses yet</p>
              <p className="text-[11px] text-slate-500">
                Analyze your first suspicious message, link, email, screenshot or QR code.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
