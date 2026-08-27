'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { EventNode } from '@/lib/eventStore';

interface VoteBarChartProps {
  nodes: EventNode[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-4 py-3 text-sm shadow-xl"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border-strong)' }}
    >
      <div className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{label}</div>
      <div style={{ color: 'var(--primary)' }}>
        <span className="font-mono-data font-bold">{payload[0].value}</span>
        {' '}vote{payload[0].value !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default function VoteBarChart({ nodes }: VoteBarChartProps) {
  const sorted = [...nodes].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const maxVotes = Math.max(...sorted.map(n => n.votes || 0), 1);

  const data = sorted.map(n => ({
    name: n.name.length > 12 ? n.name.slice(0, 11) + '…' : n.name,
    fullName: n.name,
    votes: n.votes || 0,
    id: n.id,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
        barSize={36}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          domain={[0, maxVotes + 1]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,179,1,0.06)' }} />
        <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`bar-cell-${entry.id}`}
              fill={index === 0 && entry.votes > 0 ? 'var(--primary)' : 'var(--muted-foreground)'}
              fillOpacity={index === 0 ? 1 : 0.55}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
