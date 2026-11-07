const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(new URL('../apps/campaign-links.js', `file://${__filename}`),'utf8');
const base = {
  qt: {dataset:{app:'quick_timeout',store:'ios'},href:'https://apps.apple.com/kr/app/id6809292356'},
  ab: {dataset:{app:'app_break',store:'android'},href:'https://play.google.com/store/apps/details?id=com.developerbonney.pause'},
  er: {dataset:{app:'eat_run',store:'ios'},href:'https://apps.apple.com/kr/app/id6813880654'},
  rmIos: {dataset:{app:'readmori',store:'ios'},href:'https://apps.apple.com/kr/app/id6821009705'},
  rmAndroid: {dataset:{app:'readmori',store:'android'},href:'https://play.google.com/store/apps/details?id=com.readmori.readmori'},
  hostile: {dataset:{app:'eat_run',store:'ios'},href:'https://example.org/keep'}
};
function run(query) {
  const links=structuredClone(base);
  vm.runInNewContext(code,{URL,URLSearchParams,location:{search:query},document:{querySelectorAll:()=>Object.values(links)}});
  return links;
}
// A language or platform collision prevents a meaningful experiment.
const tokens=new Set();
for(const source of ['youtube','instagram','tiktok','disquiet','sidedock','producthunt','reddit']) {
  for(const lang of ['ko','en']) {
    const links=run(`?source=${source}&campaign=growth_20261021&content=qt_ios_${lang}`);
    for(const key of ['qt','er']) {
      const u=new URL(links[key].href), token=u.searchParams.get('ct');
      assert.equal(u.searchParams.get('pt'),'129336484');
      assert.ok(token.length<=30);
      assert.ok(!tokens.has(token)); tokens.add(token);
      assert.ok(token.includes(`_ios_${lang}_`));
    }
    const a=new URL(links.ab.href);
    assert.equal(a.searchParams.get('id'),'com.developerbonney.pause');
    const ref=new URLSearchParams(a.searchParams.get('referrer'));
    assert.equal(ref.get('utm_source'),source);
    assert.equal(ref.get('utm_content'),`ab_android_${lang}`);
    assert.equal(ref.get('utm_campaign'),a.searchParams.get('utm_campaign'));
    assert.equal(links.hostile.href,base.hostile.href);
  }
}
for(const query of ['', '?source=unknown&campaign=growth_20261021&content=qt_ios_ko', '?source=youtube&campaign=growth_20261021&content=../bad']) {
  const result=run(query);
  for(const key of ['qt','ab','er']) assert.equal(result[key].href,base[key].href);
}
const legacy=run('?source=youtube&campaign=growth_20261017&content=qt_android_ko_20261017');
assert.equal(new URL(legacy.qt.href).searchParams.get('ct'),'yt_growth_20261017');
assert.equal(new URLSearchParams(new URL(legacy.ab.href).searchParams.get('referrer')).get('utm_campaign'),'growth_20261017');
console.log('PASS: 7 channels × 2 languages; app/platform separation, official destinations, invalid input and legacy cohort continuity');
const seenNew = new Set();
for (const source of ['youtube','instagram','tiktok','disquiet','sidedock','producthunt','reddit']) {
 for (const lang of ['ko','en']) {
  for (const origin of ['qt_ios','qt_android','er_ios']) {
   const result=run(`?source=${source}&campaign=install_20261024&content=${origin}_${lang}_intro`);
   for (const key of ['qt','er','ab']) {
    const u=new URL(result[key].href), t=u.searchParams.get(key==='ab'?'utm_campaign':'ct');
    assert.ok(t && t.length<=30);
    assert.ok(!seenNew.has(t),t); seenNew.add(t);
    if(key==='ab') {
     const r=new URLSearchParams(u.searchParams.get('referrer'));
     assert.equal(r.get('utm_content'),`${origin}_${lang}_intro`);
     assert.equal(r.get('utm_campaign'),t);
     assert.equal(u.searchParams.get('utm_content'),r.get('utm_content'));
    }
   }
   assert.equal(result.hostile.href,base.hostile.href);
  }
 }
 const profile=run(`?source=${source}&campaign=install_20261024&content=all_any_bi_profile`);
 assert.ok(new URL(profile.qt.href).searchParams.get('ct').includes('_bi_'));
}
for(const content of ['all_any_ko_intro','qt_ios_bi_intro','qt_ios_ko_bad','qt_any_ko_intro','all_ios_en_profile','qt_ios_ko_profile','../../bad']) {
 const r=run(`?source=youtube&campaign=install_20261024&content=${content}`);
 for(const k of ['qt','er','ab']) assert.equal(r[k].href,base[k].href);
}
console.log('PASS: new cohort separates source/creative/language and origin/destination app/platform; profile language stays bilingual');
for(const source of ['youtube','instagram','tiktok','disquiet','sidedock','producthunt','reddit']) {
 const profile=run(`?source=${source}&medium=profile&campaign=growth_20261017`);
 assert.ok(new URL(profile.qt.href).searchParams.get('ct').endsWith('_261024'));
 assert.ok(new URL(profile.qt.href).searchParams.get('ct').includes('_bi_'));
}
console.log('PASS: generic profile links use a declared new cohort; old material links retain old cohorts');
for(const source of ['youtube','instagram']) {
 const r=run(`?source=${source}`);
 assert.ok(new URL(r.qt.href).searchParams.get('ct').endsWith('_261024'));
 assert.notEqual(new URL(r.qt.href).searchParams.get('ct'),new URL(r.er.href).searchParams.get('ct'));
}
console.log('PASS: verified bonney-yt / bonney-ig bare profile destinations are covered');

