-- ============================================================================
-- iM금융 LMS 공유 보드 — Supabase 테이블/정책 설정
--
-- 사용법: Supabase 대시보드 → 왼쪽 메뉴 SQL Editor → New query →
--         아래 전체를 붙여넣고 오른쪽 위 Run(▶) 버튼 클릭.
--         한 번만 실행하면 됩니다. (이미 만들어졌으면 다시 실행해도 무방)
--
-- 데모용 정책입니다: 로그인 없이 누구나(anon) 글/댓글 읽기·쓰기,
--                    좋아요(+1)·삭제가 가능합니다.
-- ============================================================================

-- 1) 글(posts) 테이블 ---------------------------------------------------------
create table if not exists public.posts (
  id          uuid        primary key default gen_random_uuid(),
  lab_id      text,
  nick        text,
  body        text,
  img         text,
  likes       int         default 0,
  created_at  timestamptz default now()
);

-- 2) 댓글(comments) 테이블 ----------------------------------------------------
create table if not exists public.comments (
  id          uuid        primary key default gen_random_uuid(),
  post_id     uuid        references public.posts (id) on delete cascade,
  nick        text,
  text        text,
  created_at  timestamptz default now()
);

-- 조회 속도용 인덱스
create index if not exists posts_lab_id_idx       on public.posts (lab_id, created_at desc);
create index if not exists comments_post_id_idx   on public.comments (post_id, created_at);

-- 3) RLS(행 수준 보안) 켜기 ---------------------------------------------------
alter table public.posts    enable row level security;
alter table public.comments enable row level security;

-- 4) 정책 — anon 역할에 읽기/쓰기 + (posts) 좋아요·삭제 허용 ------------------
-- 재실행해도 에러 안 나도록 기존 정책 먼저 삭제
drop policy if exists "posts anon select"    on public.posts;
drop policy if exists "posts anon insert"    on public.posts;
drop policy if exists "posts anon update"    on public.posts;
drop policy if exists "posts anon delete"    on public.posts;
drop policy if exists "comments anon select" on public.comments;
drop policy if exists "comments anon insert" on public.comments;

-- posts: 읽기 / 쓰기 / 좋아요(update) / 삭제(delete)
create policy "posts anon select" on public.posts for select to anon using (true);
create policy "posts anon insert" on public.posts for insert to anon with check (true);
create policy "posts anon update" on public.posts for update to anon using (true) with check (true);
create policy "posts anon delete" on public.posts for delete to anon using (true);

-- comments: 읽기 / 쓰기
create policy "comments anon select" on public.comments for select to anon using (true);
create policy "comments anon insert" on public.comments for insert to anon with check (true);
