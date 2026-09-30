/* Boh · online save box (Cloudflare Worker + KV). Created by Assunta Scotto, 2026.
   Stores: the Boh name a student chose, a short code, and the game progress. No real names, emails or school IDs.
   Bindings: KV namespace BOH_SAVES · secret TEACHER_PIN_SHA256 (SHA-256 hex of the teacher PIN) · var ALLOW_ORIGIN.
   Routes: POST /save · POST /load · GET /teacher (lookup page) · POST /teacher/find */
const WORDS = ['gatto', 'luna', 'sole', 'mare', 'pizza', 'gelato', 'stella', 'fiore', 'pane', 'treno', 'nave', 'lupo', 'orso', 'cane',
  'rosa', 'neve', 'vento', 'monte', 'lago', 'bosco', 'mela', 'pera', 'uva', 'limone', 'caffe', 'torta', 'sedia', 'porta', 'libro',
  'penna', 'palla', 'bici', 'razzo', 'drago', 'panda', 'volpe', 'gufo', 'riccio', 'delfino', 'balena', 'nuvola', 'isola', 'ponte',
  'torre', 'piazza', 'strada', 'fuoco', 'acqua', 'sasso', 'foglia', 'ape', 'farfalla', 'tigre', 'leone', 'zebra', 'cuore', 'chiave',
  'faro', 'vela', 'tamburo'];
const MAX = 400000;
const norm = n => String(n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
const clean = n => String(n || '').replace(/[^A-Za-z0-9À-ÿ ']/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
const codeOk = c => /^[a-z]+-[a-z]+-[0-9]$/.test(c);

function cors(env, req) {
  const o = req.headers.get('Origin') || '';
  const allow = (env.ALLOW_ORIGIN || 'https://appuccinohub.github.io').split(',').map(s => s.trim());
  return { 'Access-Control-Allow-Origin': allow.includes(o) ? o : allow[0], 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' };
}
const json = (env, req, obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...cors(env, req) } });
async function sha(t) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(t))); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
function pick(a) { const r = new Uint32Array(1); crypto.getRandomValues(r); return a[r[0] % a.length]; }
async function slowDown(env, req, what) { // simple guard against guessing: 30 tries per 10 minutes per address
  const ip = req.headers.get('CF-Connecting-IP') || 'x', k = 'r:' + what + ':' + ip + ':' + Math.floor(Date.now() / 600000);
  const n = +(await env.BOH_SAVES.get(k)) || 0;
  if (n >= 30) return true;
  await env.BOH_SAVES.put(k, String(n + 1), { expirationTtl: 900 });
  return false;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(env, req) });
    try {
      if (url.pathname === '/save' && req.method === 'POST') {
        const b = await req.json(), name = clean(b.name), nk = norm(name);
        if (!nk) return json(env, req, { error: 'name' }, 400);
        if (typeof b.data !== 'string' || !/^BOH[ZJ]\./.test(b.data) || b.data.length > MAX) return json(env, req, { error: 'data' }, 400);
        let code = String(b.code || '').toLowerCase();
        if (code) {
          if (!codeOk(code) || !(await env.BOH_SAVES.get('b:' + nk + ':' + code))) return json(env, req, { error: 'nomatch' }, 404);
        } else {
          for (let i = 0; i < 20 && !code; i++) { const c = pick(WORDS) + '-' + pick(WORDS) + '-' + pick('23456789'.split('')); if (!(await env.BOH_SAVES.get('b:' + nk + ':' + c))) code = c; }
          if (!code) return json(env, req, { error: 'busy' }, 503);
        }
        const t = Date.now();
        await env.BOH_SAVES.put('b:' + nk + ':' + code, JSON.stringify({ name, data: b.data, t }));
        const idx = JSON.parse((await env.BOH_SAVES.get('n:' + nk)) || '[]').filter(x => x.code !== code);
        idx.push({ name, code, t });
        await env.BOH_SAVES.put('n:' + nk, JSON.stringify(idx));
        return json(env, req, { name, code, t });
      }
      if (url.pathname === '/load' && req.method === 'POST') {
        if (await slowDown(env, req, 'load')) return json(env, req, { error: 'slow' }, 429);
        const b = await req.json(), nk = norm(b.name), code = String(b.code || '').trim().toLowerCase().replace(/\s+/g, '');
        if (!nk || !codeOk(code)) return json(env, req, { error: 'nomatch' }, 404);
        const rec = await env.BOH_SAVES.get('b:' + nk + ':' + code);
        if (!rec) return json(env, req, { error: 'nomatch' }, 404);
        const r = JSON.parse(rec);
        return json(env, req, { name: r.name, code, data: r.data, t: r.t });
      }
      if (url.pathname === '/teacher/find' && req.method === 'POST') {
        if (await slowDown(env, req, 'pin')) return json(env, req, { error: 'slow' }, 429);
        const b = await req.json();
        if (!env.TEACHER_PIN_SHA256 || (await sha(b.pin)) !== env.TEACHER_PIN_SHA256) return json(env, req, { error: 'pin' }, 403);
        const idx = JSON.parse((await env.BOH_SAVES.get('n:' + norm(b.name))) || '[]');
        return json(env, req, { found: idx.map(x => ({ name: x.name, code: x.code, saved: new Date(x.t).toISOString() })) });
      }
      if (url.pathname === '/teacher' && req.method === 'GET') return new Response(TEACHER_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      return json(env, req, { error: 'notfound' }, 404);
    } catch (e) {
      return json(env, req, { error: 'server' }, 500);
    }
  }
};

