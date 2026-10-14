"""BOH fit-to-screen check. Opens each screen type in every level at three iPhone Safari sizes and reports:
smallest text (as drawn, after any zoom or scale), page scroll, clipped header, and empty space.
Needs the local test server:  python3 -m http.server 8810 --directory <repo>
Usage: python3 -I tools/fit/measure.py OUT_DIR [level ...]
Writes OUT_DIR/results.json and one screenshot per screen and size."""
import json, os, sys
from playwright.sync_api import sync_playwright
BASE = os.environ.get('BOHBASE','http://127.0.0.1:8810/')
SIZES = {'SE': (375, 553), '15': (393, 710), 'ProMax': (430, 790)}   # visible Safari area (approximate)
KEYS = {'italiano1': 'bohItaliano1_v2', 'italiano2': 'bohItaliano2_v2', 'italiano3': 'bohItaliano3_v2', 'italiano4': 'bohItaliano4_v2', 'ap': 'bohAP_v2'}
UNIT = json.loads(os.environ['BOHUNITS']) if os.environ.get('BOHUNITS') else {'italiano1': 'scuola', 'italiano2': 'u3', 'italiano3': 'imp', 'italiano4': 'r3', 'ap': 'f1'}
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
LEVELS = sys.argv[2:] or list(KEYS)

METRICS = r"""() => {
  function zoomOf(el){var z=1;for(var a=el;a&&a.nodeType===1;a=a.parentElement){var v=parseFloat(getComputedStyle(a).zoom);if(v&&v!==1)z*=v;}return z}
  function scaleOf(el){var s=1;for(var a=el;a&&a.nodeType===1;a=a.parentElement){var t=getComputedStyle(a).transform;if(t&&t!=='none'){try{var m=new DOMMatrix(t);s*=Math.sqrt(m.a*m.a+m.b*m.b)}catch(e){}}}return s}
  var H=innerHeight,W=innerWidth,min=99,minWhat='',top=1e9,bot=0;
  var all=document.querySelectorAll('body *');
  for(var i=0;i<all.length;i++){var e=all[i];
    if(e.closest('.wmark,script,style,noscript,#bootline,[aria-hidden="true"]'))continue;
    var cs=getComputedStyle(e); if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)===0)continue;
    var r=e.getBoundingClientRect(); if(r.width<2||r.height<2)continue;
    if(r.bottom<=0||r.right<=0||r.left>=W)continue;
    var hasText=false;for(var n=e.firstChild;n;n=n.nextSibling)if(n.nodeType===3&&n.textContent.trim()){hasText=true;break}
    var leaf=hasText||/^(BUTTON|INPUT|IMG|SVG|CANVAS)$/i.test(e.tagName);
    if(leaf){ if(r.top<top)top=r.top; if(r.bottom>bot)bot=r.bottom; }
    if(!hasText)continue;
    var f=parseFloat(cs.fontSize)*zoomOf(e)*scaleOf(e);
    if(f<min-0.01){min=f;minWhat=(e.className&&e.className.baseVal===undefined?e.className:e.tagName)+' | '+e.textContent.trim().slice(0,40)}
  }
  var se=document.scrollingElement, scroll=Math.max(0,se.scrollHeight-H);
  var hdr=document.querySelector('.boh-back,.back-btn,[aria-label="Back"],[aria-label^="Torna"]'); var clipped=false;
  var hb=Array.from(document.querySelectorAll('button')).filter(function(b){var r=b.getBoundingClientRect();return r.height>0&&r.top<60})[0];
  if(hb){var rr=hb.getBoundingClientRect(); clipped=rr.top<-1;}
  var empty=Math.max(0,(H-Math.min(bot,H)))/H;
  return {min:Math.round(min*10)/10,minWhat:minWhat,scroll:scroll,clipped:clipped,emptyBottom:Math.round(empty*100),contentBottom:Math.round(bot),H:H};
}"""

def seed(key, unit):
    return ("(function(){try{localStorage.setItem('boh_profile_v1',JSON.stringify({bohBase:'m',bohName:'Gia'}));"
            "localStorage.setItem(%s,JSON.stringify({unit:%s,bohBase:'m',bohName:'Gia'}));localStorage.setItem('boh_break_off','1');}catch(e){}})();" % (json.dumps(key), json.dumps(unit)))

CLEAN = "(function(){try{BohCelebrate.close()}catch(e){};var pb=document.querySelector('.pop-ov button');if(pb)pb.click();['bohBreak','bfc','bcel'].forEach(function(i){var b=document.getElementById(i);if(b)b.remove()});try{btTipTimer(null)}catch(e){}})()"

def lesson_item(pg, types, nth=0):
    """open the first lesson item of one of the given types; returns description or None"""
    return pg.evaluate("""(a)=>{var types=a[0],nth=a[1],g=window.__game,D=g.lsData();if(!D)return null;var c=0;
      for(var k=0;k<D.stops.length;k++){var it=D.stops[k].items;for(var i=0;i<it.length;i++){var t=it[i].t;
        if(types.indexOf(t)!==-1 && !(t==='impara' && types[0]==='words' ) ){ if(c++<nth)continue;
          g.setState({profU:Object.assign({},g.state.profU||{},{openTo:99}),screen:'lesson',lsCur:k,lsI:i,lsDeck:null,lsDeckK:-1,lsIt:g.lsFresh(k,i,it),lsView:'stop',overlay:null});
          return D.stops[k].key+' #'+i+' '+t;}}}return null}""", [types, nth])

