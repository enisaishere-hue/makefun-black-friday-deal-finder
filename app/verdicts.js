// Price math and verdict labels for one deal. Kept apart from the data so the
// numbers on every card come from one place and always add up.

export function dollars(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });
}

export function percentOff(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function saved(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

export function checkedLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }) + ' UTC';
}

export const VERDICTS = {
  'new-low': { label: 'New low', hint: 'The lowest price tracked for this product.' },
  strong: { label: 'Strong price', hint: 'A deep cut worth acting on.' },
  routine: { label: 'Routine sale', hint: 'A real discount, but a modest one.' },
};

export function verdictLabel(deal) {
  return VERDICTS[deal.verdict].label;
}
