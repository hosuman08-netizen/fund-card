
/* LEGION_WAVE_38_today_counter */
try{var _dk=new Date().toDateString();var _o=JSON.parse(localStorage.getItem('lw_p43_fund_dis_today_counter')||'{}');if(_o.d!==_dk)_o={d:_dk,n:0};_o.n=(_o.n||0)+1;localStorage.setItem('lw_p43_fund_dis_today_counter',JSON.stringify(_o));}catch(e){}
(function(){
  var checks=['수수료 확인','벤치마크 비교','위험등급 확인','환매 조건','세금/계좌 유형','과거수익≠미래 고지 읽음'];
  var K='fc_v1';
  var NK='fc_notes_v1';
  var CK='fc_card_v1';
  var CARD_FIELDS=[
    {k:'er',l:'총보수 ER'},
    {k:'risk',l:'위험등급'},
    {k:'name',l:'펀드명'},
    {k:'bench',l:'벤치마크'},
    {k:'redeem',l:'환매'},
    {k:'account',l:'계좌'}
  ];
  var KEY_RISKS=[
    {k:'r_loss',l:'원금손실 가능'},
    {k:'r_mkt',l:'시장·금리·환율'},
    {k:'r_liq',l:'유동성·환매 제한'},
    {k:'r_cred',l:'신용·운용 위험'}
  ];
  var RK='fc_risks_v1';
  var PK='fc_prin_v1';
  function loadCard(){try{var c=JSON.parse(localStorage.getItem(CK)||'{}');return c&&typeof c==='object'?c:{};}catch(e){return {};}}
  function loadRisks(){try{var r=JSON.parse(localStorage.getItem(RK)||'{}');return r&&typeof r==='object'?r:{};}catch(e){return {};}}
  function escAttr(s){return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
  function cardShow(v){v=String(v==null?'':v).trim();return v?v:'미확인';}
  function parseErPct(s){
    s=String(s||'').trim(); if(!s) return null;
    var n=parseFloat(s.replace(/,/g,'').replace(/%/g,''));
    if(!isFinite(n)||n<0||n>10) return null;
    return n;
  }
  function isHttpUrl(s){
    s=String(s||'').trim();
    if(!s) return null;
    try{
      var u=new URL(s);
      if(u.protocol!=='http:' && u.protocol!=='https:') return null;
      return u.href;
    }catch(e){return null;}
  }
  function srcStampLine(card){
    var href=isHttpUrl(card&&card.doc);
    if(!href) return '출처 미확인 · URL 없음 · 수익률/AUM 칸 없음';
    var host='';
    try{host=new URL(href).hostname;}catch(e){return '출처 미확인 · URL 없음 · 수익률/AUM 칸 없음';}
    var at=(card&&card.docAt)?String(card.docAt):'미확인';
    return '출처 '+host+' · 저장 '+at+' · 사용자 붙여넣기 · 공시 대행 아님';
  }
  function stampShareText(card){
    var line=srcStampLine(card);
    if(String(line).indexOf('\n')>=0) line=String(line).split('\n')[0];
    return line;
  }
  function shareStampOkLine(){
    try{
      var t=localStorage.getItem('fc_stamp_shared');
      if(!t) return '';
      t=String(t);
      var d=new Date(t);
      if(!isNaN(d.getTime()) && /T/.test(t)){
        var hh=String(d.getHours()).padStart(2,'0');
        var mm=String(d.getMinutes()).padStart(2,'0');
        return '공유 '+hh+':'+mm+' · 스탬프 1줄 · 수익률/AUM 칸 없음';
      }
      return '공유 확인 · 시각 미기록 · 수익률/AUM 칸 없음';
    }catch(e){return '';}
  }
  function clearShareStampOkLine(){
    return '지움 확인 · 공유 전 · 수익률 칸 없음';
  }
  function stampCleared(){
    try{return localStorage.getItem('fc_stamp_cleared')==='1';}catch(e){return false;}
  }
  function stampOkInner(){
    var s=shareStampOkLine();
    if(s) return s;
    if(stampCleared()) return '<span id="clearShareStampOk">'+clearShareStampOkLine()+'</span>';
    return '공유 전 · 수익률 칸 없음';
  }
  function clearShareStamp(){
    try{localStorage.removeItem('fc_stamp_shared');}catch(e){}
    try{localStorage.setItem('fc_stamp_cleared','1');}catch(e){}
    return clearShareStampOkLine();
  }
  function feeSimple10(erPct, prin){
    var p=parseFloat(String(prin||'').replace(/,/g,''));
    if(erPct==null||!isFinite(p)||p<=0) return null;
    return Math.round(p*(erPct/100)*10);
  }
  var SHARE_BASE='https://hosuman08-netizen.github.io/fund-card/';
  var done=JSON.parse(localStorage.getItem(K)||'[]');
  var notes=JSON.parse(localStorage.getItem(NK)||'{}');
  var root=document.getElementById('app');
  function dayKey(off){var d=new Date();d.setDate(d.getDate()+(off||0));return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function kId(){try{var id=localStorage.getItem('fc_k_id');if(!id){id='u'+Math.random().toString(36).slice(2,8);localStorage.setItem('fc_k_id',id);}return id;}catch(e){return 'share';}}
  function shareUrl(){return SHARE_BASE+'?utm_source=share&utm_medium=app&ref='+encodeURIComponent(kId());}
  function bumpStreak(partial){
    try{
      var st=JSON.parse(localStorage.getItem('fc_streak')||'{}');
      if(!st||typeof st!=='object')st={last:null,count:0};
      var t=dayKey(0); if(st.last===t) return st;
      var y=dayKey(-1),y2=dayKey(-2),froze=false;
      if(st.last&&st.last!==y&&st.last===y2&&(st.count||0)>=3){
        var ready=!st.shieldLast||((new Date(t)-new Date(st.shieldLast))/86400000)>=7;
        if(ready){st.shieldLast=t;st.last=y;froze=true;try{legionTrack('streak_freeze',{count:st.count})}catch(e){}}
      }
      st.count=(st.last===y)?(st.count||0)+1:1; st.last=t; st.partial=!!partial;
      localStorage.setItem('fc_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count,froze:froze,partial:!!partial})}catch(e){}
      return st;
    }catch(e){return {count:0};}
  }
  function logWeek(n){
    try{
      var w=JSON.parse(localStorage.getItem('fc_week')||'{}');
      w[dayKey(0)]=n;
      var keys=Object.keys(w).sort();
      while(keys.length>14){delete w[keys.shift()];}
      localStorage.setItem('fc_week',JSON.stringify(w));
    }catch(e){}
  }
  function weekHeat(){
    try{
      var w=JSON.parse(localStorage.getItem('fc_week')||'{}');
      var out=[];
      for(var i=6;i>=0;i--){
        var k=dayKey(-i); var n=w[k]||0;
        out.push({k:k.slice(5),n:n,full:n>=checks.length});
      }
      return out;
    }catch(e){return [];}
  }
  function fomoLeft(){var e=new Date();e.setHours(24,0,0,0);var ms=Math.max(0,e-Date.now());return Math.floor(ms/3600000)+'h '+Math.floor((ms%3600000)/60000)+'m';}
  function render(){
    var st=JSON.parse(localStorage.getItem('fc_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast||0))/86400000)>=7;
    var all=done.length>=checks.length;
    var heat=weekHeat();
    var fullDays=heat.filter(function(h){return h.full;}).length;
    var partialDays=heat.filter(function(h){return h.n>=3;}).length;
    var avgN=heat.reduce(function(a,h){return a+h.n;},0)/7;
    var fullRate=Math.round(fullDays/7*100);
    var fundName=localStorage.getItem('fc_fund')||'';
    var pct=Math.round(done.length/checks.length*100);
    var card0=loadCard();
    var risks0=loadRisks();
    var prin0=''; try{prin0=localStorage.getItem(PK)||'';}catch(e){}
    var erPct=parseErPct(card0.er);
    var feeN=feeSimple10(erPct,prin0);
    var berPct=parseErPct(card0.ber);
    var erDiff=(erPct!=null&&berPct!=null)?Math.round((erPct-berPct)*1000)/1000:null;
    var cmpLine=(erPct==null||berPct==null)
      ?'ER 비교 미확인 · 벤치 ER은 공시에서 옮김 · 업계평균 날조 없음'
      :'내 ER '+erPct+'% · 벤치 '+berPct+'% · 차 '+(erDiff>0?'+':'')+erDiff+'%p · 유저입력만';
    var feeLine=erPct==null?'수수료 미확인 · 공시 원문에서 총보수를 옮기세요'
      :(feeN==null?'총보수 '+erPct+'% · 원금 입력 시 10년 단순합 · 시장수익 가정 없음'
        :'총보수 '+erPct+'% · 10년 단순합 약 '+feeN.toLocaleString()+'원 · 시장수익 가정 없음 · 복리 아님');
    var riskN=KEY_RISKS.filter(function(r){return !!risks0[r.k];}).length;
    var riskHtml=KEY_RISKS.map(function(r){
      var on=!!risks0[r.k];
      return '<label class="risk-item"><input type="checkbox" data-rk="'+r.k+'" '+(on?'checked':'')+'/> '+r.l+(on?'':' <span class="chip warn">미확인</span>')+'</label>';
    }).join('');
    var rg=String(card0.risk||'').trim();
    var rgOpts=['','1','2','3','4','5','6'].map(function(v){
      return '<option value="'+v+'" '+(rg===v?'selected':'')+'>'+(v?('위험 '+v+'등급'):'위험등급 미확인')+'</option>';
    }).join('');
    root.innerHTML='<div class="card" style="font-size:12px;color:#67e8f9">체크리스트 = 학습용. 투자 권유 아님 · 투명 금융 · 허위 수익률 없음</div>'
      +'<div class="card" id="firstPri"><div class="row" style="justify-content:space-between;align-items:baseline"><b>우선 · 수수료 + 핵심위험</b><span class="chip'+(erPct&&riskN===4?'':' warn')+'">'+(erPct?'ER '+erPct+'%':'ER 미확인')+' · 위험 '+riskN+'/4</span></div>'
      +'<p class="sub">첫 화면 = 총보수와 핵심위험 4. 빈 칸=미확인. 수익률·AUM 날조 금지.</p>'
      +'<div class="pri-er"><label class="sub">총보수 ER(%)<input id="priEr" placeholder="예: 0.45" value="'+escAttr(card0.er||'')+'"/></label>'
      +'<label class="sub">벤치 ER(%)<input id="priBench" placeholder="공시에서 옮김" value="'+escAttr(card0.ber||'')+'"/></label></div>'
      +'<label class="sub">원금(선택·단순합)<input id="priPrin" placeholder="숫자만, 수익가정 없음" value="'+escAttr(prin0)+'"/></label>'
      +'<p class="sub" id="erCmp" style="margin-top:6px">'+cmpLine+'</p>'
      +'<p class="sub" id="feeLine" style="margin-top:6px;color:#fde68a">'+feeLine+'</p>'
      +'<label class="sub">위험등급 (공시 1–6 · 추정 금지)</label><select id="priRisk">'+rgOpts+'</select>'
      +'<div style="margin-top:8px"><b style="font-size:12px;color:#67e8f9">핵심위험 4</b>'+riskHtml+'</div>'
      +'<div id="docRow" style="margin-top:10px"><label class="sub">설명서 URL (붙여넣기 · 호스팅 없음)</label>'
      +'<input id="docUrl" placeholder="https:// · DART/EDGAR/발행사 PDF" value="'+escAttr(card0.doc||'')+'"/>'
      +'<div class="row" style="margin-top:6px"><button class="sec" id="openDoc" style="flex:1">설명서 열기</button>'
      +'<span class="chip'+(isHttpUrl(card0.doc)?'':' warn')+'" id="docChip">'+(isHttpUrl(card0.doc)?'링크 있음':'미확인')+'</span></div>'
      +'<div class="row" style="margin-top:6px;align-items:center"><p class="sub" id="srcStamp" style="margin:0;color:#fde68a;flex:1">'+srcStampLine(card0)+'</p>'
      +'<button class="sec" id="copyStamp">스탬프 복사</button>'
      +'<button class="sec" id="shareStamp">스탬프 공유</button></div>'
      +'<div class="row" style="margin-top:4px;align-items:center"><p class="sub" id="shareStampOk" style="margin:0;color:#67e8f9;flex:1">'+stampOkInner()+'</p>'
      +'<button class="sec" id="clearShareStamp">시각 지우기</button></div>'
      +'<p class="sub" style="margin-top:4px">원문은 발행사·DART·EDGAR. 이 앱은 파일을 올리지 않음 · 수익률 칸 없음 · 공유=스탬프 1줄</p></div>'
      +'<p class="fs-foot">원금손실은 투자자에게 귀속됩니다. 과거의 운용실적이 미래의 수익을 보장하지 않습니다. NFA.</p></div>'
      +'<div class="card"><span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' · 🛡️':'')+'</span> <span class="chip">완료 '+done.length+'/'+checks.length+(all?' ✓':'')+'</span> <span class="chip">7일 만점 '+fullDays+'/7 ('+fullRate+'%)</span> <span class="chip">3+일 '+partialDays+'</span> <span class="chip">평균 '+(Math.round(avgN*10)/10)+'/'+checks.length+'</span> <span class="chip">창 '+fomoLeft()+'</span>'
      +'<div style="height:6px;background:#1c1826;border-radius:4px;margin-top:8px;overflow:hidden"><i style="display:block;height:100%;width:'+pct+'%;background:#67e8f9"></i></div></div>'
      +'<div class="card"><label class="sub">관찰 대상 (로컬)</label><input id="fundName" placeholder="예: KODEX 200" value="'+fundName.replace(/"/g,'&quot;')+'"/></div>'
      +'<div class="card" id="factsheet"><div class="row" style="justify-content:space-between;align-items:baseline"><b>공시 카드 1장</b><span class="chip">AUM 슬롯 없음 · 수익률 칸 없음</span></div>'
      +'<p class="sub">빈 칸 = 미확인 · 출처 없는 규모·수익률 금지 · 학습용 투명 금융</p>'
      +'<div class="fs-grid" id="fsGrid"></div>'
      +'<p class="fs-foot">투자 권유 아님 · NFA · 숫자 있으면 공시 원문에서 직접 옮길 것</p></div>'
      +'<div class="card"><b>7일 히트맵</b><div class="row" style="margin-top:8px;gap:4px;flex-wrap:wrap">'
      +heat.map(function(h){return '<span class="chip" style="'+(h.full?'background:#166534;color:#bbf7d0':h.n>=3?'background:#3b2f10;color:#fde68a':'')+'">'+h.k+' '+h.n+'/'+checks.length+'</span>';}).join('')
      +'</div><p class="sub" style="margin-top:6px">완주율 '+fullRate+'% · 목표: 주 5일 만점</p></div>'
      +'<div class="card" id="list"></div>'
      +'<div class="row" style="gap:6px;margin:8px 0"><button class="sec" id="checkAll" style="flex:1">전부 체크</button><button class="sec" id="resetDay" style="flex:1">오늘 초기화</button></div>'
      +'<div class="card"><label class="sub">메모 (선택)</label><textarea id="note" rows="2" placeholder="이 펀드 관찰 한 줄…">'+(notes[dayKey(0)]||'').replace(/</g,'&lt;')+'</textarea>'
      +'<button class="sec" id="saveNote" style="margin-top:6px">메모 저장</button></div>'
      +(all?'<div id="sharePeak" style="margin:10px 0;padding:10px;border:1px solid #67e8f944;border-radius:12px;text-align:center"><p style="margin:0 0 6px;font-size:13px">✨ 전체 체크 완료 — 공유</p><button id="sharePeakBtn" style="padding:8px 14px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1">📤 진행 공유</button></div>':'')
      +'<div class="card" id="moneyPipe" style="text-align:center;font-size:12px">'
      +'<div style="color:#67e8f9;font-weight:700;margin-bottom:6px">💎 투명 금융 크로스</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/etf-flow/?utm_source=fund&utm_medium=pipe">📈 ETF Flow</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/budget-pulse/?utm_source=fund&utm_medium=pipe">💓 Budget</a>'
      +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=fund&utm_medium=pipe">🎮 Arcade</a></div>'
      +'<button id="undoCheck" class="sec" style="width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1">↩ 직전 체크 취소</button>'+'<button id="shareProg" style="width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1">체크 진행 공유</button>';
    var list=document.getElementById('list');
    list.innerHTML=checks.map(function(c,i){
      var on=done.indexOf(i)>=0;
      return '<label style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #2a2438;cursor:pointer"><input type="checkbox" data-i="'+i+'" '+(on?'checked':'')+'/> '+c+'</label>';
    }).join('');
    document.getElementById('fundName').onchange=function(){
      var v=document.getElementById('fundName').value||'';
      try{localStorage.setItem('fc_fund',v);}catch(e){}
      try{var c=loadCard();c.name=v;localStorage.setItem(CK,JSON.stringify(c));}catch(e){}
    };
    (function bindFirstPri(){
      function syncFee(){
        var c=loadCard();
        var prin=document.getElementById('priPrin'); var pv=prin?(prin.value||'').trim():'';
        try{localStorage.setItem(PK,pv);}catch(e){}
        var erPct=parseErPct(c.er);
        var berPct=parseErPct(c.ber);
        var erDiff=(erPct!=null&&berPct!=null)?Math.round((erPct-berPct)*1000)/1000:null;
        var cmp=document.getElementById('erCmp');
        if(cmp) cmp.textContent=(erPct==null||berPct==null)
          ?'ER 비교 미확인 · 벤치 ER은 공시에서 옮김 · 업계평균 날조 없음'
          :'내 ER '+erPct+'% · 벤치 '+berPct+'% · 차 '+(erDiff>0?'+':'')+erDiff+'%p · 유저입력만';
        var feeN=feeSimple10(erPct,pv);
        var el=document.getElementById('feeLine');
        if(el) el.textContent=erPct==null?'수수료 미확인 · 공시 원문에서 총보수를 옮기세요'
          :(feeN==null?'총보수 '+erPct+'% · 원금 입력 시 10년 단순합 · 시장수익 가정 없음'
            :'총보수 '+erPct+'% · 10년 단순합 약 '+feeN.toLocaleString()+'원 · 시장수익 가정 없음 · 복리 아님');
      }
      var pe=document.getElementById('priEr');
      if(pe) pe.oninput=function(){
        var c=loadCard(); c.er=(pe.value||'').trim();
        try{localStorage.setItem(CK,JSON.stringify(c));}catch(e){}
        var fs=document.querySelector('input[data-cf="er"]'); if(fs){ fs.value=c.er; fs.dispatchEvent(new Event('input')); }
        syncFee();
      };
      var pb=document.getElementById('priBench');
      if(pb) pb.oninput=function(){
        var c=loadCard(); c.ber=(pb.value||'').trim();
        try{localStorage.setItem(CK,JSON.stringify(c));}catch(e){}
        syncFee();
      };
      var pp=document.getElementById('priPrin');
      if(pp) pp.oninput=syncFee;
      var pr=document.getElementById('priRisk');
      if(pr) pr.onchange=function(){
        var c=loadCard(); c.risk=(pr.value||'').trim();
        try{localStorage.setItem(CK,JSON.stringify(c));}catch(e){}
        var fs=document.querySelector('input[data-cf="risk"]'); if(fs){ fs.value=c.risk; fs.dispatchEvent(new Event('input')); }
      };
      Array.prototype.forEach.call(document.querySelectorAll('input[data-rk]'),function(inp){
        inp.onchange=function(){
          var r=loadRisks(); r[inp.getAttribute('data-rk')]=!!inp.checked;
          try{localStorage.setItem(RK,JSON.stringify(r));}catch(e){}
        };
      });
      var du=document.getElementById('docUrl');
      function syncDoc(){
        var c=loadCard();
        var v=du?(du.value||'').trim():'';
        c.doc=v;
        var ok=isHttpUrl(v);
        if(ok){
          if(c.docPrev!==v){ c.docAt=dayKey(0); c.docPrev=v; }
        }else{
          c.docAt=''; c.docPrev='';
        }
        try{localStorage.setItem(CK,JSON.stringify(c));}catch(e){}
        var chip=document.getElementById('docChip');
        if(chip){ chip.textContent=ok?'링크 있음':'미확인'; chip.className='chip'+(ok?'':' warn'); }
        var st=document.getElementById('srcStamp');
        if(st) st.textContent=srcStampLine(c);
      }
      if(du) du.oninput=syncDoc;
      var od=document.getElementById('openDoc');
      if(od) od.onclick=function(){
        var href=isHttpUrl(du?du.value:'');
        if(!href){ od.textContent='http(s)만'; setTimeout(function(){od.textContent='설명서 열기';},1200); return; }
        window.open(href,'_blank','noopener,noreferrer');
        try{legionTrack('open_doc',{})}catch(e){}
      };
      var cs=document.getElementById('copyStamp');
      if(cs) cs.onclick=function(){
        var line=srcStampLine(loadCard());
        function done(){
          cs.textContent='복사됨 ✓';
          setTimeout(function(){cs.textContent='스탬프 복사';},1100);
          try{legionTrack('copy_stamp',{})}catch(e){}
        }
        if(navigator.clipboard&&navigator.clipboard.writeText){
          navigator.clipboard.writeText(line).then(done).catch(function(){ window.prompt('아래를 복사하세요',line); done(); });
        }else{ window.prompt('아래를 복사하세요',line); done(); }
      };
      var ss=document.getElementById('shareStamp');
      if(ss) ss.onclick=function(){
        var line=stampShareText(loadCard());
        function doneShare(){
          ss.textContent='공유됨 ✓';
          try{localStorage.setItem('fc_stamp_shared',new Date().toISOString());}catch(e){}
          try{localStorage.removeItem('fc_stamp_cleared');}catch(e){}
          var ok=document.getElementById('shareStampOk');
          if(ok) ok.textContent=shareStampOkLine();
          setTimeout(function(){ss.textContent='스탬프 공유';},1100);
          try{legionTrack('share_stamp',{n:1})}catch(e){}
        }
        function fall(){
          if(navigator.clipboard&&navigator.clipboard.writeText){
            navigator.clipboard.writeText(line).then(doneShare).catch(function(){ window.prompt('아래 1줄을 공유하세요',line); doneShare(); });
          }else{ window.prompt('아래 1줄을 공유하세요',line); doneShare(); }
        }
        if(navigator.share){
          navigator.share({text:line}).then(doneShare).catch(fall);
        }else fall();
      };
      var cl=document.getElementById('clearShareStamp');
      if(cl) cl.onclick=function(){
        var line=clearShareStamp();
        var ok=document.getElementById('shareStampOk');
        if(ok) ok.innerHTML='<span id="clearShareStampOk">'+line+'</span>';
        cl.textContent='지움 ✓';
        setTimeout(function(){ var b=document.getElementById('clearShareStamp'); if(b) b.textContent='시각 지우기'; },1100);
        try{legionTrack('clear_share_stamp',{})}catch(e){}
      };
    })();
    (function bindFactsheet(){
      var fs=document.getElementById('fsGrid'); if(!fs) return;
      var card=loadCard();
      if(!card.name && fundName) card.name=fundName;
      fs.innerHTML=CARD_FIELDS.map(function(f){
        var v=String(card[f.k]==null?'':card[f.k]).trim();
        return '<div class="fs-row"><label>'+f.l+'</label>'
          +'<input data-cf="'+f.k+'" placeholder="미확인" value="'+escAttr(v)+'"/>'
          +'<span class="chip'+(v?'':' warn')+'" data-cs="'+f.k+'">'+escAttr(cardShow(v))+'</span></div>';
      }).join('');
      fs.querySelectorAll('input[data-cf]').forEach(function(inp){
        inp.oninput=function(){
          var c=loadCard();
          var k=inp.getAttribute('data-cf');
          var val=(inp.value||'').trim();
          c[k]=val;
          try{localStorage.setItem(CK,JSON.stringify(c));}catch(e){}
          if(k==='name'){
            try{localStorage.setItem('fc_fund',val);}catch(e){}
            var fn=document.getElementById('fundName'); if(fn) fn.value=val;
          }
          var sp=fs.querySelector('[data-cs="'+k+'"]');
          if(sp){ sp.textContent=cardShow(val); sp.className='chip'+(val?'':' warn'); }
        };
      });
    })();
    function applyDone(){
      localStorage.setItem(K,JSON.stringify(done));
      logWeek(done.length);
      if(done.length>=checks.length) bumpStreak(false);
      else if(done.length>=3){
        var pk='fc_partial_'+dayKey(0);
        if(!localStorage.getItem(pk)){localStorage.setItem(pk,'1'); bumpStreak(true);}
      }
      render();try{legionTrack('activate',{n:done.length})}catch(e){}
      if(done.length>=checks.length){try{legionTrack('share_peak_shown',{all:1})}catch(e){} try{legionTrack('money_pipe_shown',{app:'fund'})}catch(e){}}
    }
    list.querySelectorAll('input').forEach(function(inp){
      inp.onchange=function(){
        var i=+inp.getAttribute('data-i');
        if(inp.checked){if(done.indexOf(i)<0)done.push(i);}
        else done=done.filter(function(x){return x!==i;});
        applyDone();
      };
    });
    document.getElementById('checkAll').onclick=function(){
      done=checks.map(function(_,i){return i;}); applyDone();
    };
    document.getElementById('saveNote').onclick=function(){
      notes[dayKey(0)]=document.getElementById('note').value||'';
      localStorage.setItem(NK,JSON.stringify(notes));
      try{legionTrack('note_save',{})}catch(e){}
      var b=document.getElementById('saveNote'); b.textContent='저장됨 ✓'; setTimeout(function(){b.textContent='메모 저장';},1000);
    };
    document.getElementById('resetDay').onclick=function(){
      if(!confirm('오늘 체크만 지울까?'))return;
      done=[]; localStorage.setItem(K,'[]'); logWeek(0); render();
    };
    function doShare(){
      var note=notes[dayKey(0)]||'';
      var fn=localStorage.getItem('fc_fund')||'';
      var text='Fund checklist '+(fn?fn+' ':'')+done.length+'/'+checks.length+' · 학습용 · 투자권유 아님'+(note?' · '+note.slice(0,40):'')+'\n'+shareUrl();
      if(navigator.share)navigator.share({text:text,url:shareUrl()}).catch(function(){});
      else if(navigator.clipboard)navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{})}catch(e){}
    }
    var uc=document.getElementById('undoCheck');
    if(uc) uc.onclick=function(){
      if(!done.length)return;
      done.pop(); localStorage.setItem(K,JSON.stringify(done)); logWeek(done.length); render();
      try{legionTrack('undo',{})}catch(e){}
    };
    document.getElementById('shareProg').onclick=doShare;
    var sp=document.getElementById('sharePeakBtn'); if(sp) sp.onclick=doShare;
  }
  try{var q=new URLSearchParams(location.search||'');var ref=q.get('ref');if(ref&&ref!=='share'&&ref!==kId()&&!localStorage.getItem('fc_k_from')){localStorage.setItem('fc_k_from',ref);try{legionTrack('k_link',{from:ref})}catch(e){}}}catch(e){}
  try{legionTrack('session_start',{})}catch(e){}
  logWeek(done.length);
  render();

/* LEGION_WAVE_83_fomo_chip */
setTimeout(function(){try{if(document.getElementById('lw_fomo_83'))return;var end=new Date(); end.setHours(24,0,0,0);var ms=Math.max(0,end-Date.now());var h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000);var d=document.createElement('div'); d.id='lw_fomo_83';d.style.cssText='font-size:11px;opacity:.75;margin:6px 0;color:#e0b552';d.textContent='window '+h+'h '+m+'m · W83';var app=document.getElementById('app')||document.body; app.insertBefore(d, app.firstChild);}catch(e){}},40);
})();