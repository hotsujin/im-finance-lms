/* ===================================================================
   app.js — 해시 라우팅 SPA + 렌더링 + 공유 보드(localStorage)
   페이지: #/(홈) · #/guide(학습 가이드) · #/board(공유 보드 목록)
          · #/board/<id>(실습별 공유 보드) · #/slides(강의 장표)
          · #/resources(자료실) · #/lab/<id>(실습 상세) · #/data/<key>(데이터 원본)
   =================================================================== */

const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- 헤더 / 푸터 ---------- */
function header() {
  const links = [
    ["#/", "홈"], ["#/guide", "학습 가이드"], ["#/board", "공유 보드"],
    ["#/resources", "자료실"],
  ];
  const cur = location.hash || "#/";
  return `
  <header class="site-header">
    <div class="wrap nav">
      <a class="brand-mark" href="#/">
        <span class="logo">iM</span>
        <span class="name">iM금융 데이터 심화<small>ChatGPT 데이터 실습 · 8시간</small></span>
      </a>
      <button class="nav-toggle" aria-label="메뉴" onclick="document.getElementById('navlinks').classList.toggle('open')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <nav class="nav-links" id="navlinks">
        ${links.map(([h, t]) => `<a href="${h}" class="${cur === h ? "active" : ""}">${t}</a>`).join("")}
      </nav>
    </div>
  </header>`;
}
function footer() {
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div>
          <a class="brand-mark" href="#/"><span class="logo">iM</span>
            <span class="name">iM금융 데이터 기반 심화 과정<small>강사 ${esc(CONTACT.instructor)}</small></span></a>
        </div>
        <div class="footer-contact">
          <b>Contact</b>
          <div>문의 · <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></div>
          <div style="margin-top:6px">강사 ${esc(CONTACT.instructor)}</div>
        </div>
        <div class="footer-contact">
          <b>바로가기</b>
          <div class="footer-links" style="flex-direction:column;gap:8px;margin-top:4px">
            <a href="#/guide">학습 가이드</a><a href="#/board">공유 보드</a>
            <a href="#/resources">자료실</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>${esc(CONTACT.copyright)}</span>
        <span>ChatGPT Plus 전용 · 로그인 없는 공유</span>
      </div>
    </div>
  </footer>`;
}

/* ---------- 홈 ---------- */
function homeView() {
  return `
  ${header()}
  <main>
    <!-- 히어로 -->
    <section class="hero">
      <div class="wrap">
        <p class="eyebrow">iM금융그룹 임직원 심화반 · 데이터 실무</p>
        <h1>${esc(COURSE.hero)}</h1>
        <p class="sub">${esc(COURSE.heroSub)}</p>
        <div class="hero-meta">${COURSE.chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
        <div class="hero-cta">
          <a class="btn btn--gold" href="#/guide">학습 가이드 보기</a>
          <a class="btn btn--ghost" href="#labs">실습 둘러보기</a>
        </div>
      </div>
    </section>

    <!-- 훈련 목표 -->
    <section class="section" id="goals">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">훈련 목표</p>
          <h2>하루가 끝나면, ChatGPT만으로 이만큼 합니다</h2>
          <p class="lead">${esc(GOAL_LINE)}</p>
        </div>
        <ul class="goal-list">
          ${GOALS.map((g, i) => `<li><span class="num">${i + 1}</span><span>${esc(g)}</span></li>`).join("")}
        </ul>
      </div>
    </section>

    <!-- 주요 훈련 내용 -->
    <section class="section section--surface">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">주요 훈련 내용</p>
          <h2>정제·분석·자동화, 다섯 갈래로 익힙니다</h2>
        </div>
        <div class="content-rows">
          ${CONTENT_ROWS.map((r, i) => `
            <div class="content-row">
              <div class="idx">${String(i + 1).padStart(2, "0")}</div>
              <div><h3>${esc(r.t)}</h3><p>${esc(r.d)}</p></div>
            </div>`).join("")}
        </div>
      </div>
    </section>

    <!-- How you learn -->
    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">진행 방식</p>
          <h2>모든 실습은 3단계로 진행합니다</h2>
        </div>
        <div class="grid grid-3">
          ${HOW.map((s) => `
            <div class="card step-card">
              <div class="step-no">${esc(s.no)}</div>
              <h3>${esc(s.t)}</h3><p>${esc(s.d)}</p>
            </div>`).join("")}
        </div>
      </div>
    </section>

    <!-- 타임테이블 -->
    <section class="section section--surface" id="schedule">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">타임테이블</p>
          <h2>하루 일정 (09:00–18:00)</h2>
          <p class="lead">교시 사이에 짧게 쉬고, 점심은 한 시간입니다. 콜센터까지 실습 여섯 개는 모두 필수입니다.</p>
        </div>
        <div class="table-wrap">
          <table class="schedule">
            <thead><tr><th>시간</th><th>내용</th><th>산출물</th><th>구분</th></tr></thead>
            <tbody>
              ${SCHEDULE.map((s) => `
                <tr>
                  <td class="t-time">${esc(s.time)}</td>
                  <td class="t-title">${s.title}</td>
                  <td>${esc(s.out)}</td>
                  <td><span class="tag tag--${s.tag[0]}">${esc(s.tag[1])}</span></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 실습 -->
    <section class="section" id="labs">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">실습</p>
          <h2>실습 6개</h2>
          <p class="lead">콜센터 로그 분석까지 여섯 개, 실습마다 목표·활용 기능·예상 산출물이 분명합니다. 카드를 눌러 상세를 확인하세요.</p>
        </div>
        <div class="grid grid-2">
          ${LABS.map((l) => labCard(l)).join("")}
        </div>
      </div>
    </section>

  </main>
  ${footer()}`;
}

function labCard(l) {
  return `
  <a class="card is-link lab-card" href="#/lab/${l.id}">
    <div class="lab-no">${esc(l.no)}</div>
    <h3>${esc(l.title)}</h3>
    <div class="lab-meta"><code>${esc(l.feature)}</code> · ${esc(l.dur)} · 데이터 ${esc(l.data)}</div>
    <div class="lab-prompt">${esc(l.prompt)}</div>
    <div class="lab-out">산출물 · <b>${esc(l.out)}</b></div>
    <div class="lab-foot">
      <span class="btn btn--ghost btn--sm">실습 상세 보기 →</span>
    </div>
  </a>`;
}

/* ---------- 학습 가이드 ---------- */
function guideView() {
  return `
  ${header()}
  <main>
    <section class="detail-hero">
      <div class="wrap">
        <p class="eyebrow">Learning Guide</p>
        <h1>학습 가이드</h1>
        <p>하루 흐름과 준비물, 진행 방식, 안전수칙을 한눈에 봅니다. 세부 절차는 강의 중 슬라이드로 함께 다룹니다.</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">목표</p><h2>이 강의로 무엇을 얻나</h2><p class="lead">${esc(GOAL_LINE)}</p></div>
        <ul class="goal-list">${GOALS.map((g, i) => `<li><span class="num">${i + 1}</span><span>${esc(g)}</span></li>`).join("")}</ul>
      </div>
    </section>
    <section class="section section--surface">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">시작 전 5분 점검</p><h2>준비물</h2></div>
        <div class="card">
          <ul class="goal-list">
            <li><span class="num">✓</span><span><b>ChatGPT Plus 로그인.</b> 무료 요금제로는 고급 데이터 분석·웹 브라우징·나만의 GPT·에이전트가 제한됩니다.</span></li>
            <li><span class="num">✓</span><span>입력창 <b>+(첨부)</b> 버튼으로 파일을 올릴 수 있는지 미리 확인해 둡니다.</span></li>
            <li><span class="num">✓</span><span>실습에 쓰는 데이터는 강의 중에 제공합니다. 미리 받을 필요는 없고, 화면에서 원본을 미리 볼 수 있습니다. <a href="#/lab/1" style="color:var(--brand);font-weight:700">실습 상세에서 데이터 원본 보기 →</a></span></li>
            <li><span class="num">✓</span><span>데이터는 모두 <b>가상</b>입니다. 실제 고객·계좌가 아니니 마음껏 실습하세요.</span></li>
          </ul>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">진행 방식</p><h2>모든 실습 공통 3단계</h2></div>
        <div class="grid grid-3">
          ${HOW.map((s) => `<div class="card step-card"><div class="step-no">${esc(s.no)}</div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join("")}
        </div>
      </div>
    </section>
    <section class="section section--surface">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">금융 실무자 필수</p><h2>안전수칙</h2></div>
        <div class="card"><ul class="goal-list">
          ${SAFETY.map((s) => `<li><span class="num">!</span><span>${esc(s.replace("🚨 ", ""))}</span></li>`).join("")}
        </ul></div>
        <div class="res-note" style="margin-top:22px"><b>한 줄 점검</b> — ${esc(CHECK_ONELINE)}</div>
      </div>
    </section>
  </main>
  ${footer()}`;
}

/* ---------- 실습 상세 ---------- */
function labDetailView(id) {
  const l = LABS.find((x) => x.id === id);
  if (!l) return notFound();
  return `
  ${header()}
  <main>
    <section class="detail-hero">
      <div class="wrap">
        <a class="back-link" href="#labs" onclick="setTimeout(()=>location.hash='#/',0)">← 모든 실습</a>
        <p class="eyebrow">${esc(l.no)} · ${esc(l.feature)}</p>
        <h1>${esc(l.title)}</h1>
        <p>${esc(l.purpose)}</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap detail-body">
        <div class="prose">
          <h2>목표 — 이 실습으로 무엇을 배울까</h2>
          <ul>${l.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>

          <h2>활용 기능 — ChatGPT의 어떤 기능을 쓰나</h2>
          <div class="feat-list">
            ${l.features.map((f) => `
              <div class="feat">
                <div class="feat-name">${esc(f.n)}</div>
                <div class="feat-desc">${esc(f.d)}</div>
              </div>`).join("")}
          </div>

          <h2>예상 산출물 — 무엇을 만들까</h2>
          <ol>${l.deliverables.map((d) => `<li>${esc(d)}</li>`).join("")}</ol>
        </div>
        <aside class="detail-side">
          <div class="side-box">
            <h4>실습 정보</h4>
            <div class="kv"><b>활용 기능</b>${esc(l.feature)}</div>
            <div class="kv"><b>시간</b>${esc(l.dur)}</div>
            <div class="kv"><b>데이터</b>${esc(l.data)}</div>
            <div class="kv"><b>산출물</b>${esc(l.out)}</div>
          </div>
          <div class="side-box">
            <h4>데이터 원본 보기</h4>
            <p class="side-note">이 실습에서 쓰는 <code>${esc(l.dataKey)}.csv</code> 원본을 화면에서 그대로 봅니다.</p>
            <a class="btn btn--gold btn--sm" href="#/data/${l.dataKey}">데이터 원본 보기 →</a>
          </div>
          <div class="side-box">
            <h4>실제 GPT 채팅 보기</h4>
            <p class="side-note">강사가 시연한 실제 대화 링크가 들어갈 자리입니다.</p>
            <button class="btn btn--ghost btn--sm" disabled>준비 중</button>
          </div>
          <div class="side-box">
            <h4>공유 보드</h4>
            <p class="side-note">${esc(l.no)} 결과를 올리고, 옆 사람 것과 견줘 봅니다.</p>
            <a class="btn btn--ghost btn--sm" href="#/board/${l.id}">${esc(l.no)} 공유 보드 →</a>
          </div>
        </aside>
      </div>
    </section>
  </main>
  ${footer()}`;
}

/* ---------- 데이터 원본 보기 (다운로드 없이 표 미리보기) ---------- */
function dataView(key) {
  const lab = LABS.find((x) => x.dataKey === key);
  const d = (typeof DATA_PREVIEW !== "undefined") ? DATA_PREVIEW[key] : null;
  if (!d) return notFound();
  const labLink = lab ? `<a class="back-link" href="#/lab/${lab.id}">← ${esc(lab.no)} 상세로</a>` : `<a class="back-link" href="#/">← 홈</a>`;
  const shown = d.rows.length;
  return `
  ${header()}
  <main>
    <section class="detail-hero">
      <div class="wrap">
        ${labLink}
        <p class="eyebrow">데이터 원본 보기${lab ? " · " + esc(lab.no) : ""}</p>
        <h1>${esc(key)}.csv</h1>
        <p>전체 약 ${d.total.toLocaleString("ko-KR")}행 중 위 ${shown}행을 미리 봅니다. 다운로드 없이 화면에서만 확인하세요. 데이터는 모두 가상입니다.</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="data-table-wrap">
          <table class="data-table">
            <thead><tr>${d.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
            <tbody>
              ${d.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell === "" ? '<span class="na">—</span>' : esc(cell)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="res-note" style="margin-top:18px">전체 원본을 보는 ‘보기 전용 시트’ 링크는 준비 중입니다. <button class="btn btn--ghost btn--sm" disabled style="margin-left:8px">보기 전용 시트 (준비 중)</button></div>
      </div>
    </section>
  </main>
  ${footer()}`;
}

/* ---------- 자료실 (다운로드 없음) ---------- */
function resourcesView() {
  return `
  ${header()}
  <main>
    <section class="detail-hero">
      <div class="wrap"><p class="eyebrow">Resources</p><h1>자료실</h1>
        <p>워크북·실습시트·데이터는 강의 중에 제공합니다. 데이터 원본은 각 실습 상세에서 화면으로 미리 볼 수 있습니다.</p></div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="card" style="margin-bottom:24px">
          <h3 style="font-size:18px;margin:0 0 12px">강의 중 제공</h3>
          <ul class="goal-list">
            <li><span class="num">·</span><span>실습 데이터(CSV 5종)와 워크북·실습시트는 강의 당일 안내합니다.</span></li>
            <li><span class="num">·</span><span>데이터가 어떻게 생겼는지는 지금도 볼 수 있습니다. 실습 상세의 <b>데이터 원본 보기</b>를 누르세요.</span></li>
            <li><span class="num">·</span><span>프롬프트·검증 점검표 등 세부 자료는 강의 슬라이드로 함께 다룹니다.</span></li>
          </ul>
        </div>
        <div class="grid grid-2" style="margin-bottom:8px">
          ${LABS.map((l) => `
            <a class="res-item" href="#/data/${l.dataKey}">
              <span class="ext csv">CSV</span>
              <span class="info"><b>${esc(l.dataKey)}.csv</b><span>${esc(l.no)} · ${esc(l.title)}</span></span>
              <span class="btn btn--ghost btn--sm">원본 보기</span>
            </a>`).join("")}
        </div>
      </div>
    </section>
  </main>
  ${footer()}`;
}

/* ---------- 강의 장표 ---------- */
function slidesView() {
  return `
  ${header()}
  <main>
    <section class="detail-hero">
      <div class="wrap"><p class="eyebrow">Slides</p><h1>강의 장표</h1>
        <p>슬라이드 덱은 기초강의와 같은 색·폰트로 만듭니다(딥 네이비 + 골드 · Pretendard). 완성되면 이 자리에서 미리보기를 엽니다.</p></div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">실습별 덱</p><h2>준비 중</h2>
          <p class="lead">각 교시·실습 슬라이드가 준비되면 여기에서 미리볼 수 있습니다.</p></div>
        <div class="slides-grid">
          <div class="slide-card">OT · 데이터 이해<br><small style="opacity:.7">슬라이드 준비 중</small></div>
          ${LABS.map((l) => `<div class="slide-card">${esc(l.no)} · ${esc(l.title)}<br><small style="opacity:.7">슬라이드 준비 중</small></div>`).join("")}
          <div class="slide-card">마무리 · 토론 · 피드백<br><small style="opacity:.7">슬라이드 준비 중</small></div>
        </div>
      </div>
    </section>
  </main>
  ${footer()}`;
}

/* ---------- 공유 보드 (localStorage, 실습별) ---------- */
function boardKey(labId) { return "imf_board_v2_" + labId; }
function loadPosts(labId) { try { return JSON.parse(localStorage.getItem(boardKey(labId))) || []; } catch { return []; } }
function savePosts(labId, p) { localStorage.setItem(boardKey(labId), JSON.stringify(p)); }

/* 보드 목록 (실습 6개 보드로 안내) */
function boardIndexView() {
  return `
  ${header()}
  <main>
    <section class="detail-hero">
      <div class="wrap"><p class="eyebrow">Shared Board</p><h1>공유 보드</h1>
        <p>실습마다 보드가 따로 있습니다. 결과를 올리고, 댓글·좋아요로 서로 피드백하세요. 로그인은 필요 없습니다.</p></div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="grid grid-2">
          ${LABS.map((l) => {
            const n = loadPosts(l.id).length;
            return `
            <a class="card is-link board-index-card" href="#/board/${l.id}">
              <div class="lab-no">${esc(l.no)} 공유 보드</div>
              <h3>${esc(l.title)}</h3>
              <p class="side-note" style="margin:8px 0 14px">${esc(l.out)}</p>
              <div class="lab-foot">
                <span class="btn btn--ghost btn--sm">보드 열기 →</span>
                <span class="board-count">글 ${n}개</span>
              </div>
            </a>`;
          }).join("")}
        </div>
      </div>
    </section>
  </main>
  ${footer()}`;
}

/* 실습별 보드 (패들렛식: 카드 + 댓글 + 좋아요) */
function boardView(labId) {
  const l = LABS.find((x) => x.id === labId);
  if (!l) return notFound();
  return `
  ${header()}
  <main>
    <section class="detail-hero">
      <div class="wrap">
        <a class="back-link" href="#/board">← 공유 보드 목록</a>
        <p class="eyebrow">Shared Board · ${esc(l.no)}</p>
        <h1>${esc(l.title)} 공유 보드</h1>
        <p>${esc(l.no)} 결과를 올리고 댓글·좋아요로 나눠 보세요. 글은 이 브라우저에 저장됩니다.</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="card">
          <form class="board-form" id="boardForm" data-lab="${esc(l.id)}">
            <div class="row">
              <input type="text" id="bNick" maxlength="20" placeholder="닉네임 (예: 데이터팀 한)" required>
              <input type="url" id="bImg" placeholder="이미지 URL (선택 — 차트·스크린샷 링크)">
            </div>
            <textarea id="bBody" maxlength="1200" placeholder="공유할 내용을 적어주세요." required></textarea>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
              <button class="btn btn--primary" type="submit">보드에 올리기</button>
              <span style="font-size:13px;color:var(--muted)">민감정보(실명·계좌·내부자료)는 올리지 마세요.</span>
            </div>
          </form>
        </div>
        <div class="board-grid" id="boardGrid"></div>
        <div class="demo-note">지금은 글이 <b>이 브라우저에만</b> 저장됩니다. 여러 사람이 함께 보려면 추후 연결이 필요합니다.</div>
      </div>
    </section>
  </main>
  ${footer()}`;
}

function renderBoardPosts(labId) {
  const grid = $("#boardGrid"); if (!grid) return;
  const posts = loadPosts(labId);
  if (!posts.length) { grid.innerHTML = `<div class="board-empty">아직 글이 없습니다. 첫 공유를 남겨보세요.</div>`; return; }
  grid.innerHTML = posts.map((p) => {
    const comments = p.comments || [];
    return `
    <div class="post" data-id="${esc(p.id)}">
      <div class="post-head">
        <div class="who">
          <div class="avatar">${esc((p.nick || "?").trim().charAt(0).toUpperCase())}</div>
          <div><b>${esc(p.nick)}</b><small>${esc(new Date(p.ts).toLocaleString("ko-KR"))}</small></div>
        </div>
        <button class="del" title="삭제" data-id="${esc(p.id)}">삭제</button>
      </div>
      <div class="body">${esc(p.body)}</div>
      ${p.img ? `<img class="attach" src="${esc(p.img)}" alt="첨부 이미지" loading="lazy" onerror="this.style.display='none'">` : ""}
      <div class="post-actions">
        <button class="like ${p.liked ? "on" : ""}" data-id="${esc(p.id)}">♥ 좋아요 <span>${p.likes || 0}</span></button>
        <span class="cmt-count">댓글 ${comments.length}</span>
      </div>
      <div class="comments">
        ${comments.map((c) => `<div class="cmt"><b>${esc(c.nick)}</b> ${esc(c.text)}</div>`).join("")}
      </div>
      <form class="cmt-form" data-id="${esc(p.id)}">
        <input type="text" class="cmt-nick" maxlength="20" placeholder="닉네임" required>
        <input type="text" class="cmt-text" maxlength="300" placeholder="댓글 달기" required>
        <button class="btn btn--ghost btn--sm" type="submit">등록</button>
      </form>
    </div>`;
  }).join("");

  // 삭제
  grid.querySelectorAll(".del").forEach((b) => b.addEventListener("click", () => {
    savePosts(labId, loadPosts(labId).filter((x) => String(x.id) !== String(b.dataset.id)));
    renderBoardPosts(labId);
  }));
  // 좋아요 (localStorage)
  grid.querySelectorAll(".like").forEach((b) => b.addEventListener("click", () => {
    const posts = loadPosts(labId);
    const p = posts.find((x) => String(x.id) === String(b.dataset.id));
    if (!p) return;
    p.liked = !p.liked;
    p.likes = (p.likes || 0) + (p.liked ? 1 : -1);
    if (p.likes < 0) p.likes = 0;
    savePosts(labId, posts);
    renderBoardPosts(labId);
  }));
  // 댓글
  grid.querySelectorAll(".cmt-form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const nick = f.querySelector(".cmt-nick").value.trim();
    const text = f.querySelector(".cmt-text").value.trim();
    if (!nick || !text) return;
    const posts = loadPosts(labId);
    const p = posts.find((x) => String(x.id) === String(f.dataset.id));
    if (!p) return;
    p.comments = p.comments || [];
    p.comments.push({ nick, text, ts: Date.now() });
    savePosts(labId, posts);
    renderBoardPosts(labId);
  }));
}

function wireBoard(labId) {
  const form = $("#boardForm"); if (!form) return;
  renderBoardPosts(labId);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nick = $("#bNick").value.trim();
    const body = $("#bBody").value.trim();
    const img = $("#bImg").value.trim();
    if (!nick || !body) return;
    const posts = loadPosts(labId);
    posts.unshift({ id: Date.now() + "-" + Math.random().toString(36).slice(2, 7), nick, body, img, likes: 0, liked: false, comments: [], ts: Date.now() });
    savePosts(labId, posts);
    form.reset();
    renderBoardPosts(labId);
  });
}

/* ---------- 라우터 ---------- */
function notFound() {
  return `${header()}<main><section class="section"><div class="wrap"><h2>페이지를 찾을 수 없습니다</h2><p class="lead"><a href="#/" style="color:var(--brand)">홈으로 돌아가기 →</a></p></div></section></main>${footer()}`;
}

function router() {
  const hash = location.hash || "#/";
  const app = $("#app");
  let html, after = null;

  if (hash.startsWith("#/lab/")) {
    html = labDetailView(hash.slice("#/lab/".length));
  } else if (hash.startsWith("#/data/")) {
    html = dataView(decodeURIComponent(hash.slice("#/data/".length)));
  } else if (hash.startsWith("#/board/")) {
    const id = hash.slice("#/board/".length);
    html = boardView(id); after = () => wireBoard(id);
  } else if (hash === "#/board") {
    html = boardIndexView();
  } else if (hash === "#/guide") {
    html = guideView();
  } else if (hash === "#/resources") {
    html = resourcesView();
  } else if (hash === "#/" || hash === "" || hash.startsWith("#labs") || hash.startsWith("#schedule") || hash.startsWith("#goals") || hash.startsWith("#ethics")) {
    html = homeView();
  } else {
    html = notFound();
  }

  app.innerHTML = html;
  const anchor = hash.match(/#(labs|schedule|goals|ethics)$/);
  if (anchor) { const t = document.getElementById(anchor[1]); if (t) t.scrollIntoView({ behavior: "smooth" }); }
  else window.scrollTo(0, 0);
  if (after) after();
  const nl = document.getElementById("navlinks"); if (nl) nl.classList.remove("open");
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
