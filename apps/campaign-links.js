// Explicit campaign links only. No cookies, visitor IDs or referrer inference.
(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get('source');
  const source = ['youtube', 'instagram'].includes(requested) ? requested : 'direct';
  const materials = new Set([
    'ab_pause_ko', 'ab_pause_en', 'ln_car_ko', 'ln_car_en',
    'qt_recipe_ko', 'qt_recipe_en', 'er_meal_ko', 'er_meal_en'
  ]);
  const requestedMaterial = params.get('content');
  const material = source !== 'direct' && materials.has(requestedMaterial)
    ? requestedMaterial : null;
  const medium = source === 'direct' ? 'unattributed' : 'profile';
  // Retain existing profile campaign names for continuity.
  const campaign = material ? `${source}_${material}_202609` : `${source}_${medium}_202609`;
  document.querySelectorAll('.install[data-app][data-store]').forEach(link => {
    const app = link.dataset.app;
    const target = new URL(link.href);
    if (link.dataset.store === 'android') {
      target.searchParams.set('referrer', new URLSearchParams({
        utm_source: source, utm_medium: medium,
        utm_campaign: campaign, utm_content: material || app
      }).toString());
    } else if (link.dataset.store === 'ios') {
      target.searchParams.set('pt', '129336484');
      target.searchParams.set('ct', campaign);
      target.searchParams.set('mt', '8');
    }
    link.href = target.href;
  });
})();
