# 검색 유입 개선 공개 및 제출 기록 — 2026-09-25

## 공개 대상

- `robots.txt`와 루트 `sitemap.xml`
- 앱 허브 canonical, Open Graph, 앱 목록 구조화 데이터
- 가이드 인덱스의 문제 해결 링크
- 앱별 한국어·영어 검색 글 8개
  - App Break: 앱 사용시간 제한 설정과 권한·배터리 확인
  - Link Now: 페어링된 Bluetooth 기기가 보이지 않을 때
  - Quick Timeout: iPhone·iPad 화면을 일정 시간 켜 두는 방법
  - 먹빼: 예상 러닝 거리 계산 방식과 0km의 의미
- 기존 한·영 기본 가이드에서 새 검색 글로 연결하는 내부 링크

## 검색 설정

- 공개 기준 URL: `https://quicktimeoutsupport-cmd.github.io/quick-timeout-privacy/`
- 제출할 사이트맵: `https://quicktimeoutsupport-cmd.github.io/quick-timeout-privacy/sitemap.xml`
- 각 새 글에 canonical, 한·영 hreflang, Open Graph와 Article/HowTo 구조화 데이터 적용
- Google Search Console은 제품 소유자가 지정한 `bonney79@gmail.com` 계정에서
  URL-prefix 속성을 만들고 HTML 파일 방식으로 소유권을 확인함. 최초에 열었던
  `jdin240301@gmail.com` 화면에서는 제출하지 않았음.

## 실행 결과

1. GitHub Pages `main`에 검색 글, 허브 수정, `robots.txt`, 루트
   `sitemap.xml`을 공개함.
2. 공개 가이드, `robots.txt`, `sitemap.xml`, Search Console 확인 파일의
   응답과 본문을 브라우저에서 확인함.
3. `bonney79@gmail.com` Search Console에
   `https://quicktimeoutsupport-cmd.github.io/quick-timeout-privacy/`
   URL-prefix 속성을 추가하고 소유권을 확인함.
4. 루트 `sitemap.xml`을 제출함. Search Console은 제출 완료 알림을 표시했지만
   최초 처리 결과는 `가져올 수 없음`, 발견된 페이지 0개로 표시됨. 사이트맵은
   공개 브라우저에서 정상 XML로 열리므로 신규 속성 및 신규 배포 직후의 재처리를
   기다린 뒤 상태를 다시 확인해야 함.
5. 다음 5개 URL은 모두 `색인 생성 요청됨`과 `우선순위 크롤링 대기열에 추가됨`
   상태를 확인함.
   - 앱 가이드 허브
   - 먹빼 예상 러닝 거리 한국어 글
   - Link Now Bluetooth 기기 한국어 글
   - Quick Timeout 화면 유지 한국어 글
   - App Break 사용시간 제한 한국어 글

## 후속 확인

- Search Console 신규 속성의 실적·색인 데이터는 현재 처리 중이며 며칠 후
  생성될 수 있음.
- 사이트맵 상태가 `성공`으로 바뀌고 발견된 페이지가 집계되는지 재확인한다.
- 색인 요청은 크롤링 우선순위 요청이며 실제 색인 또는 검색 노출을 보장하지
  않는다.

외부 공개와 Search Console 제출은 제품 소유자의 직전 승인을 받은 뒤 실행함.
