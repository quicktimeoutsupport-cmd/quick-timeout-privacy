"""Render crawlable localized landing pages. Run from repository root."""
from pathlib import Path
from html import escape as e
import json
BASE='https://quicktimeoutsupport-cmd.github.io/quick-timeout-privacy/apps/'
# Platform-specific facts are intentionally separate from common presentation.
APPS=[
 dict(slug='quick-timeout',code='qt',icon='quick-timeout',names=['Quick Timeout','Quick Timeout'],ids={'android':'com.developerbonney.quicktimeout','ios':'6809292356'},headline=['레시피를 읽는 동안, 화면을 조금 더 오래.','Keep the recipe in view.'],copy={'android':['요리하기 전 화면 꺼짐 시간을 늘려 보세요. 10·30·45분 또는 1분부터 8시간까지 원하는 시간을 선택할 수 있어요.','Choose a longer Android screen timeout before you cook. Pick 10, 30 or 45 minutes, or a custom duration from 1 minute to 8 hours.'],'ios':['작은 PiP 상태 창을 켜 두고 레시피를 확인하세요. 10·30·45분 또는 1분부터 8시간까지 시간을 선택할 수 있어요.','Keep the small PiP status window running while you follow your recipe. Choose 10, 30 or 45 minutes, or a custom duration from 1 minute to 8 hours.']},limits={'android':['시스템 설정 변경과 알람 및 리마인더 권한이 필요합니다. 자동 복원을 켜면 선택한 시간이 지난 뒤 화면 꺼짐 시간이 15초로 돌아옵니다. 이전 사용자 설정값으로 복원하는 방식은 아닙니다.','Requires Modify system settings and Alarms & reminders access. With Auto restore on, the screen timeout returns to 15 seconds after the selected duration, rather than your previous custom setting.'],'ios':['iPhone·iPad의 자동 잠금 설정을 변경하지 않습니다. PiP 창을 닫거나 다른 앱에서 미디어를 재생하면 세션이 끝날 수 있습니다.','Does not change iPhone or iPad Auto-Lock settings. Closing PiP or playing media in another app may end the session.']},guides={'android':'quick-timeout-android','ios':'quick-timeout'},privacy='quick-timeout-privacy/privacy-policy.html'),
 dict(slug='app-break',code='ab',icon='app-break',names=['App Break','App Break'],ids={'android':'com.developerbonney.pause'},headline=['“하나만 더”가 길어지는 밤이라면.','When “one more” turns into a late night.'],copy={'android':['자꾸 열게 되는 앱에 사용 한도를 정해 보세요. 정한 한도에 도달하면 잠시 쉬어 가도록 도와줍니다.','Set a usage limit for the apps you keep opening. App Break helps you pause when you reach the limit you chose.']},limits={'android':['안내에 따라 필요한 권한을 허용해 주세요. 먼저 짧은 한도로 멈춤 안내가 표시되는지 확인하세요. 휴대폰과 Android 버전에 따라 설정이 다를 수 있습니다.','Follow the permission guidance and try a short limit first to check the pause prompt. Settings can vary by phone and Android version.']},guides={'android':'app-break'},privacy='app-break-privacy/privacy-policy.html'),
 dict(slug='link-now',code='ln',icon='link-now',names=['Link Now','Link Now'],ids={'android':'com.developerbonney.linknow'},headline=['자주 쓰는 이어폰, 또 설정에서 찾고 있나요?','Your headphones. Without the hunt.'],copy={'android':['자주 쓰는 블루투스 오디오 기기를 저장하고, 기기 카드에서 연결 과정을 시작하세요.','Save your familiar Bluetooth audio devices and open their connection flow from device cards.']},limits={'android':['먼저 Android 설정에서 페어링하고 기기 전원을 켜 주세요. 기본 모드는 시스템 블루투스 설정을 사용합니다. 연결 도우미는 별도 설정이 필요하며 동작은 기기에 따라 달라질 수 있습니다.','Pair in Android settings first and keep the device powered on. Basic mode uses system Bluetooth settings. The connection helper needs separate setup; behavior can vary by device.']},guides={'android':'link-now'},privacy='linknow-privacy/privacy-policy.html'),
 dict(slug='eat-run',code='er',icon='eat-run',names=['먹빼','EAT.RUN.'],ids={'android':'com.developerbonney.eatrun','ios':'6813880654'},headline=['뛰기 전, 오늘의 음식을 거리로 살펴보세요.','Before your run, see your day in kilometres.'],copy={'both':['입력한 음식의 열량에서 하루 필요 에너지 추정치를 뺀 뒤, 초과분을 예상 러닝 거리로 보여줍니다. 오늘 활동을 생각해 보는 재미있는 참고로 써 보세요.','EAT.RUN. subtracts your estimated full-day energy needs from the food you enter, then turns only the surplus into an estimated running distance. A playful way to think about today’s activity.']},limits={'both':['입력한 열량이 하루 필요량 이하면 0km로 표시됩니다. 추정치는 운동 처방이나 체중 감량 약속이 아니며, 실제 달린 거리를 측정하지 않습니다. 음식을 운동으로 갚아야 한다는 뜻도 아닙니다.','At or below estimated daily needs, the result is 0 km. This estimate is not a training prescription or weight-loss promise and does not track completed runs. Food does not need to be paid back through exercise.']},guides={'both':'eat-run-distance'},privacy='eat-run-privacy/privacy-policy.html'),
 dict(slug='lumo-tilt',code='lt',icon='lumo-tilt',names=['루모 틸트','LumoTilt'],ids={'android':'com.lumotilt.prototype','ios':'6823873526'},headline=['골인 바로 앞에서, 한 번만 더!','So close to the goal. One more try?'],copy={'both':['휴대폰을 기울여 빛나는 구슬을 골인 링으로 옮겨 보세요. 아슬아슬한 구간을 지나 골인하는 재미를 즐겨 보세요.','Tilt your phone to guide a glowing marble into the goal ring. Ease past a tricky turn and go for the finish.']},limits={'both':['싱글플레이 게임입니다. 기울이기 대신 드래그 조작도 사용할 수 있습니다. 이용 전 해당 스토어의 연령등급을 확인하세요.','A single-player game, with drag controls as an alternative to tilting. Check the age rating in your store before downloading.']},guides={'both':'lumo-tilt'},privacy='lumo-tilt-privacy/privacy.html'),
 dict(slug='readmori',code='rm',icon='readmori',names=['리드모리','Readmori'],ids={'android':'com.readmori.readmori','ios':'6821009705'},headline=['그 문장, 어느 책이었더라?','You remember the line. But which book?'],copy={'both':['책 속 문장을 촬영하고, 남기고 싶은 부분과 내 생각을 함께 저장하세요. 책별로 모아 두거나 검색으로 다시 찾을 수 있어요.','Photograph a passage, keep the lines that matter and add your thoughts. Browse your notes by book or search for a passage later.']},limits={'both':['한국어·영어 글자 인식을 지원합니다. 인식한 내용은 원문과 비교해 확인하세요. 노트는 기기에 저장되므로 앱 삭제나 기기 변경 전 백업이 필요합니다.','Text recognition supports Korean and English. Check recognized text against the page. Notes are stored on your device, so keep a backup before deleting the app or changing devices.']},guides={'both':'readmori'},privacy='quick-timeout-privacy/readmori/privacy-policy.html')
]
out=Path('apps/download'); out.mkdir(exist_ok=True)
manifest=[]
for app in APPS:
 for platform,storeid in app['ids'].items():
  for i,lang in enumerate(['ko','en']):
   other='en' if lang=='ko' else 'ko'; name=app['names'][i]; headline=app['headline'][i]
   copy=app['copy'].get(platform,app['copy'].get('both'))[i]; limit=app['limits'].get(platform,app['limits'].get('both'))[i]
   slug=f"{app['slug']}-{platform}-{lang}.html"; canonical=BASE+'download/'+slug
   guide=app['guides'].get(platform,app['guides'].get('both'))
   store=f'https://play.google.com/store/apps/details?id={storeid}&hl={lang}' if platform=='android' else f"https://apps.apple.com/{'kr' if lang=='ko' else 'us'}/app/id{storeid}"
   icon=app['icon']+(f'-{lang}' if app['code']=='er' else '')+'.png'
   platformlabel='Android' if platform=='android' else 'iPhone · iPad'
   cta=('Google Play에서 다운로드' if platform=='android' else 'App Store에서 다운로드') if lang=='ko' else ('Get it on Google Play' if platform=='android' else 'Download on the App Store')
   title=f'{name} · {headline}'
   html=f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(copy)}">