const TEACHER_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Boh · teacher lookup</title>
<style>:root{--bg:#EFE6E8;--card:#fff;--ink:#2B2430;--mut:#6B5F68;--acc:#C1654F;--line:#DDD0D5}@media (prefers-color-scheme:dark){:root{--bg:#1C1520;--card:#251C2A;--ink:#F2EAF0;--mut:#C0B2C1;--acc:#E88A6C;--line:#3D3243}}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,sans-serif}main{max-width:520px;margin:0 auto;padding:24px 16px;display:grid;gap:14px}
.c{background:var(--card);border-radius:18px;padding:18px;display:grid;gap:10px}h1{margin:0;font-size:26px}label{display:grid;gap:4px;font-weight:700}
input{font:inherit;padding:10px 12px;border-radius:10px;border:2px solid var(--line);background:transparent;color:inherit}button{font:inherit;font-weight:800;padding:12px;border-radius:999px;border:0;background:var(--acc);color:#fff;cursor:pointer}
.r{padding:10px 12px;border-radius:10px;border:1px solid var(--line)}.r b{font-size:20px}.m{color:var(--mut);font-size:14px}</style></head>
<body><main><h1>Boh · forgotten codes</h1><p class="m">Type the student's Boh name. Only you can see codes: your PIN is checked by the server.</p>
<form class="c" id="f"><label>Teacher PIN<input id="p" type="password" inputmode="numeric" autocomplete="off" required></label><label>Boh name<input id="n" autocomplete="off" required></label><button>Find the code</button></form>
<div id="o" aria-live="polite"></div></main>
<script>document.getElementById('f').onsubmit=async e=>{e.preventDefault();const o=document.getElementById('o');o.textContent='Searching…';
const r=await fetch('/teacher/find',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pin:document.getElementById('p').value,name:document.getElementById('n').value})});
const j=await r.json();if(!r.ok){o.textContent=j.error==='pin'?'Wrong PIN.':'Try again in a few minutes.';return}
o.innerHTML='';if(!j.found.length){o.textContent='No Boh with that name yet.';return}
j.found.forEach(x=>{const d=document.createElement('div');d.className='c r';d.innerHTML='<b></b><span class="m"></span>';d.querySelector('b').textContent=x.name.toUpperCase()+' · '+x.code;d.querySelector('span').textContent='Last saved: '+new Date(x.saved).toLocaleString();o.appendChild(d)})}</script></body></html>`;
