import {useEffect, useState} from 'react';

export type StatsCardConfig = {
  id?: string;
  label: string;
  metric?: string;
  endpoint?: string;
  query?: Record<string, unknown>;
};

export default function StatsCard({config}: {config: StatsCardConfig}) {
  const [value, setValue] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);
  const endpoint = config.endpoint ?? `/api/stats/${config.metric ?? config.id ?? 'default'}`;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: config.query ?? {}}),
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => { if (mounted) setValue(data?.value ?? data) })
      .catch(() => { if (mounted) setValue(null) })
      .finally(() => { if (mounted) setLoading(false) });
    return () => { mounted = false };
  }, [endpoint, JSON.stringify(config.query)]);

  return (
    <div className="stats-card p-3 border rounded bg-white shadow-sm">
      <div className="stats-card-label text-sm text-slate-500">{config.label}</div>
      <div className="stats-card-value text-xl font-medium">
        {loading ? '…' : (value ?? '—')}
      </div>
    </div>
  );
}
