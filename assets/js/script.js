// Loader robusto: garante remoção SEMPRE!
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = 0;
      loader.style.pointerEvents = "none";
      setTimeout(() => { loader.style.display = 'none'; }, 600);
    }, 1200); // animação padrão

    // Safety net: garante que nunca fica travado!
    setTimeout(() => {
      loader.style.display = 'none';
      loader.style.opacity = 0;
      loader.style.pointerEvents = "none";
    }, 4000);
  }
});

// Progress bar de leitura
window.addEventListener('scroll', () => {
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollTop = window.scrollY || window.pageYOffset;
  const percent = Math.min(100, Math.max(0, 100 * scrollTop / docHeight));
  document.getElementById('progressBar').style.width = percent + "%";
  // Navbar background
  const navbar = document.querySelector('.navbar');
  if(window.scrollY > 80) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});
window.dispatchEvent(new Event('scroll'));

// Scrollspy fix e animação pill
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', function() {
    if(document.querySelector('.navbar-collapse.show')) {
      document.querySelector('.navbar-toggler').click();
    }
  });
});
// Smooth scroll custom
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if(this.hash && document.querySelector(this.hash)) {
      e.preventDefault();
      document.querySelector(this.hash).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
// Scroll reveal animations
function revealOnScroll() {
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if(elementTop < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Headline animada
const headlines = [
  'Especialistas que cuidam da sua saúde com <span class="text-gold">excelência</span> e <span class="text-gold">humanidade</span>.',
  'Cuidando de você em cada etapa da sua jornada.',
  'Transforme sua vida com o Instituto Pachu.'
];
let currentHeadline = 0;
setInterval(() => {
  const el = document.getElementById('headlineAnim');
  el.classList.add('fade-out');
  setTimeout(() => {
    currentHeadline = (currentHeadline + 1) % headlines.length;
    el.innerHTML = headlines[currentHeadline];
    el.classList.remove('fade-out');
  }, 750);
}, 6000);

// Tooltips bootstrap
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function(el){
  new bootstrap.Tooltip(el, { trigger: 'hover focus', container:'body' });
});

// Masonry grid
window.addEventListener('DOMContentLoaded', () => {
  if(typeof Masonry !== 'undefined') {
    document.querySelectorAll('.masonry-grid').forEach(grid => {
      new Masonry(grid, { itemSelector: '.col', percentPosition:true });
    });
  }
});

// IMC/TMB Calculadora
document.getElementById('calcForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const peso = parseFloat(document.getElementById('peso').value.replace(',', '.'));
  const altura = parseFloat(document.getElementById('altura').value.replace(',', '.'));
  const idade = parseInt(document.getElementById('idade').value);
  const sexo = document.getElementById('sexo').value;
  const atividade = parseFloat(document.getElementById('atividade').value);

  if (!peso || !altura || !idade || !sexo || !atividade) return;

  let imc = peso / Math.pow((altura/100), 2);
  let tmb;
  if (sexo === "masc") tmb = 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * idade);
  else tmb = 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * idade);
  const tmbFinal = tmb * atividade;

  let imcClass = 'imc-normal', imcPerc = 22;
  let feedbackIMC = "Peso saudável";
  if (imc < 18.5) { feedbackIMC = "Abaixo do peso"; imcClass = "imc-magreza"; imcPerc = 11; }
  else if (imc < 25) { feedbackIMC = "Peso saudável"; imcClass = "imc-normal"; imcPerc = 28; }
  else if (imc < 30) { feedbackIMC = "Sobrepeso"; imcClass = "imc-alerta"; imcPerc = 38; }
  else if (imc < 35) { feedbackIMC = "Obesidade I"; imcClass = "imc-perigo"; imcPerc = 58; }
  else if (imc < 40) { feedbackIMC = "Obesidade II"; imcClass = "imc-perigo"; imcPerc = 78; }
  else { feedbackIMC = "Obesidade III"; imcClass = "imc-perigo"; imcPerc = 92; }

  document.getElementById('resultadosCalc').classList.remove('d-none');
  document.querySelector('#resultadosCalc .imc-status').innerHTML =
    `IMC: <span class="${imcClass}">${imc.toFixed(1)} (${feedbackIMC})</span> <span class="ms-2">${imcFeedbackEmoji(imc)}</span>`;
  document.querySelector('#resultadosCalc .imc-bar').style.width = imcPerc + "%";
  document.querySelector('#resultadosCalc .tmb-status').innerHTML =
    `Gasto calórico estimado: <b>${tmbFinal.toFixed(0)} kcal/dia</b>`;
});
function imcFeedbackEmoji(imc) {
  if(imc<18.5) return '😯'; if(imc<25) return '😊'; if(imc<30) return '⚠️'; return '🚨';
}

// Galeria Lightbox
const lightboxModal = document.getElementById('lightboxModal');
if (lightboxModal) {
  lightboxModal.addEventListener('show.bs.modal', function (event) {
    const btn = event.relatedTarget;
    const imgSrc = btn.getAttribute('data-img');
    const caption = btn.getAttribute('data-caption');
    document.getElementById('lightboxImg').src = imgSrc;
    document.getElementById('lightboxCaption').textContent = caption;
    document.getElementById('lightboxImg').alt = caption;
  });
}

// Contato Form (validação + feedback)
document.getElementById('contatoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  let form = this, valid = true;
  ['nome', 'email', 'telefone', 'mensagem'].forEach(id => {
    const input = form.querySelector(`#${id}`);
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      valid = false;
    } else {
      input.classList.remove('is-invalid');
    }
  });
  if (!valid) return;
  showToast('Mensagem enviada com sucesso! Retornaremos em breve.');
  form.reset();
});

// Máscara telefone input
document.getElementById('telefone').addEventListener('input', function(e){
  let v = this.value.replace(/\D/g, '');
  if(v.length > 2) v = '(' + v.substr(0,2) + ') ' + v.substr(2);
  if(v.length > 10) v = v.substr(0,10) + '-' + v.substr(10,4);
  this.value = v.substr(0,15);
});

// LeadForm newsletter
document.getElementById('leadForm').addEventListener('submit', function(e){
  e.preventDefault();
  const email = document.getElementById('leadEmail');
  if(!email.value || !email.value.includes('@')) {
    showToast('Digite um e-mail válido!', true);
    return;
  }
  showToast('Cadastro realizado! Fique atento às novidades.');
  this.reset();
});

// Dark mode toggle manual
document.getElementById('themeToggle').addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', theme);
});
// Aumentar fonte
document.getElementById('fontInc').addEventListener('click', () => {
  document.body.style.fontSize = '1.15em';
});

// Toast feedback visual
function showToast(msg, error=false) {
  const area = document.getElementById('toastArea');
  const toast = document.createElement('div');
  toast.className = 'toast align-items-center show ' + (error ? 'bg-danger':'');
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  area.appendChild(toast);
  setTimeout(()=>{toast.remove();}, 3800);
}

// Exit intent pop-up lead (simplificado)
let exitIntentFired = false;
document.addEventListener('mouseleave', function(e){
  if(e.clientY < 32 && !exitIntentFired) {
    showToast('Antes de sair: agende uma avaliação gratuita pelo WhatsApp!');
    exitIntentFired = true;
  }
});

// Dark mode automático ainda ativado por padrão no load
function autoDarkMode() {
  if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }
}
autoDarkMode();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', autoDarkMode);
