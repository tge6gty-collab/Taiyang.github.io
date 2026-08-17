/* =====================================================
   葛泰扬 · AI 产品经理个人主页 · script.js
   打字机 / 粒子 / 导航 / 页面过渡 / 手风琴 /
   进度条 / 业绩数字滚动 / 灯箱 / 滚动入场 / 头像爆发
   ===================================================== */

/* 标记 JS 可用（用于渐进增强的 reveal 动画） */
document.documentElement.classList.add('js');

/* ===== 1. 打字机 ===== */
const titles = [
  'AI 产品经理',
  '商业化产品经理',
  'C 端产品经理',
  'AI 产品从 0 到 1 落地者',
];
let titleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  const current = titles[titleIndex];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);
  let delay = isDeleting ? 55 : 110;
  if (!isDeleting && charIndex > current.length) { delay = 2200; isDeleting = true; }
  else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
    delay = 450;
  }
  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 1300);

/* ===== 2. 暖色菱形粒子 ===== */
const particlesEl = document.getElementById('particles');
const PARTICLE_COLORS = ['#c9a24b', '#a8546a', '#7a8b5f', '#e7c869', '#b87c8a'];
for (let i = 0; i < 26; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = (11 + Math.random() * 14) + 's';
  p.style.animationDelay = (Math.random() * 15) + 's';
  const s = (3 + Math.random() * 3.5) + 'px';
  p.style.width = p.style.height = s;
  p.style.background = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  particlesEl.appendChild(p);
}

/* ===== 3. 导航栏滚动 ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== 4. 汉堡菜单 ===== */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinksEl.classList.toggle('open'));

/* ===== 5. 页面过渡（柔和 fade） ===== */
let isFading = false;
function navigateTo(targetSelector) {
  if (isFading) return;
  isFading = true;
  document.body.classList.remove('page-fading-in');
  document.body.classList.add('page-fading');
  setTimeout(() => {
    const target = document.querySelector(targetSelector);
    if (target) target.scrollIntoView({ behavior: 'instant' });
    document.body.classList.remove('page-fading');
    document.body.classList.add('page-fading-in');
    setTimeout(() => { document.body.classList.remove('page-fading-in'); isFading = false; }, 300);
  }, 190);
}
document.querySelectorAll('.nav-links a, .nav-trigger').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    navLinksEl.classList.remove('open');
    navigateTo(href);
  });
});

/* ===== 6. 高亮当前导航项 ===== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ===== 7. 滚动入场动画 ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== 8. 进度条动画 ===== */
const progressObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.progress-fill').forEach(el => {
      const val = el.dataset.value;
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = val + '%'; }));
    });
    progressObserver.disconnect();
  }
}, { threshold: 0.3 });
const progressContainer = document.querySelector('.progress-container');
if (progressContainer) progressObserver.observe(progressContainer);

/* ===== 9. 业绩数字滚动动画 ===== */
function animateNumber(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = (String(target).split('.')[1] || '').length;
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const cur = (target * eased).toFixed(decimals);
    el.textContent = prefix + cur + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target + suffix;
  }
  requestAnimationFrame(tick);
}
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.metric-num[data-target]').forEach(animateNumber);
      metricObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.exp-card').forEach(c => metricObserver.observe(c));

/* ===== 10. 技能手风琴 ===== */
(function () {
  document.querySelectorAll('.skill-accordion-header').forEach(header => {
    const activate = () => {
      const item = header.closest('.skill-accordion-item');
      const body = item.querySelector('.skill-accordion-body');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.skill-accordion-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.skill-accordion-body').style.maxHeight = '0';
      });
      if (!isOpen) { item.classList.add('open'); body.style.maxHeight = body.scrollHeight + 'px'; }
    };
    header.addEventListener('click', activate);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });
}());

/* ===== 11. 灯箱（经历卡片 + 作品卡片共用） ===== */
const lightbox = document.getElementById('lightbox');
const lbClose = document.getElementById('lb-close');
const lbBackdrop = lightbox.querySelector('.lb-backdrop');
const lbImage = document.getElementById('lb-image');
const lbTitle = document.getElementById('lb-title');
const lbMeta = document.getElementById('lb-meta');
const lbDesc = document.getElementById('lb-desc');
const lbPoints = document.getElementById('lb-points');
const lbTags = document.getElementById('lb-tags');
const lbLinks = document.getElementById('lb-links');

