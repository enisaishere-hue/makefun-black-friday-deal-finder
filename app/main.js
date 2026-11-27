// Wiring for Bargain Beacon: routes, controls, stats and re-rendering. The list
// reads its starting filters from the address bar, so a link can open the page
// with a search or a filter already applied.

import { deals } from './deals.js';
import { percentOff, saved, dollars } from './verdicts.js';
import { blankFilters, applyFilters, categoriesOf, storesOf, SORTS } from './filters.js';
import { dealListHtml, dealPageHtml, notFoundHtml } from './render.js';

const app = document.getElementById('app');
const statsEl = document.getElementById('stats');

function readHashFilters() {
  const f = blankFilters();
  const raw = location.hash.replace(/^#\/?\??/, '');
  const params = new URLSearchParams(raw);
  if (params.get('q')) f.q = params.get('q');
  if (params.get('cat')) f.category = params.get('cat');
  if (params.get('store')) f.store = params.get('store');
  if (params.get('min')) f.minOff = Number(params.get('min')) || 0;
  if (params.get('verdict')) f.verdict = params.get('verdict');
  if (params.get('sort') && SORTS[params.get('sort')]) f.sort = params.get('sort');
  return f;
}

function writeHashFilters(f) {
  const params = new URLSearchParams();
  if (f.q) params.set('q', f.q);
  if (f.category !== 'all') params.set('cat', f.category);
  if (f.store !== 'all') params.set('store', f.store);
  if (f.minOff) params.set('min', String(f.minOff));
  if (f.verdict !== 'all') params.set('verdict', f.verdict);
  if (f.sort !== 'discount') params.set('sort', f.sort);
  const query = params.toString();
  history.replaceState(null, '', '#/' + (query ? '?' + query : ''));
}

function option(value, label, current) {
  return `<option value="${value}"${value === current ? ' selected' : ''}>${label}</option>`;
}

function controlsHtml(f) {
  const cats = categoriesOf(deals);
  const stores = storesOf(deals);
  return `<form id="controls" class="controls" onsubmit="return false">
  <label>Search <input id="q" type="search" value="${f.q.replace(/"/g, '&quot;')}" placeholder="Try “airpods” or “TV”"></label>
  <label>Category <select id="cat">${option('all', 'All categories', f.category)}${cats.map((c) => option(c, c, f.category)).join('')}</select></label>
  <label>Store <select id="store">${option('all', 'All stores', f.store)}${stores.map((s) => option(s, s, f.store)).join('')}</select></label>
  <label>Discount <select id="min">${option(0, 'Any discount', f.minOff)}${[20, 30, 40, 50].map((n) => option(n, n + '% off or more', f.minOff)).join('')}</select></label>
  <label>Verdict <select id="verdict">${option('all', 'Any verdict', f.verdict)}${[['new-low', 'New low'], ['strong', 'Strong price'], ['routine', 'Routine sale']].map(([v, l]) => option(v, l, f.verdict)).join('')}</select></label>
  <label>Sort <select id="sort">${Object.entries(SORTS).map(([k, v]) => option(k, v.label, f.sort)).join('')}</select></label>
</form>`;
}

function renderStats() {
  const totalSaved = deals.reduce((sum, d) => sum + saved(d), 0);
  const best = deals.slice().sort((a, b) => percentOff(b) - percentOff(a))[0];
  statsEl.innerHTML = `<span><strong>${deals.length}</strong> deals checked today</span>
<span><strong>${storesOf(deals).length}</strong> stores</span>
<span><strong>${categoriesOf(deals).length}</strong> categories</span>
<span><strong>${dollars(Math.round(totalSaved))}</strong> total savings</span>
<span>Deepest cut: <strong>${percentOff(best)}% off</strong> ${best.title}</span>`;
}

function renderList() {
  window.__shotReady = false;
  const f = readHashFilters();
  document.title = 'Bargain Beacon — Black Friday 2026 deal finder';
  const shown = applyFilters(deals, f);
  app.innerHTML = `<h1>Black Friday deals, checked today</h1>
<p class="intro">Every price below was read at the store, or in a deals source naming the store, on Friday 27 November 2026. Prices move fast — always check the store page before you buy.</p>
${controlsHtml(f)}
<p id="count" class="count">Showing ${shown.length} of ${deals.length} deals</p>
${dealListHtml(shown)}`;
  const controls = document.getElementById('controls');
  const refresh = () => {
    const next = {
      q: document.getElementById('q').value,
      category: document.getElementById('cat').value,
      store: document.getElementById('store').value,
      minOff: Number(document.getElementById('min').value),
      verdict: document.getElementById('verdict').value,
      sort: document.getElementById('sort').value,
    };
    writeHashFilters(next);
    const list = applyFilters(deals, next);
    document.getElementById('count').textContent = `Showing ${list.length} of ${deals.length} deals`;
    const grid = app.querySelector('.grid');
    const empty = app.querySelector('.empty');
    const html = dealListHtml(list);
    if (grid) grid.outerHTML = html;
    else if (empty) empty.outerHTML = html;
    else app.insertAdjacentHTML('beforeend', html);
  };
  controls.addEventListener('input', refresh);
  controls.addEventListener('change', refresh);
  renderStats();
  window.__shotReady = true;
}

function renderDeal(id) {
  window.__shotReady = false;
  const found = deals.find((d) => d.id === id);
  document.title = `${found ? found.title : 'Not found'} | Bargain Beacon`;
  app.innerHTML = found ? dealPageHtml(found) : notFoundHtml();
  renderStats();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function render() {
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) renderDeal(decodeURIComponent(match[1]));
  else renderList();
}

window.addEventListener('hashchange', render);
render();
