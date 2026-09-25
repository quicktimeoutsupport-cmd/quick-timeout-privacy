# 검색 유입 개선 공개 검토 — 2026-09-25

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
  아직 등록된 웹사이트가 없으며 URL-prefix 속성 추가 화면까지 확인함. 최초에
  열었던 `jdin240301@gmail.com` 화면에서는 제출하지 않았음.

## 공개 후 실행

1. GitHub Pages `main`에 파일을 공개한다.
2. 공개 URL, robots와 sitemap HTTP 응답 및 본문을 확인한다.
3. Search Console에 URL-prefix 속성을 추가한다.
4. GitHub Pages에 적용 가능한 소유권 확인 방법을 완료한다.
5. 루트 sitemap을 제출하고 핵심 글의 색인 요청 상태를 확인한다.

외부 공개와 Search Console 속성·사이트맵 제출은 프로젝트 `AGENTS.md`의
직전 승인 전까지 실행하지 않는다.
