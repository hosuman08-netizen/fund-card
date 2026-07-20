
(function(){
  var checks=['수수료 확인','벤치마크 비교','위험등급 확인','환매 조건','세금/계좌 유형','과거수익≠미래 고지 읽음'];
  var K='fc_v1';
  var SHARE_BASE='https://hosuman08-netizen.github.io/fund-card/';
  var done=JSON.parse(localStorage.getItem(K)||'[]');
  var root=document.getElementById('app');
  function dayKey(off){var d=new Date();d.setDate(d.getDate()+(off||0));return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function kId(){try{var id=localStorage.getItem('fc_k_id');if(!id){id='u'+Math.random().toString(36).slice(2,8);localStorage.setItem('fc_k_id',id);}return id;}catch(e){return 'share';}}
  function shareUrl(){return SHARE_BASE+'?utm_source=share&utm_medium=app&ref='+encodeURIComponent(kId());}
  function bumpStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('fc_streak')||'{}');
      if(!st||typeof st!=='object')st={last:null,count:0};
      var t=dayKey(0); if(st.last===t) return st;
      var y=dayKey(-1),y2=dayKey(-2),froze=false;
      if(st.last&&st.last!==y&&st.last===y2&&(st.count||0)>=3){
        var ready=!st.shieldLast||((new Date(t)-new Date(st.shieldLast))/86400000)>=7;
        if(ready){st.shieldLast=t;st.last=y;froze=true;try{legionTrack('streak_freeze',{count:st.count})}catch(e){}}
      }
      st.count=(st.last===y)?(st.count||0)+1:1; st.last=t;
      localStorage.setItem('fc_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count,froze:froze})}catch(e){}
      return st;
    }catch(e){return {count:0};}
  }
  function render(){
    var st=JSON.parse(localStorage.getItem('fc_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast))/86400000)>=7;
    var all=done.length>=checks.length;
    root.innerHTML='<div class="card" style="font-size:12px;color:#67e8f9">체크리스트 = 학습용. 투자 권유 아님.</div>'
      +'<div class="card"><span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' · 🛡️':'')+'</span> <span class="chip">완료 '+done.length+'/'+checks.length+(all?' ✓':'')+'</span></div>'
      +'<div class="card" id="list"></div>'
      +(all?'<div id="sharePeak" style="margin:10px 0;padding:10px;border:1px solid #67e8f944;border-radius:12px;text-align:center"><p style="margin:0 0 6px;font-size:13px">✨ 전체 체크 완료 — 공유</p><button id="sharePeakBtn" style="padding:8px 14px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1">📤 진행 공유</button></div>':'')
      +'<div class="card" id="moneyPipe" style="text-align:center;font-size:12px">'
      +'<div style="color:#67e8f9;font-weight:700;margin-bottom:6px">💎 투명 금융 크로스</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/etf-flow/?utm_source=fund&utm_medium=pipe">📈 ETF Flow</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/budget-pulse/?utm_source=fund&utm_medium=pipe">💓 Budget</a>'
      +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=fund&utm_medium=pipe">🎮 Arcade</a></div>'
      +'<button id="shareProg" style="width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1">체크 진행 공유</button>';
    var list=document.getElementById('list');
    list.innerHTML=checks.map(function(c,i){
      var on=done.indexOf(i)>=0;
      return '<label style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #2a2438;cursor:pointer"><input type="checkbox" data-i="'+i+'" '+(on?'checked':'')+'/> '+c+'</label>';
    }).join('');
    list.querySelectorAll('input').forEach(function(inp){
      inp.onchange=function(){
        var i=+inp.getAttribute('data-i');
        if(inp.checked){if(done.indexOf(i)<0)done.push(i);}
        else done=done.filter(function(x){return x!==i;});
        localStorage.setItem(K,JSON.stringify(done));
        bumpStreak();
        render();try{legionTrack('activate',{n:done.length})}catch(e){}
        if(done.length>=checks.length){try{legionTrack('share_peak_shown',{all:1})}catch(e){} try{legionTrack('money_pipe_shown',{app:'fund'})}catch(e){}}
      };
    });
    function doShare(){
      var text='Fund checklist '+done.length+'/'+checks.length+' · 학습용 · 투자권유 아님\n'+shareUrl();
      if(navigator.share)navigator.share({text:text,url:shareUrl()}).catch(function(){});
      else if(navigator.clipboard)navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{})}catch(e){}
    }
    document.getElementById('shareProg').onclick=doShare;
    var sp=document.getElementById('sharePeakBtn'); if(sp) sp.onclick=doShare;
  }
  try{var q=new URLSearchParams(location.search||'');var ref=q.get('ref');if(ref&&ref!=='share'&&ref!==kId()&&!localStorage.getItem('fc_k_from')){localStorage.setItem('fc_k_from',ref);try{legionTrack('k_link',{from:ref})}catch(e){}}}catch(e){}
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
