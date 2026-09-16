// Explicit channel links only: do not guess from referrer or persist visitor data.
(() => {
  const requested = new URLSearchParams(location.search).get('source');
  const source = ['youtube', 'instagram'].includes(requested) ? requested : 'direct';
  const medium = source === 'direct' ? 'unattributed' : 'profile';
  const campaign = `${source}_${medium}_202609`;
  const links = document.querySelectorAll('.install');
  ['app_break', 'link_now'].forEach((app, index) => {
    const target = new URL(links[index].href);
    target.searchParams.set('referrer', new URLSearchParams({
      utm_source: source, utm_medium: medium,
      utm_campaign: campaign, utm_content: app
    }).toString());
    links[index].href = target.href;
  });
  const apple = new URL(links[2].href);
  apple.searchParams.set('pt', '129336484');
  apple.searchParams.set('ct', campaign);
  apple.searchParams.set('mt', '8');
  links[2].href = apple.href;
})();
