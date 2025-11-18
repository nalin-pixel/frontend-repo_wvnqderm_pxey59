/* Rah-e-Aavard - Main JS
   - Mobile menu drawer
   - Animated counters on scroll
   - Smooth scroll for anchor links
   - Lightweight reveal-on-scroll (AOS-like)
   - Simple testimonials slider
   - Pre-filled WhatsApp helper
*/
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

// Mobile drawer
const drawer = $('.drawer');
const openBtn = $('#open-drawer');
const closeDrawer = () => drawer?.classList.remove('open');
openBtn?.addEventListener('click', ()=> drawer.classList.add('open'));
drawer?.addEventListener('click', (e)=>{ if(e.target.classList.contains('drawer')) closeDrawer(); });
$('#close-drawer')?.addEventListener('click', closeDrawer);

// Smooth scroll for internal anchors
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth', block:'start'});
      closeDrawer();
    }
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('show'); io.unobserve(entry.target); }
  })
},{threshold:.12});
$$('.reveal').forEach(el=> io.observe(el));

// Counters
function animateCount(el){
  const target = +el.dataset.to || 0;
  const duration = 1200; // ms
  const start = performance.now();
  const from = 0;
  function tick(now){
    const p = Math.min(1, (now - start)/duration);
    const val = Math.floor(from + (target - from) * (1 - Math.pow(1-p, 3)));
    el.textContent = val.toLocaleString();
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countersObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      animateCount(entry.target);
      countersObserver.unobserve(entry.target);
    }
  })
},{threshold:.4});
$$('.counter').forEach(el=> countersObserver.observe(el));

// Slider (testimonials)
(function(){
  const track = $('.slides');
  if(!track) return;
  let index = 0;
  const dots = $$('.dot');
  function show(i){
    index = (i + dots.length) % dots.length;
    track.scrollTo({left: track.clientWidth * index, behavior:'smooth'});
    dots.forEach((d,di)=> d.classList.toggle('active', di===index));
  }
  dots.forEach((d,i)=> d.addEventListener('click', ()=> show(i)));
  let auto = setInterval(()=> show(index+1), 4000);
  track.addEventListener('pointerdown', ()=>{ clearInterval(auto); auto = setInterval(()=> show(index+1), 5000); });
})();

// WhatsApp helpers
function waLink(text){
  const phone = '923001234567'; // Replace with business number (without +)
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
$$('[data-wa]').forEach(btn=> btn.addEventListener('click', ()=> waLink(btn.dataset.wa)));

// Assessment form -> WhatsApp
$('#assessment-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = $('#name')?.value?.trim()||'';
  const phone = $('#phone')?.value?.trim()||'';
  const country = $('#country')?.value||'';
  const msg = $('#message')?.value?.trim()||'';
  const text = `Free Assessment Request%0AName: ${name}%0APhone: ${phone}%0AInterested Country: ${country}%0AMessage: ${msg}`;
  waLink(text);
});
