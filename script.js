(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Menu mobile + navegação ativa
  const menuToggle = $('#menuToggle');
  const nav = $('#nav');
  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });
  $$('#nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = '☰';
  }));

  const sections = $$('main section[id]');
  const navLinks = $$('#nav a');
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observerNav.observe(section));

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Scroll progress
  const progress = $('#scrollProgress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const toast = $('#toast');
  let toastTimer;
  const showToast = message => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  // Mapa / regiões
  const regions = [
    {tag:'REGIÃO 01 • CENTRO HISTÓRICO', title:'O Problema dos Resíduos', text:'Resíduos e descarte inadequado afetam o ambiente urbano. O primeiro desafio é identificar, coletar e organizar.', problem:'RESÍDUOS', guardian:'LUNA / THEO'},
    {tag:'REGIÃO 02 • ITAQUI-BACANGA', title:'Sinais de Poluição', text:'A NEX detecta sinais de poluição e pede investigação. A tecnologia ajuda a encontrar a origem antes de agir.', problem:'POLUIÇÃO', guardian:'ÍRIS'},
    {tag:'REGIÃO 03 • REGIÃO DAS PRAIAS', title:'Proteção das Águas', text:'A contaminação chegou à região costeira. É preciso recolher resíduos e reduzir a contaminação antes que avance.', problem:'CONTAMINAÇÃO', guardian:'ANDREW'},
    {tag:'REGIÃO 04 • ÁREA DEGRADADA', title:'Recuperação Ambiental', text:'Uma área perdeu parte de sua vitalidade. Regenerar, replantar e recuperar o espaço é o próximo desafio.', problem:'DEGRADAÇÃO', guardian:'LUNA / TODOS'},
    {tag:'NÚCLEO FINAL • TRITANUS', title:'O coração da Poluição', text:'No núcleo final, os quatro problemas se encontram. Tritanus concentra a degradação acumulada da ilha.', problem:'ACÚMULO', guardian:'OS 4 GUARDIÕES'}
  ];
  const regionPanel = $('#regionPanel');
  const regionButtons = $$('.map-node');
  function selectRegion(index) {
    const r = regions[index];
    regionButtons.forEach((btn,i) => btn.classList.toggle('active', i === index));
    $('.tag', regionPanel).textContent = r.tag;
    $('h3', regionPanel).textContent = r.title;
    $('#regionText').textContent = r.text;
    $('#regionProblem').textContent = r.problem;
    $('#regionGuardian').textContent = r.guardian;
  }
  regionButtons.forEach(btn => btn.addEventListener('click', () => selectRegion(Number(btn.dataset.region))));

  // Missões
  const missions = [
    {title:'O Problema dos Resíduos', place:'CENTRO HISTÓRICO', description:'Resíduos estão espalhados pela área. Identifique o problema, organize a coleta e enfrente Valtor.', objective:'Identificar, coletar e organizar resíduos.', reward:100},
    {title:'Sinais de Poluição', place:'ITAQUI-BACANGA', description:'Use Íris e NEX para investigar a origem dos sinais de poluição e encontrar a fonte do problema.', objective:'Analisar pistas e identificar a origem da poluição.', reward:150},
    {title:'Proteção das Águas', place:'REGIÃO DAS PRAIAS', description:'A contaminação chegou às águas. Andrew precisa purificar a área e reduzir os resíduos antes que o dano aumente.', objective:'Recolher resíduos e reduzir a contaminação.', reward:200},
    {title:'Recuperação Ambiental', place:'ÁREA DEGRADADA', description:'A vegetação perdeu força. Recupere o espaço, devolva vitalidade ao ambiente e estabilize a Energia Nexa.', objective:'Restaurar a vegetação e recuperar o espaço.', reward:250},
    {title:'O Confronto Contra Tritanus', place:'NÚCLEO FINAL', description:'A degradação acumulada ganhou forma. Combine as habilidades dos quatro Guardiões para derrotar Tritanus.', objective:'Combinar as quatro habilidades dos Guardiões.', reward:500}
  ];
  let unlockedMissions = 1;
  let selectedMission = 0;
  const missionButtons = $$('.mission');
  function renderMission(index) {
    const m = missions[index];
    selectedMission = index;
    missionButtons.forEach((btn,i) => btn.classList.toggle('active', i === index));
    $('.mission-number').textContent = String(index + 1).padStart(2,'0');
    $('.mission-panel .tag').textContent = `MISSÃO ${String(index + 1).padStart(2,'0')} • ${m.place}`;
    $('#missionPanel h3').textContent = m.title;
    $('#missionDescription').textContent = m.description;
    $('#missionObjective').textContent = m.objective;
    $('#missionStatus').textContent = `Recompensa: +${m.reward} pontos de sustentabilidade`;
    $('#startMission').textContent = index === 4 ? 'Iniciar confronto' : 'Iniciar missão';
  }
  missionButtons.forEach(btn => btn.addEventListener('click', () => {
    const index = Number(btn.dataset.mission);
    if (index >= unlockedMissions) {
      showToast(`Complete a missão ${String(index).padStart(2,'0')} para desbloquear esta área.`);
      return;
    }
    renderMission(index);
  }));
  $('#startMission').addEventListener('click', () => {
    const m = missions[selectedMission];
    let points = Number($('#points').textContent.replace(/\D/g,'')) || 2450;
    points += m.reward;
    $('#points').textContent = points.toLocaleString('pt-BR');
    if (selectedMission === 4) {
      showToast('Confronto final iniciado! Combine os quatro poderes.');
      document.querySelector('#combate').scrollIntoView({behavior:'smooth'});
      return;
    }
    if (selectedMission === unlockedMissions - 1 && unlockedMissions < missions.length) {
      unlockedMissions++;
      const next = missionButtons[unlockedMissions - 1];
      next.classList.remove('locked');
      next.classList.add('unlocked');
      $('em', next).textContent = '↗';
      $('#areaCount').textContent = `${Math.min(unlockedMissions,5)} / 5`;
      showToast(`Missão concluída! ${m.reward} pontos adicionados.`);
      if (unlockedMissions < missions.length) renderMission(unlockedMissions - 1);
      else renderMission(4);
    } else {
      showToast(`Missão ${String(selectedMission+1).padStart(2,'0')} concluída!`);
    }
  });

  // Combate demonstrativo
  const powerMessages = {
    regenerar: 'Área regenerada! A natureza recupera parte do equilíbrio.',
    analisar: 'Vulnerabilidade identificada! A NEX encontrou um ponto fraco.',
    purificar: 'Contaminação reduzida! A qualidade da água melhorou.',
    otimizar: 'Desperdício energético reduzido! A energia Nexa estabilizou.'
  };
  let hp = 100;
  const enemyHp = $('#enemyHp');
  const enemyHpBar = $('#enemyHpBar');
  const combatLog = $('#combatLog');
  function renderHp() { enemyHp.textContent = `${hp}%`; enemyHpBar.style.width = `${hp}%`; }
  $$('.power-btn').forEach(btn => btn.addEventListener('click', () => {
    if (hp <= 0) return;
    hp = Math.max(0, hp - (btn.dataset.power === 'analisar' ? 18 : 12));
    combatLog.textContent = powerMessages[btn.dataset.power];
    renderHp();
    btn.animate([{transform:'scale(1)'},{transform:'scale(.97)'},{transform:'scale(1)'}],{duration:260});
    if (hp === 0) {
      combatLog.textContent = 'Tritanus foi derrotado! A combinação dos Guardiões restaurou o equilíbrio.';
      showToast('VOCÊ VENCEU O CONFRONTO!');
    }
  }));
  $('#resetCombat').addEventListener('click', () => { hp = 100; renderHp(); combatLog.textContent = 'A degradação acumulada reage às suas escolhas...'; });
  renderHp();

  // Eco Breaker
  const canvas = $('#ecoCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = $('#gameScore');
  const livesEl = $('#gameLives');
  const message = $('#gameMessage');
  const startGameBtn = $('#startGame');
  const restartGameBtn = $('#restartGame');
  const levelEl = $('#gameLevel');
  let game = null;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(320, Math.floor(rect.width * dpr));
    canvas.height = Math.max(360, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if (game) { game.w = rect.width; game.h = rect.height; game.paddle.y = game.h - 35; }
  }
  function makeBricks(w) {
    const cols = 8, rows = 6, gap = 7, margin = 24;
    const brickW = (w - margin*2 - gap*(cols-1)) / cols;
    const colors = ['#48e8ff','#58a9ff','#83e66b','#c6ff72','#a97bff','#ff9b4a'];
    return Array.from({length: rows * cols}, (_,i) => {
      const col = i % cols, row = Math.floor(i / cols);
      return {x:margin+col*(brickW+gap),y:28+row*28,w:brickW,h:19,alive:true,color:colors[row%colors.length]};
    });
  }
  function resetGame() {
    const rect = canvas.getBoundingClientRect();
    game = {w:rect.width,h:rect.height,score:0,lives:3,running:false,paddle:{x:rect.width/2-50,y:rect.height-35,w:100,h:10,speed:7,dx:0},ball:{x:rect.width/2,y:rect.height-55,r:7,dx:4,dy:-4},bricks:makeBricks(rect.width),keys:{left:false,right:false},particles:[]};
    updateGameHud(); drawGame();
    message.style.display='flex';
    $('.game-message strong').textContent='PRONTO?';
    $('.game-message span').textContent='Use ← → ou A / D para mover.';
    startGameBtn.style.display='inline-flex';
  }
  function updateGameHud(){ scoreEl.textContent=String(game.score).padStart(4,'0'); livesEl.textContent='♥ '.repeat(game.lives).trim() || '—'; levelEl.textContent='01'; }
  function startGame(){ if(!game) resetGame(); game.running=true; message.style.display='none'; requestAnimationFrame(gameLoop); }
  function endGame(win){ game.running=false; message.style.display='flex'; $('.game-message strong').textContent=win?'VOCÊ VENCEU!':'FIM DE JOGO'; $('.game-message span').textContent=win?'A ilha recuperou mais um fragmento do equilíbrio.':'A energia acabou. Tente novamente.'; startGameBtn.style.display='inline-flex'; startGameBtn.textContent='Jogar novamente'; }
  function spawnParticles(x,y,color){ for(let i=0;i<8;i++) game.particles.push({x,y,dx:(Math.random()-.5)*3,dy:(Math.random()-.5)*3,life:1,color}); }
  function drawGame(){
    if(!game) return;
    const w=game.w,h=game.h;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.globalAlpha=.08; ctx.strokeStyle='#48e8ff'; ctx.lineWidth=1;
    for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    ctx.restore();
    game.bricks.forEach(b=>{if(!b.alive)return;ctx.shadowBlur=12;ctx.shadowColor=b.color;ctx.fillStyle=b.color;ctx.fillRect(b.x,b.y,b.w,b.h);ctx.shadowBlur=0;ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(b.x,b.y,b.w,2)});
    ctx.shadowBlur=18;ctx.shadowColor='#83e66b';ctx.fillStyle='#eafff4';ctx.fillRect(game.paddle.x,game.paddle.y,game.paddle.w,game.paddle.h);ctx.shadowBlur=0;
    ctx.beginPath();ctx.arc(game.ball.x,game.ball.y,game.ball.r,0,Math.PI*2);ctx.fillStyle='#c6ff72';ctx.shadowBlur=18;ctx.shadowColor='#83e66b';ctx.fill();ctx.shadowBlur=0;
    game.particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,3,3)});ctx.globalAlpha=1;
  }
  function updateGame(){
    if(!game.running)return;
    const p=game.paddle,b=game.ball;
    p.dx=(game.keys.left?-p.speed:0)+(game.keys.right?p.speed:0);p.x+=p.dx;p.x=Math.max(0,Math.min(game.w-p.w,p.x));
    b.x+=b.dx;b.y+=b.dy;
    if(b.x+b.r>game.w||b.x-b.r<0){b.dx*=-1;b.x=Math.max(b.r,Math.min(game.w-b.r,b.x))}
    if(b.y-b.r<0)b.dy*=-1;
    if(b.y+b.r>p.y&&b.y-b.r<p.y+p.h&&b.x>p.x&&b.x<p.x+p.w&&b.dy>0){const hit=(b.x-(p.x+p.w/2))/(p.w/2);b.dx=hit*5;b.dy=-Math.abs(b.dy)}
    game.bricks.forEach(br=>{if(!br.alive)return;if(b.x+b.r>br.x&&b.x-b.r<br.x+br.w&&b.y+b.r>br.y&&b.y-b.r<br.y+br.h){br.alive=false;b.dy*=-1;game.score+=10;spawnParticles(b.x,b.y,br.color)}});
    if(!game.bricks.some(b=>b.alive)){endGame(true);return}
    if(b.y-b.r>game.h){game.lives--;updateGameHud();if(game.lives<=0){endGame(false);return}b.x=game.w/2;b.y=game.h-55;b.dx=4*(Math.random()>.5?1:-1);b.dy=-4;showToast('Você perdeu uma vida. Continue!')}
    game.particles.forEach(p=>{p.x+=p.dx;p.y+=p.dy;p.life-=.04});game.particles=game.particles.filter(p=>p.life>0);updateGameHud();
  }
  function gameLoop(){ if(!game.running)return;updateGame();drawGame();requestAnimationFrame(gameLoop); }
  function movePaddleFromPointer(clientX){if(!game)return;const r=canvas.getBoundingClientRect();const x=clientX-r.left;game.paddle.x=Math.max(0,Math.min(game.w-game.paddle.w,x-game.paddle.w/2));}
  window.addEventListener('keydown',e=>{if(!game)return; if(['ArrowLeft','a','A'].includes(e.key)){game.keys.left=true;e.preventDefault()}if(['ArrowRight','d','D'].includes(e.key)){game.keys.right=true;e.preventDefault()}if(e.key===' '&& !game.running)startGame()});
  window.addEventListener('keyup',e=>{if(!game)return;if(['ArrowLeft','a','A'].includes(e.key))game.keys.left=false;if(['ArrowRight','d','D'].includes(e.key))game.keys.right=false});
  canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);movePaddleFromPointer(e.clientX)});
  canvas.addEventListener('pointermove',e=>{if(e.buttons)movePaddleFromPointer(e.clientX)});
  startGameBtn.addEventListener('click',()=>{resetGame();startGame()});restartGameBtn.addEventListener('click',()=>{resetGame();startGame()});
  window.addEventListener('resize',()=>{resizeCanvas();if(game&&!game.running)drawGame()});
  resizeCanvas();resetGame();
})();