// Regression: profile visitors could install Readmori, but lost their source.
for(const source of ['youtube','instagram','tiktok','disquiet','sidedock','producthunt','reddit']) {
 for(const query of [
  `?source=${source}&medium=profile`,
  `?source=${source}&campaign=install_20261024&content=rm_ios_ko_rmquote`,
  `?source=${source}&campaign=install_20261024&content=rm_android_en_rmquote`,
  `?source=${source}&campaign=growth_20261021&content=rm_ios_ko`
 ]) {
  const r=run(query), ios=new URL(r.rmIos.href), android=new URL(r.rmAndroid.href);
  assert.equal(ios.pathname,'/kr/app/id6821009705');
  assert.equal(ios.searchParams.get('pt'),'129336484');
  assert.ok(ios.searchParams.get('ct').length<=30);
  assert.equal(android.searchParams.get('id'),'com.readmori.readmori');
  assert.equal(android.searchParams.get('utm_source'),source);
  const ref=new URLSearchParams(android.searchParams.get('referrer'));
  assert.equal(ref.get('utm_campaign'),android.searchParams.get('utm_campaign'));
  assert.notEqual(ios.searchParams.get('ct'),android.searchParams.get('utm_campaign'));
  assert.equal(r.hostile.href,base.hostile.href);
 }
}
for(const source of ['youtube','instagram']) {
 const r=run(`?source=${source}`);
 assert.ok(new URL(r.rmIos.href).searchParams.get('ct'));
 assert.ok(new URL(r.rmAndroid.href).searchParams.get('referrer'));
}
for(const key of ['rmIos','rmAndroid']) assert.equal(run('')[key].href,base[key].href);
console.log('PASS: Readmori profile and creative attribution preserves exact stores and platform separation');

// Exercise the current download page itself so a stale fixture cannot hide a
// missing destination or accidentally advertise a platform still in review.
const hubHtml=fs.readFileSync(new URL('../apps/index.html',`file://${__filename}`),'utf8');
const publicLinks=[...hubHtml.matchAll(/<a class="install" data-app="([^"]+)" data-store="([^"]+)" href="([^"]+)"/g)]
 .map(([,app,store,href])=>({dataset:{app,store},href}));
