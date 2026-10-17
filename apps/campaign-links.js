// Explicit campaign links only. No cookies, visitor IDs or referrer inference.
(() => {
  const params = new URLSearchParams(location.search);
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
