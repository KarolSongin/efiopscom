export {};
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [key: `ga-disable-${string}`]: boolean;
};
const banner = document.querySelector<HTMLElement>('#cookie-preferences');
const measurementId = banner?.dataset.measurementId;
const storageKey = 'efiops_cookie_preferences_v1';
const validity = 180 * 24 * 60 * 60 * 1000;
const win = window as unknown as AnalyticsWindow;
let loaded = false;
let allowed = false;
let cookieOpener: HTMLElement | null = null;
const cleanUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin + url.pathname : '';
  } catch {
    return '';
  }
};
function removeAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('=')[0])
    .filter((name) => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name));
  const parts = location.hostname.split('.');
  const domains = [
    '',
    ...parts.map((_, i) => parts.slice(i).join('.')).filter((value) => value.includes('.')),
  ];
  for (const name of names)
    for (const domain of domains)
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
}
function enableAnalytics() {
  if (!measurementId || !allowed) return;
  win[`ga-disable-${measurementId}`] = false;
  if (loaded) return;
  loaded = true;
  win.dataLayer = win.dataLayer || [];
  win.gtag = function () {
    win.dataLayer!.push(arguments);
  };
  win.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  win.gtag('consent', 'update', { analytics_storage: 'granted' });
  win.gtag('js', new Date());
  win.gtag('config', measurementId, {
    send_page_view: false,
    page_location: cleanUrl(location.href),
    page_referrer: cleanUrl(document.referrer),
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  win.gtag('event', 'page_view', {
    page_location: cleanUrl(location.href),
    page_referrer: cleanUrl(document.referrer),
    page_title: document.title,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}
function show() {
  if (!banner) return;
  banner.hidden = false;
  banner.querySelector<HTMLButtonElement>('button')?.focus();
}
function choose(analytics: boolean) {
  if (!banner || !measurementId) return;
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ version: 1, analytics, updatedAt: Date.now() }),
    );
  } catch {
    allowed = false;
    win[`ga-disable-${measurementId}`] = true;
    removeAnalyticsCookies();
    banner.querySelector<HTMLElement>('.cookie-storage-error')!.hidden = false;
    return;
  }
  allowed = analytics;
  banner.hidden = true;
  cookieOpener?.focus();
  if (analytics) enableAnalytics();
  else {
    win[`ga-disable-${measurementId}`] = true;
    removeAnalyticsCookies();
    // Unload the already-running library rather than sending cookieless pings.
    if (loaded) location.reload();
  }
}
if (banner && measurementId && /^G-[A-Z0-9]+$/.test(measurementId)) {
  document.querySelectorAll<HTMLButtonElement>('[data-cookie-settings]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => {
      cookieOpener = button;
      show();
    });
  });
  banner.querySelector('[data-consent="accept"]')?.addEventListener('click', () => choose(true));
  banner.querySelector('[data-consent="reject"]')?.addEventListener('click', () => choose(false));
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
    const age = Date.now() - stored?.updatedAt;
    if (
      stored?.version === 1 &&
      typeof stored.analytics === 'boolean' &&
      Number.isFinite(age) &&
      age >= 0 &&
      age < validity
    ) {
      allowed = stored.analytics;
      if (allowed) enableAnalytics();
      else removeAnalyticsCookies();
    } else {
      removeAnalyticsCookies();
      banner.hidden = false;
    }
  } catch {
    removeAnalyticsCookies();
    banner.hidden = false;
  }
  addEventListener('efiops:enquiry-accepted', () => {
    if (allowed) win.gtag?.('event', 'generate_lead', { page_location: cleanUrl(location.href) });
  });
  addEventListener('storage', (event) => {
    if (event.key === storageKey || event.key === null) location.reload();
  });
}