def impara(pg, words):
    return pg.evaluate("""(w)=>{var g=window.__game,D=g.lsData();if(!D)return null;
      for(var k=0;k<D.stops.length;k++){var it=D.stops[k].items;for(var i=0;i<it.length;i++){var x=it[i];
        if(x.t==='impara' && (!!x.groups)===w){g.setState({profU:Object.assign({},g.state.profU||{},{openTo:99}),screen:'lesson',lsCur:k,lsI:i,lsDeck:null,lsDeckK:-1,lsIt:g.lsFresh(k,i,it),lsView:'stop',overlay:null});return D.stops[k].key+' #'+i;}}}return null}""", words)

def play(pg, qtype):
    return pg.evaluate("""(t)=>{var g=window.__game,U=BT_UNITS[BT_UNIT];var ms=U.order.filter(function(m){return m!=='prova'&&U.MODES[m]});
      for(var j=0;j<ms.length;j++){try{g.startMode(ms[j])}catch(e){continue}var q=g.state.queue||[];
        for(var i=0;i<q.length;i++)if(q[i].type===t){g.setState({qIndex:i});return ms[j]+' #'+i}}
      g.setState({screen:'home'});return null}""", qtype)

def play_wrong(pg):
    return pg.evaluate("""()=>{var g=window.__game,q=(g.state.queue||[])[g.state.qIndex];if(!q)return null;
      if(q.type==='mc'){var o=(q.options||[]).filter(function(x){return !x.correct})[0];if(o){g.selectAnswer(o);return 'mc wrong'}}
      if(q.type==='binary'){var c=q.answer==='a'?'b':'a';try{g.selectBinary(c);return 'binary wrong'}catch(e){}}
      return null}""")

def lesson_wrong(pg):
    return pg.evaluate("""()=>{var g=window.__game,x=g.lsItem(),it=x.it;if(!it||it.t!=='mc')return null;var w=it.traps[0];g.lsPickMc(w);return 'mc wrong'}""")

res = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for lv in LEVELS:
        for sz, (w, h) in SIZES.items():
            ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, is_mobile=True, has_touch=True)
            pg = ctx.new_page()
            pg.add_init_script(seed(KEYS[lv], UNIT[lv]))
            pg.goto(BASE + lv + '/?unit=' + UNIT[lv], wait_until='load'); pg.wait_for_timeout(1800)
            def shot(name, how):
                pg.evaluate(CLEAN); pg.wait_for_timeout(1600); pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(150)
                m = pg.evaluate(METRICS); m.update({'level': lv, 'size': sz, 'screen': name, 'how': how})
                res.append(m)
                pg.screenshot(path=os.path.join(OUT, '%s-%s-%s.png' % (lv, name, sz)))
                print('%-9s %-6s %-16s min %5s  scroll %4s  empty %3s%%  %s' % (lv, sz, name, m['min'], m['scroll'], m['emptyBottom'], m['minWhat'][:50]), flush=True)
            shot('home', 'home')
            d = impara(pg, True)
            if d: shot('wordlist', d)
            d = impara(pg, False)
            if d: shot('learn', d)
            d = lesson_item(pg, ['mc'])
            if d:
                shot('lesson-pick', d)
                if lesson_wrong(pg): shot('lesson-wrong', d)
            for t, nm in (('type', 'lesson-typed'), ('tiles', 'build'), ('text', 'chat'), ('parla', 'parla'), ('fix', 'fix')):
                d = lesson_item(pg, [t])
                if d: shot(nm, d)
            pg.evaluate("(function(){var g=window.__game;g.setState({screen:'lesson',lsView:'between',lsCur:0})})()")
            pg.wait_for_timeout(1200); pg.evaluate("(function(){var e=document.getElementById('bcel');if(e)e.click()})()"); pg.wait_for_timeout(400)
            m = pg.evaluate(METRICS); m.update({'level': lv, 'size': sz, 'screen': 'celebration', 'how': 'end state'}); res.append(m)
            pg.screenshot(path=os.path.join(OUT, '%s-%s-%s.png' % (lv, 'celebration', sz)))
            print('%-9s %-6s %-16s min %5s  scroll %4s  empty %3s%%  %s' % (lv, sz, 'celebration', m['min'], m['scroll'], m['emptyBottom'], m['minWhat'][:50]), flush=True)
            shot('stop-done', 'between')
            pg.evaluate("(function(){var g=window.__game;g.setState({screen:'home'})})()"); pg.wait_for_timeout(300)
            for t, nm in (('mc', 'play-pick'), ('binary', 'play-truefalse'), ('selfcheck', 'play-selfcheck')):
                d = play(pg, t)
                if d:
                    shot(nm, d)
                    if t in ('mc', 'binary') and play_wrong(pg): shot(nm + '-wrong', d)
                pg.evaluate("(function(){var g=window.__game;g.setState({screen:'home',roundActive:false})})()"); pg.wait_for_timeout(200)
            ctx.close()
    # pages outside the levels
    for sz, (w, h) in SIZES.items():
        ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, is_mobile=True, has_touch=True)
        pg = ctx.new_page(); pg.add_init_script(seed('bohItaliano2_v2', 'u3'))
        pg.goto(BASE + 'in-classe/', wait_until='load'); pg.wait_for_timeout(1500)
        m = pg.evaluate(METRICS); m.update({'level': 'in-classe', 'size': sz, 'screen': 'registra-page', 'how': 'first screen'}); res.append(m)
        pg.screenshot(path=os.path.join(OUT, 'inclasse-%s.png' % sz))
        print('%-9s %-6s %-16s min %5s  scroll %4s  empty %3s%%  %s' % ('in-classe', sz, 'first', m['min'], m['scroll'], m['emptyBottom'], m['minWhat'][:50]), flush=True)
        ctx.close()
    b.close()
json.dump(res, open(os.path.join(OUT, 'results.json'), 'w'), indent=1)
print('saved', len(res))
