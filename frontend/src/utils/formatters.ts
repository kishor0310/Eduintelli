export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRiskBadgeColor(level: 'LOW' | 'MEDIUM' | 'HIGH') {
  switch (level) {
    case 'LOW':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'MEDIUM':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'HIGH':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

export function getPriorityBadgeColor(priority: 'HIGH' | 'MEDIUM' | 'LOW') {
  switch (priority) {
    case 'HIGH':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    case 'MEDIUM':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'LOW':
      return 'bg-brand-500/15 text-brand-400 border-brand-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}
