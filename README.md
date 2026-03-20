# Climax Lounge — Deployment Guide

## Files
```
index.html   ← Customer site (table picker + menu + ordering)
admin.html   ← Staff dashboard (orders + tables + settings)
README.md    ← This file
```

---

## Step 1 — Create Your Supabase Project

1. Go to **https://supabase.com** → Sign up (free)
2. Click **New Project** → name it `climax-lounge` → choose a region close to Uganda
3. Wait ~2 minutes for it to spin up

---

## Step 2 — Create the Orders Table

In your Supabase project, go to **SQL Editor** and run this:

```sql
create table orders (
  id             uuid primary key default gen_random_uuid(),
  ref            text not null,
  table_name     text not null,
  table_num      integer,
  customer_name  text not null,
  note           text,
  items          jsonb not null default '[]',
  total          integer not null default 0,
  status         text not null default 'pending',
  created_at     timestamptz default now()
);

-- Allow anyone to insert orders (customers)
-- Allow anyone to read & update orders (staff dashboard uses anon key)
alter table orders enable row level security;

create policy "Allow insert" on orders for insert with check (true);
create policy "Allow read"   on orders for select using (true);
create policy "Allow update" on orders for update using (true);
create policy "Allow delete" on orders for delete using (true);

-- Enable realtime
alter publication supabase_realtime add table orders;
```

Click **Run**.

---

## Step 3 — Get Your API Keys

In Supabase → **Project Settings** → **API**:

- Copy **Project URL** (looks like `https://abcxyz.supabase.co`)
- Copy **anon / public** key (long string starting with `eyJ...`)

---

## Step 4 — Paste Keys Into Both Files

Open `index.html` in a text editor. Find near the bottom:

```js
const SUPABASE_URL     = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY= 'YOUR_ANON_KEY';
```

Replace with your actual values. Do the same in `admin.html`.

---

## Step 5 — Deploy

### Option A — Host on GitHub Pages (Free, simplest)
1. Create a free GitHub account at github.com
2. New repository → name it `climax-lounge` → Public
3. Upload `index.html` and `admin.html`
4. Go to repo **Settings** → **Pages** → Source: `main` branch → Save
5. Your site is live at `https://YOUR_USERNAME.github.io/climax-lounge/`

### Option B — Netlify (Free, drag & drop)
1. Go to **netlify.com** → Sign up
2. Drag your folder onto the Netlify dashboard
3. Done — instant live URL

### Option C — Local network (counter tablet + customer phones on same Wi-Fi)
Just open the files in a browser on your computer. No hosting needed.
Your QR code should point to:
`file:///path/to/index.html` (local)
or your hosted URL.

---

## How It Works

```
Customer scans QR → opens index.html
  → picks Table 5
  → browses menu, adds items, taps Send
  → order saved to Supabase ✓

Admin opens admin.html → logs in
  → sees orders in real time (Supabase Realtime)
  → Accept → Preparing → Ready → Delivered
```

The admin dashboard uses **Supabase Realtime** — orders appear the instant a customer places them, no refreshing needed (it also polls every 8 seconds as backup).

---

## Changing the Password

Log into `admin.html` → **⚙ Settings** tab → Change Dashboard Password.
The password is stored in the browser's localStorage. Default is `climax2025`.

---

## Customising the Menu

Open `index.html` in any text editor.
Find the `MENU` constant (~line 500) and edit prices, names, or add new items.
Each item:
```js
{id:'c1', name:'Negroni', price:25000, desc:'Gin, Campari, vermouth', emoji:'🍸'}
```
Price is in UGX.