function openLightbox(card) {
  const { title, meta, desc, points, tags, color, demo } = card.dataset;
  const icon = card.querySelector('.project-thumb-icon')?.textContent
    || card.querySelector('.exp-logo')?.textContent || '❧';
  lbImage.style.cssText = `background:${color || 'linear-gradient(135deg,#c9a24b,#a67c2e)'};`;
  lbImage.textContent = icon;

  lbTitle.textContent = title || '';
  lbMeta.textContent = meta || '';
  lbMeta.style.display = meta ? '' : 'none';
  lbDesc.textContent = desc || '';

  lbPoints.innerHTML = '';
  (points || '').split('|').filter(Boolean).forEach(pt => {
    const li = document.createElement('li');
    li.textContent = pt.trim();
    lbPoints.appendChild(li);
  });

  lbTags.innerHTML = '';
  (tags || '').split(',').filter(Boolean).forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t.trim();
    lbTags.appendChild(span);
  });

  lbLinks.innerHTML = '';
  if (demo && demo !== '#') {
    lbLinks.innerHTML = `<a href="${demo}" target="_blank" rel="noopener" class="lb-link lb-link-primary">在线 Demo →</a>`;
  }

  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox() { lightbox.hidden = true; document.body.style.overflow = ''; }

document.querySelectorAll('.project-card, .exp-card').forEach(card => {
  card.addEventListener('click', () => openLightbox(card));
});
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

/* ===== 12. 头像点击 → 粒子爆发 + 弹出联系方式名片 ===== */
const photoWrap = document.querySelector('.photo-frame-wrap');
const contactPop = document.getElementById('contact-pop');
const BURST_COLORS = ['#c9a24b', '#e7c869', '#a8546a', '#7a8b5f', 'rgba(231,200,105,0.95)'];

function photoBurst() {
  photoWrap.classList.add('photo-burst');
  setTimeout(() => photoWrap.classList.remove('photo-burst'), 420);
  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i / 18) + (Math.random() - 0.5) * 0.35;
    const dist = 95 + Math.random() * 85;
    const bx = (Math.cos(angle) * dist).toFixed(1);
    const by = (Math.sin(angle) * dist).toFixed(1);
    const bs = (5 + Math.random() * 4).toFixed(1) + 'px';
    const bd = (0.85 + Math.random() * 0.4).toFixed(2) + 's';
    const bc = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
    const p = document.createElement('div');
    p.className = 'burst-particle';
    p.style.cssText = `--bx:${bx}px;--by:${by}px;--bs:${bs};--bc:${bc};--bd:${bd};`;
    photoWrap.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }
}

function openContactPop() {
  photoWrap.classList.add('pop-open');
  photoWrap.setAttribute('aria-expanded', 'true');
  photoBurst();
}
function closeContactPop() {
  photoWrap.classList.remove('pop-open');
  photoWrap.setAttribute('aria-expanded', 'false');
}
function toggleContactPop() {
  if (photoWrap.classList.contains('pop-open')) closeContactPop();
  else openContactPop();
}

if (photoWrap && contactPop) {
  photoWrap.addEventListener('click', (e) => {
    // 点击浮层内部（复制/链接）不切换开关
    if (contactPop.contains(e.target)) return;
    toggleContactPop();
  });
  photoWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleContactPop(); }
  });

  // 点击外部关闭
  document.addEventListener('click', (e) => {
    if (photoWrap.classList.contains('pop-open') && !photoWrap.contains(e.target)) closeContactPop();
  });
  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && photoWrap.classList.contains('pop-open')) closeContactPop();
  });

  // 复制联系方式
  contactPop.querySelectorAll('.cp-item[data-copy]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = item.dataset.copy;
      const done = () => {
        item.classList.add('copied');
        setTimeout(() => item.classList.remove('copied'), 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(done).catch(done);
      } else {
        const ta = document.createElement('textarea');
        ta.value = val; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        ta.remove(); done();
      }
    });
  });
}