<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="ko" href="{BASE}download/{app['slug']}-{platform}-ko.html">
<link rel="alternate" hreflang="en" href="{BASE}download/{app['slug']}-{platform}-en.html">
<meta property="og:type" content="website"><meta property="og:locale" content="{'ko_KR' if lang=='ko' else 'en_US'}">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(copy)}"><meta property="og:url" content="{canonical}">
<meta property="og:image" content="{BASE}icons/{icon}"><meta property="og:image:alt" content="{e(name)}">
<meta name="twitter:card" content="summary"><meta name="theme-color" content="#f7f7f2">
<link rel="stylesheet" href="download.css"><script defer src="attribution.js"></script></head>
<body data-app="{app['code']}" data-platform="{platform}" data-store-id="{storeid}">
<header><a class="brand" href="../?lang={lang}">Bonney Apps</a><a id="language" href="{app['slug']}-{platform}-{other}.html" lang="{other}" hreflang="{other}">{'English' if lang=='ko' else '한국어'}</a></header>
<main><div class="identity"><img src="../icons/{icon}" width="64" height="64" alt=""><div><p class="name">{e(name)}</p><p class="platform">{platformlabel}</p></div></div>
<h1>{e(headline)}</h1><p class="intro">{e(copy)}</p>
<a id="download" class="cta" href="{e(store)}">{cta}<span aria-hidden="true"> ↗</span></a>
<p class="price">{'무료 · 앱 내 광고 포함' if lang=='ko' else 'Free · Contains ads'}</p>
<section class="note"><h2>{'시작하기 전에' if lang=='ko' else 'Before you start'}</h2><p>{e(limit)}</p><a href="../guides/{guide}-{lang}.html">{'사용 방법 보기' if lang=='ko' else 'Read the guide'} <span aria-hidden="true">→</span></a></section>
</main><footer><a href="https://quicktimeoutsupport-cmd.github.io/{app['privacy']}">{'개인정보처리방침' if lang=='ko' else 'Privacy policy'}</a><a href="mailto:quicktimeout.support@gmail.com">{'문의' if lang=='ko' else 'Contact'}</a></footer>
</body></html>
'''
   (out/slug).write_text(html)
   manifest.append(dict(path='apps/download/'+slug,code=app['code'],platform=platform,lang=lang,storeId=storeid,url=canonical))
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Rendered {len(manifest)} pages')
# Keep new crawlable URLs discoverable without changing historical campaign URLs.
import xml.etree.ElementTree as ET
ns='http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('',ns)
for sitemap in [Path('sitemap.xml'),Path('apps/guides/sitemap.xml')]:
 tree=ET.parse(sitemap); root=tree.getroot()
 existing={node.find('{'+ns+'}loc').text:node for node in root}
 for lang in ['ko','en']:
  guideurl=BASE+f'guides/quick-timeout-android-{lang}.html'
  if guideurl in existing:
   node=existing[guideurl]; modified=node.find('{'+ns+'}lastmod')
   if modified is None: modified=ET.SubElement(node,'{'+ns+'}lastmod')
   modified.text='2026-11-13'
 if sitemap==Path('sitemap.xml'):
  for page in manifest:
   if page['url'] not in existing:
    node=ET.SubElement(root,'{'+ns+'}url'); ET.SubElement(node,'{'+ns+'}loc').text=page['url']; ET.SubElement(node,'{'+ns+'}lastmod').text='2026-11-13'
 ET.indent(tree,space='  ');tree.write(sitemap,encoding='utf-8',xml_declaration=True)
