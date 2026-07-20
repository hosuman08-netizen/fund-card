(function(){
  var el=document.getElementById('tool');
  el.innerHTML='<input id="fname" placeholder="상품명"/><input id="fee" placeholder="총보수 % 예: 1.2"/><input id="risk" placeholder="위험등급 예: 1~6"/><textarea id="note" rows="2" placeholder="추가 고지"></textarea><button id="go">카드 생성</button><pre id="out" style="margin-top:10px;white-space:pre-wrap;font-size:12px;color:#67e8f9"></pre>';
  document.getElementById('go').onclick=function(){
    var n=document.getElementById('fname').value||'상품', fee=document.getElementById('fee').value||'—', risk=document.getElementById('risk').value||'—', note=document.getElementById('note').value||'';
    var card='【투명 공시 카드】\n상품: '+n+'\n총보수: '+fee+'%\n위험등급: '+risk+'\n고지: 원금손실 가능 · 과거수익≠미래 · 투자자 본인 판단\n'+note;
    document.getElementById('out').textContent=card;
    try{navigator.clipboard.writeText(card)}catch(e){}
    try{legionTrack('activate',{})}catch(e){}
  };
  try{legionTrack('session_start',{})}catch(e){}
})();
