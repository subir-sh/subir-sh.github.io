import { visitorCounter } from './site-config.js';

// One common path counts a site visit, rather than adding up visits to every page.
const visitPath = '/_site-visits';
let counterRequest;

export function createVisitsReader({ siteCode, hostname, fetchCount, loadTracker }) {
  let request;
  return function read() {
    if (!siteCode || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(siteCode)) return Promise.resolve(null);
    if (request) return request;
    const origin = `https://${siteCode}.goatcounter.com`;
    request = (async () => {
      const local = /^(localhost|127(?:\.\d+){3}|\[?::1\]?)$/.test(hostname);
      // Reading a count locally is allowed; development visits never enter the total.
      if (!local) await loadTracker(`${origin}/count`, visitPath);
      const payload = await fetchCount(`${origin}/counter/${encodeURIComponent(visitPath)}.json`);
      const raw = String(payload?.count ?? '');
      if (!/^\d[\d,\s]*$/.test(raw)) return null;
      const count = Number(raw.replace(/[,\s]/g, ''));
      return Number.isSafeInteger(count) && count >= 0 ? count : null;
    })().catch(() => null);
    return request;
  };
}

function loadTracker(endpoint, path) {
  return new Promise(resolve => {
    window.goatcounter = { no_onload: true, no_events: true, endpoint };
    const script = document.createElement('script');
    script.src = 'https://gc.zgo.at/count.js';
    script.async = true;
    // A blocked analytics script must not block reading or rendering the site.
    const timeout = setTimeout(resolve, 5000);
    script.addEventListener('load', () => {
      clearTimeout(timeout);
      try { window.goatcounter.count({ path, title: 'Site visits', referrer: '' }); } catch { /* Analytics is optional. */ } finally { resolve(); }
    }, { once: true });
    script.addEventListener('error', () => { clearTimeout(timeout); resolve(); }, { once: true });
    document.head.append(script);
  });
}

export async function fetchPublicCount(url, fetcher = fetch) {
  const response = await fetcher(url, { credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(5000) });
  const payload = await response.json();
  // GoatCounter explicitly returns {count: "0"} with HTTP 404 for a new path.
  // Other failure statuses remain failures, even if they contain a zero.
  if (!response.ok && !(response.status === 404 && payload?.count === '0')) throw new Error('Visit count unavailable');
  return payload;
}

export async function showVisitorCounter(host) {
  if (!visitorCounter.siteCode) return;
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.hidden = true;
  host.append(footer);
  if (!counterRequest) counterRequest = createVisitsReader({
    siteCode: visitorCounter.siteCode,
    hostname: location.hostname,
    loadTracker,
    fetchCount: fetchPublicCount,
  })();
  const count = await counterRequest;
  if (count === null || !footer.isConnected) return;
  footer.textContent = `총 방문 ${new Intl.NumberFormat('ko-KR').format(count)}`;
  footer.hidden = false;
}
