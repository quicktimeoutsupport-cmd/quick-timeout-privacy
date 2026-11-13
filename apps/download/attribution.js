// Only explicit, allowlisted campaign links. No cookies, fingerprinting or analytics calls.
(() => {
  const query = new URLSearchParams(location.search);
  const sources = {youtube:'yt',instagram:'ig',tiktok:'tt',threads:'th',x:'x',pinterest:'pn'};
  const creativeByApp = {qt:['qtrcp','qtdiy'],ab:['abbed'],ln:['lncar','lndesk'],er:['errun'],lt:['lttilt'],rm:['rmquote']};
  const {app, platform, storeId} = document.body.dataset;
  const lang = document.documentElement.lang;
  const source = query.get('source'), creative = query.get('creative');
  if (query.get('campaign') !== 'discover_20261113' || !Object.hasOwn(sources,source) ||
      !creativeByApp[app]?.includes(creative) || !['android','ios'].includes(platform) || !['ko','en'].includes(lang)) return;
  // Preserve the creative's original language through an explicit language switch.
  const originLang = query.get('origin');
  if (originLang && !['ko','en'].includes(originLang)) return;
  const attributedLang = originLang || lang;
  const link = document.getElementById('download');
  if (!link) return;
  const target = new URL(link.href);
  if (target.protocol !== 'https:') return;
  if (platform === 'android' && (target.hostname !== 'play.google.com' || target.pathname !== '/store/apps/details' || target.searchParams.get('id') !== storeId)) return;
  if (platform === 'ios' && (target.hostname !== 'apps.apple.com' || !new RegExp(`^/(kr|us)/app/id${storeId}$`).test(target.pathname))) return;
  const campaign = `${sources[source]}_${app}${platform[0]}_${attributedLang}_${creative}_261113`;
  if (platform === 'android') {
    const tags = {utm_source:source,utm_medium:'organic_social',utm_campaign:campaign,utm_content:`${app}_${platform}_${attributedLang}_${creative}`};
    for (const [key,value] of Object.entries(tags)) target.searchParams.set(key,value);
    target.searchParams.set('referrer',new URLSearchParams(tags).toString());
  } else {
    target.searchParams.set('pt','129336484'); target.searchParams.set('ct',campaign); target.searchParams.set('mt','8');
  }
  link.href=target.href;
  const language = document.getElementById('language');
  if (language) {
    const alternate = new URL(language.href);
    if (alternate.origin === location.origin) {
      alternate.search = new URLSearchParams({source,campaign:'discover_20261113',creative,origin:attributedLang}).toString();
      language.href = alternate.href;
    }
  }
})();
