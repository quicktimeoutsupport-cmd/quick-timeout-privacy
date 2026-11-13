const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const manifest=JSON.parse(fs.readFileSync('apps/download/manifest.json'));
const code=fs.readFileSync('apps/download/attribution.js','utf8');
const creatives={qt:['qtrcp','qtdiy'],ab:['abbed'],ln:['lncar','lndesk'],er:['errun'],lt:['lttilt'],rm:['rmquote']};
const sources=['youtube','instagram','tiktok','threads','x','pinterest'];
const tokens=new Set();
function run(page,query,override) {
 const html=fs.readFileSync(page.path,'utf8');
 const original=html.match(/id="download" class="cta" href="([^"]+)"/)[1].replaceAll('&amp;','&');
 const link={href:override||original};
 const language={href:new URL(html.match(/id="language" href="([^"]+)"/)[1],page.url).href};
 vm.runInNewContext(code,{URL,URLSearchParams,location:{search:query,origin:new URL(page.url).origin},document:{body:{dataset:{app:page.code,platform:page.platform,storeId:page.storeId}},documentElement:{lang:page.lang},getElementById:id=>id==='download'?link:language}});
 return {target:new URL(link.href),language:new URL(language.href),original};
}
assert.equal(manifest.length,20);
for(const page of manifest) {
 const html=fs.readFileSync(page.path,'utf8');
 assert.ok(html.includes(`<html lang="${page.lang}">`));
 assert.ok(html.includes(`<link rel="canonical" href="${page.url}">`));
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 assert.ok(html.includes(`property="og:title" content="${title}"`));
 if(page.lang==='en') assert.ok(!/[가-힣]/.test(title),'English social preview');
 assert.equal((html.match(/id="download"/g)||[]).length,1);
 for(const path of [...html.matchAll(/(?:href|src)="([^"?]+)"/g)].map(x=>x[1])) {
  if(!/^(https:|mailto:)/.test(path) && path!=='../') assert.ok(fs.existsSync(require('node:path').resolve(require('node:path').dirname(page.path),path)),path);
 }
 for(const source of sources) for(const creative of creatives[page.code]) {
  const query=`?source=${source}&campaign=discover_20261113&creative=${creative}`;
  const {target,language}=run(page,query);
  const token=target.searchParams.get(page.platform==='ios'?'ct':'utm_campaign');
  assert.ok(token && token.length<=30);
  assert.ok(!tokens.has(token),`collision ${token}`); tokens.add(token);
  assert.equal(language.searchParams.get('origin'),page.lang);
  if(page.platform==='android') {
   const ref=new URLSearchParams(target.searchParams.get('referrer'));
   assert.equal(ref.get('utm_campaign'),token);
   assert.equal(target.searchParams.get('id'),page.storeId);
  } else assert.ok(target.pathname.endsWith('id'+page.storeId));
  const other=manifest.find(x=>x.code===page.code&&x.platform===page.platform&&x.lang!==page.lang);
  const switched=run(other,language.search);
  assert.equal(switched.target.searchParams.get(page.platform==='ios'?'ct':'utm_campaign'),token);
 }
 for(const query of ['', '?source=unknown&campaign=discover_20261113&creative='+creatives[page.code][0], '?source=threads&campaign=focus_20261110&creative='+creatives[page.code][0], '?source=threads&campaign=discover_20261113&creative=bad', '?source=threads&campaign=discover_20261113&creative='+creatives[page.code][0]+'&origin=bad']) {
  const r=run(page,query);assert.equal(r.target.href,new URL(r.original).href);
 }
 const query='?source=threads&campaign=discover_20261113&creative='+creatives[page.code][0];
 for(const bad of ['https://evil.example/app','http://play.google.com/store/apps/details?id='+page.storeId,'https://play.google.com/store/apps/details?id=wrong','https://apps.apple.com/us/app/id999']) assert.equal(run(page,query,bad).target.href,new URL(bad).href);
}
console.log(`PASS: 20 static language/platform pages; ${tokens.size} unique source/creative tokens; destination validation; no-JS links; language-switch attribution; legacy/invalid input excluded`);
const sitemap=fs.readFileSync('sitemap.xml','utf8');
for(const page of manifest) assert.equal(sitemap.split(`<loc>${page.url}</loc>`).length-1,1,'New page present exactly once in sitemap');
console.log('PASS: all new canonical pages in sitemap');
