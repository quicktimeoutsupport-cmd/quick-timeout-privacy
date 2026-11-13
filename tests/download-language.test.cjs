const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('apps/index.html','utf8');
const entry = html.slice(html.indexOf('const entryQuery ='), html.indexOf('function language()'));
function lang(query, device='ko-KR') {
 return vm.runInNewContext(entry+'; english;', {URLSearchParams, location:{search:query},navigator:{language:device}});
}
for (const app of ['qt','ab','ln','er','lt','rm']) {
 for (const campaign of ['install_20261024','growth_20261021','channel_20261103','focus_20261110']) {
  const tail = campaign==='growth_20261021'?'':'_intro';
  const q=`?campaign=${campaign}&content=${app}_android_en${tail}`;
  assert.equal(lang(q),true,`${app}/${campaign}: English creative on Korean device`);
  assert.equal(lang(q+'&lang=ko'),false,'Explicit Korean survives navigation');
  const ko=q.replace('_en','_ko');
  assert.equal(lang(ko,'en-US'),false);
  assert.equal(lang(ko+'&lang=en','en-US'),true);
 }
}
assert.equal(lang('?lang=invalid','ko-KR'),false);
assert.equal(lang('','en-US'),true);
const nav = fs.readFileSync('apps/guides/navigation.js','utf8');
for(const language of ['ko','en']) {
 const base='https://example.org/apps/guides/readmori-'+language+'.html';
 const links=[{href:new URL('../index.html',base).href},{href:'https://play.google.com/store/apps/details?id=com.readmori.readmori'},{href:new URL('readmori-ko.html',base).href}];
 const external=links[1].href;
 vm.runInNewContext(nav,{URL,URLSearchParams,location:{search:'?source=youtube&campaign=install_20261024&content=rm_android_en_rmquote',origin:'https://example.org'},document:{documentElement:{lang:language},querySelectorAll:()=>links}});
 const hub=new URL(links[0].href);
 assert.equal(hub.searchParams.get('lang'),language);
 assert.equal(hub.searchParams.get('content'),'rm_android_en_rmquote');
 assert.equal(links[1].href,external);
 assert.equal(new URL(links[2].href).searchParams.has('lang'),false);
}
console.log('PASS: six apps, four campaign generations, explicit language override, guide return, original attribution and external links');
