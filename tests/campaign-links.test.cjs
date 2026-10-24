const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(new URL('../apps/campaign-links.js', `file://${__filename}`),'utf8');
const base = {
  qt: {dataset:{app:'quick_timeout',store:'ios'},href:'https://apps.apple.com/kr/app/id6809292356'},
  ab: {dataset:{app:'app_break',store:'android'},href:'https://play.google.com/store/apps/details?id=com.developerbonney.pause'},
  er: {dataset:{app:'eat_run',store:'ios'},href:'https://apps.apple.com/kr/app/id6813880654'},
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
