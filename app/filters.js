// Filtering and sorting for the deal list. Every control on the page funnels
// through applyFilters, so the count, the cards and the address bar agree.

import { percentOff, saved } from './verdicts.js';

export const SORTS = {
  discount: { label: 'Best discount first', run: (a, b) => percentOff(b) - percentOff(a) },
  saving: { label: 'Biggest saving first', run: (a, b) => saved(b) - saved(a) },
  priceLow: { label: 'Lowest price first', run: (a, b) => a.price - b.price },
  priceHigh: { label: 'Highest price first', run: (a, b) => b.price - a.price },
};

export function blankFilters() {
  return { q: '', category: 'all', store: 'all', minOff: 0, verdict: 'all', sort: 'discount' };
}

export function applyFilters(deals, f) {
  const q = f.q.trim().toLowerCase();
  const shown = deals.filter((d) => {
    if (q && `${d.title} ${d.store} ${d.category}`.toLowerCase().indexOf(q) === -1) return false;
    if (f.category !== 'all' && d.category !== f.category) return false;
    if (f.store !== 'all' && d.store !== f.store) return false;
    if (percentOff(d) < f.minOff) return false;
    if (f.verdict !== 'all' && d.verdict !== f.verdict) return false;
    return true;
  });
  return shown.sort(SORTS[f.sort].run);
}

export function categoriesOf(deals) {
  return [...new Set(deals.map((d) => d.category))].sort();
}

export function storesOf(deals) {
  return [...new Set(deals.map((d) => d.store))].sort();
}
