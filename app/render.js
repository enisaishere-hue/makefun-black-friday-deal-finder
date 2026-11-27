// HTML for the deal cards, the detail page and the compare table. Every value
// from the data is escaped before it reaches the page.

import { dollars, percentOff, saved, checkedLabel, verdictLabel } from './verdicts.js';
import { deals } from './deals.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function dealCard(d) {
  const others = d.compare ? deals.filter((x) => x.compare === d.compare && x.id !== d.id) : [];
  const compareLine = others.length
    ? `<p class="compare">Also at ${others.map((o) => `${esc(o.store)} ${dollars(o.price)}`).join(' · ')}</p>`
    : '';
  return `<article class="card">
  <div class="card-top"><span class="store">${esc(d.store)}</span><span class="cat">${esc(d.category)}</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${esc(d.title)}</a></h3>
  <p class="price-line"><span class="price">${dollars(d.price)}</span> <s class="was">${dollars(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save-line">You save ${dollars(saved(d))}</p>
  <p class="verdict verdict-${esc(d.verdict)}">${esc(verdictLabel(d))} — ${esc(d.evidence)}</p>
  ${compareLine}
  <p class="checked">Checked ${esc(checkedLabel(d.checked))} · ${esc(d.source)}</p>
  <p><a class="buy" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} ↗</a></p>
</article>`;
}

export function dealListHtml(shown) {
  if (shown.length === 0) return '<p class="empty">No deal matches those filters. Try clearing the search or lowering the discount.</p>';
  return `<div class="grid">${shown.map(dealCard).join('')}</div>`;
}

export function dealPageHtml(d) {
  const others = d.compare ? deals.filter((x) => x.compare === d.compare) : [];
  const compareTable = others.length > 1
    ? `<h2>Same product, compared</h2>
<table class="compare-table">
<thead><tr><th>Store</th><th>Sale price</th><th>Usual price</th><th>Discount</th><th>Checked</th></tr></thead>
<tbody>${others.map((o) => `<tr${o.id === d.id ? ' class="here"' : ''}><td>${esc(o.store)}</td><td>${dollars(o.price)}</td><td>${dollars(o.was)}</td><td>${percentOff(o)}% off</td><td>${esc(checkedLabel(o.checked))}</td></tr>`).join('')}</tbody>
</table>
<p>The cheapest listing today is <strong>${esc(others.slice().sort((a, b) => a.price - b.price)[0].store)} at ${dollars(others.slice().sort((a, b) => a.price - b.price)[0].price)}</strong>.</p>`
    : '';
  return `<p><a href="#/">&larr; All deals</a></p>
<h1>${esc(d.title)}</h1>
<div class="detail">
<p class="price-line big"><span class="price">${dollars(d.price)}</span> <s class="was">${dollars(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
<p class="save-line">You save ${dollars(saved(d))} at ${esc(d.store)}.</p>
<p class="verdict verdict-${esc(d.verdict)}">${esc(verdictLabel(d))} — ${esc(d.evidence)}</p>
<dl>
<dt>Store</dt><dd>${esc(d.store)}</dd>
<dt>Category</dt><dd>${esc(d.category)}</dd>
<dt>Price checked</dt><dd>${esc(checkedLabel(d.checked))}</dd>
<dt>Read in</dt><dd>${esc(d.source)}</dd>
</dl>
<p><a class="buy" href="${esc(d.url)}" target="_blank" rel="noopener">View it at ${esc(d.store)} ↗</a></p>
${compareTable}
</div>`;
}

export function notFoundHtml() {
  return '<h1>Not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>';
}
