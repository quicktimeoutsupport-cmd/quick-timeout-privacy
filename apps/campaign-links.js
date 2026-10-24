// Explicit campaign links only. No cookies, visitor IDs or referrer inference.
(() => {
  const params = new URLSearchParams(location.search);
  // Explicit cohort cut-over for generic profile links only. Their public
  // short URLs stay usable; recorded historical totals keep the old tokens.
  // Material-specific 202609/20261008/17/21 links retain their exact tokens.
  const profileSources = new Set(['youtube','instagram','tiktok','disquiet','sidedock','producthunt','reddit']);
  if (profileSources.has(params.get('source')) && !params.get('content') &&
      ['profile','bio'].includes(params.get('medium')) &&
      (!params.get('campaign') || params.get('campaign') === 'growth_20261017')) {
    params.set('campaign','install_20261024');
    params.set('content','all_any_bi_profile');
  }
  // A new, explicitly named cohort. Historical links below keep their tokens.
  // Language describes the originating creative; switching page language must
  // not rewrite its attribution. "bi" means a bilingual profile, not a guess.
  if (params.get('campaign') === 'install_20261024') {
    const sources = {youtube:'yt', instagram:'ig', tiktok:'tt', disquiet:'dq', sidedock:'sd', producthunt:'ph', reddit:'rd'};
    const apps = {quick_timeout:'qt', app_break:'ab', link_now:'ln', eat_run:'er', lumo_tilt:'lt'};
    const creatives = new Set(['profile','intro','qtrcp','qtdiy','errun','lttilt','abbed','lncar','lndesk']);
    const source = params.get('source');
    const match = /^(qt|ab|ln|er|lt|all)_(android|ios|any)_(ko|en|bi)_([a-z0-9]{1,7})$/.exec(params.get('content') || '');
    if (!Object.hasOwn(sources, source) || !match || !creatives.has(match[4])) return;
    const [, originApp, originPlatform, lang, creative] = match;
    if ((originApp === 'all') !== (originPlatform === 'any') ||
        (creative === 'profile') !== (originApp === 'all') ||
        (lang === 'bi' && creative !== 'profile')) return;
    document.querySelectorAll('.install[data-app][data-store]').forEach(link => {
      const app = apps[link.dataset.app], platform = link.dataset.store;
      if (!app || !['android','ios'].includes(platform)) return;
      const target = new URL(link.href);
      if (platform === 'ios' && !/^\/((kr|us)\/)?app\/(id\d+|apple-store\/id\d+)$/.test(target.pathname)) return;
      if (platform === 'ios' && target.hostname !== 'apps.apple.com') return;
      if (platform === 'android' && (target.hostname !== 'play.google.com' || target.pathname !== '/store/apps/details')) return;
      const origin = `${originApp}${originPlatform[0]}${creative}`;
      const campaign = `${sources[source]}_${app}${platform[0]}_${lang}_${origin}_261024`;
      if (platform === 'ios') {
        target.searchParams.set('pt','129336484');
        target.searchParams.set('ct',campaign);
        target.searchParams.set('mt','8');
      } else {
        const tags = {utm_source:source, utm_medium:creative === 'profile' ? 'profile' : 'organic_social',
          utm_campaign:campaign, utm_content:match[0]};
        for (const [key,value] of Object.entries(tags)) target.searchParams.set(key,value);
        target.searchParams.set('referrer',new URLSearchParams(tags).toString());
      }
      link.href = target.href;
    });
    return;
  }
  // New cohorts have explicit app/platform/language campaign IDs. Keep every
  // historical query below unchanged, including the old shared growth cohort.
  if (params.get('campaign') === 'growth_20261021') {
    const sources = {youtube:'yt', instagram:'ig', tiktok:'tt', disquiet:'dq', sidedock:'sd', producthunt:'ph', reddit:'rd'};
    const apps = {quick_timeout:'qt', app_break:'ab', link_now:'ln', eat_run:'er', lumo_tilt:'lt'};
    const source = params.get('source');
    const match = /^(qt|ab|ln|er|lt)_(android|ios)_(ko|en)$/.exec(params.get('content') || '');
    if (!Object.hasOwn(sources, source) || !match) return;
    const lang = match[3];
    document.querySelectorAll('.install[data-app][data-store]').forEach(link => {
      const app = apps[link.dataset.app];
      const platform = link.dataset.store;
      if (!app || !['android','ios'].includes(platform)) return;
      const target = new URL(link.href);
      // Only tag verified official-store links. No visitor IDs or cookies.
      if (platform === 'ios' && target.hostname !== 'apps.apple.com') return;
      if (platform === 'android' && (target.hostname !== 'play.google.com' || target.pathname !== '/store/apps/details')) return;
      const material = `${app}_${platform}_${lang}`;
      const campaign = `${sources[source]}_${material}_20261021`;
      if (platform === 'ios') {
        target.searchParams.set('pt','129336484');
        target.searchParams.set('ct',campaign);
        target.searchParams.set('mt','8');
      } else {
        target.searchParams.set('utm_source',source);
        target.searchParams.set('utm_campaign',campaign);
        target.searchParams.set('referrer',new URLSearchParams({
          utm_source:source, utm_medium:'organic_social',
          utm_campaign:campaign, utm_content:material
        }).toString());
      }
      link.href=target.href;
    });
    return;
  }
  const requested = params.get('source');
  const source = ['youtube', 'instagram'].includes(requested) ? requested : 'direct';
  const materials = new Set([
    'ab_pause_ko', 'ab_pause_en', 'ln_car_ko', 'ln_car_en',
    'qt_recipe_ko', 'qt_recipe_en', 'er_meal_ko', 'er_meal_en'
  ]);
  for (const item of ['qt_diy_ko_20261008','qt_diy_en_20261008','ab_bedtime_ko_20261008','ab_bedtime_en_20261008','ln_desk_ko_20261008','ln_desk_en_20261008','er_log_ko_20261008','er_log_en_20261008','qt_android_ko_20261017','qt_android_en_20261017','er_library_ko_20261017','er_library_en_20261017']) materials.add(item);
  const requestedMaterial = params.get('content');
  const material = source !== 'direct' && materials.has(requestedMaterial)
    ? requestedMaterial : null;
  const medium = source === 'direct' ? 'unattributed' : 'profile';
  // Retain existing profile campaign names for continuity.
  const explicitCampaign = params.get('campaign') === 'growth_20261017' ? 'growth_20261017' : null;
  const campaign = explicitCampaign || (material && /_202610(?:08|17)$/.test(material) ? `${source}_${material}` : material ? `${source}_${material}_202609` : `${source}_${medium}_202609`);
  document.querySelectorAll('.install[data-app][data-store]').forEach(link => {
    const app = link.dataset.app;
    const target = new URL(link.href);
    if (link.dataset.store === 'android') {
      if (source === 'direct') { link.href = target.href; return; }
      target.searchParams.set('utm_source', source);
      target.searchParams.set('utm_campaign', campaign);
      target.searchParams.set('referrer', new URLSearchParams({
        utm_source: source, utm_medium: medium,
        utm_campaign: campaign, utm_content: material || app
      }).toString());
    } else if (link.dataset.store === 'ios') {
      // Provider token verified in ASC Quick Timeout campaign generator on 2026-10-17.
      if (source === 'direct') { for (const key of ['pt', 'ct', 'mt']) target.searchParams.delete(key); }
      else {
        const iosCampaign = explicitCampaign ? `${source === 'youtube' ? 'yt' : 'ig'}_${explicitCampaign}` : campaign.length <= 30 ? campaign : campaign.replace(/^youtube_/, 'yt_').replace(/^instagram_/, 'ig_');
        target.searchParams.set('pt', '129336484');
        target.searchParams.set('ct', iosCampaign);
        target.searchParams.set('mt', '8');
      }
    }
    link.href = target.href;
  });
})();