assert.equal(publicLinks.length,9);
assert.ok(!publicLinks.some(x=>x.dataset.app==='lumo_tilt' && x.dataset.store==='android'));
assert.ok(!publicLinks.some(x=>x.dataset.app==='app_break' && x.dataset.store==='ios'));
const rejectedLinks=[
 {dataset:{app:'readmori',store:'ios'},href:'https://example.org/app/id6821009705'},
 {dataset:{app:'readmori',store:'ios'},href:'https://apps.apple.com/kr/app/id6809292356'},
 {dataset:{app:'readmori',store:'android'},href:'https://play.google.com/store/apps/details?id=wrong.package'},
 {dataset:{app:'readmori',store:'android'},href:'http://play.google.com/store/apps/details?id=com.readmori.readmori'},
 {dataset:{app:'lumo_tilt',store:'android'},href:'https://play.google.com/store/apps/details?id=com.example.lumo'},
 {dataset:{app:'app_break',store:'ios'},href:'https://apps.apple.com/kr/app/id1234567890'}
];
const channelBase=[...publicLinks,...rejectedLinks];
function runChannel(query) {
 const links=structuredClone(channelBase);
 vm.runInNewContext(code,{URL,URLSearchParams,location:{search:query},document:{querySelectorAll:()=>links}});
 return links;
}
const channelTokens=new Set();
for(const source of ['threads','x','pinterest']) {
 for(const lang of ['ko','en']) {
  for(const origin of ['qt_android','qt_ios','qt_both','ab_android','ln_android','er_android','er_ios','er_both','lt_ios','rm_android','rm_ios','rm_both']) {
   const content=`${origin}_${lang}_rmquote`;
   const links=runChannel(`?source=${source}&campaign=channel_20261103&content=${content}`);
   assert.equal(links.length,channelBase.length);
   links.slice(0,publicLinks.length).forEach((link,index)=>{
    const before=new URL(publicLinks[index].href), after=new URL(link.href);
    assert.equal(after.origin,before.origin);
    assert.equal(after.pathname,before.pathname);
    assert.equal(after.searchParams.get('id'),before.searchParams.get('id'));
    const token=after.searchParams.get(link.dataset.store==='ios'?'ct':'utm_campaign');
    assert.ok(token && token.length<=30,token);
    assert.ok(!channelTokens.has(token),token); channelTokens.add(token);
    assert.ok(token.includes(`_${lang}_`));
    if(link.dataset.store==='android') {
     const ref=new URLSearchParams(after.searchParams.get('referrer'));
     assert.equal(ref.get('utm_source'),source);
     assert.equal(ref.get('utm_medium'),'organic_social');
     assert.equal(ref.get('utm_campaign'),token);
     assert.equal(ref.get('utm_content'),content);
     for(const [key,value] of ref) assert.equal(after.searchParams.get(key),value);
    } else {
     assert.equal(after.searchParams.get('pt'),'129336484');
     assert.equal(after.searchParams.get('mt'),'8');
    }
   });
   assert.deepEqual(links.slice(publicLinks.length),rejectedLinks);
  }
 }
}
for(const content of ['lt_android_ko_intro','ab_ios_en_intro','ab_both_ko_intro','ln_both_en_intro','rm_any_ko_intro','rm_both_bi_intro','rm_both_ko_unknown','../bad']) {
 assert.deepEqual(runChannel(`?source=threads&campaign=channel_20261103&content=${content}`),channelBase);
}
assert.deepEqual(runChannel('?source=unknown&campaign=channel_20261103&content=rm_both_ko_rmquote'),channelBase);
console.log(`PASS: channel_20261103 has ${channelTokens.size} distinct source/origin/destination/language tokens; 9 current stores preserved; invalid destinations and unreleased platforms unchanged`);

for(const lang of ['ko','en']) {
 const html=fs.readFileSync(new URL(`../apps/guides/readmori-${lang}.html`,`file://${__filename}`),'utf8');
 assert.equal((html.match(/class="install"/g)||[]).length,2);
 assert.ok(html.includes('https://play.google.com/store/apps/details?id=com.readmori.readmori'));
 assert.ok(html.includes(`https://apps.apple.com/${lang==='ko'?'kr':'us'}/app/id6821009705`));
 assert.ok(!/정식 출시 준비|심사 대기|비공개 테스트|Preparing for (public )?release|waiting for review|closed testing/.test(html));
 assert.ok(html.includes('../campaign-links.js?v=20261103'));
}
console.log('PASS: Readmori KO/EN guides have current availability and both exact store destinations');
