
(function(){
  var checks=['수수료 확인','벤치마크 비교','위험등급 확인','환매 조건','세금/계좌 유형','과거수익≠미래 고지 읽음'];
  var K='fc_v1';
  var done=JSON.parse(localStorage.getItem(K)||'[]');
  var root=document.getElementById('app');
  function render(){
    root.innerHTML='<div class="card" style="font-size:12px;color:#67e8f9">체크리스트 = 학습용. 투자 권유 아님.</div><div class="card" id="list"></div><div class="card">완료 '+done.length+'/'+checks.length+'</div>';
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
        render();try{legionTrack('activate',{n:done.length})}catch(e){}
      };
    });
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
