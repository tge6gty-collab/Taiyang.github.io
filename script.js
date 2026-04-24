/* =============================================
   葛泰扬个人主页 · script.js
   模块：打字机 / 粒子 / 导航 / 过渡遮罩 /
         雷达图 / 进度条 / 灯箱 / 滚动入场
   ============================================= */

/* ===== 1. 打字机动画 ===== */
const titles = [
  '生物医学工程硕士生',
  'AI 产品经理方向',
  '数据驱动型探索者',
];
let titleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  const current = titles[titleIndex];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  let delay = isDeleting ? 60 : 110;
  if (!isDeleting && charIndex > current.length) { delay = 2200; isDeleting = true; }
  else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
    delay = 400;
  }
  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 1300);

/* ===== 2. 暖色菱形粒子 ===== */
const particlesEl = document.getElementById('particles');
const PARTICLE_COLORS = ['#d4960a', '#c0394b', '#3a7a3a', '#e8b020', '#d94060'];

for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration  = (10 + Math.random() * 14) + 's';
  p.style.animationDelay     = (Math.random() * 14) + 's';
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

  // 淡出
  document.body.classList.remove('page-fading-in');
  document.body.classList.add('page-fading');

  setTimeout(() => {
    // opacity=0 时瞬间滚动，用户不可见
    const target = document.querySelector(targetSelector);
    if (target) target.scrollIntoView({ behavior: 'instant' });

    // 淡入
    document.body.classList.remove('page-fading');
    document.body.classList.add('page-fading-in');

    setTimeout(() => {
      document.body.classList.remove('page-fading-in');
      isFading = false;
    }, 300);
  }, 190);
}

// 导航 a 标签 & 按钮（href 以 # 开头）
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
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObserver.observe(el));

/* ===== 8. 雷达图（SVG 手绘） ===== */
function drawRadarChart() {
  const skillData = [
    { label: 'Python',    value: 85 },
    { label: 'MATLAB',    value: 70 },
    { label: 'ML',        value: 80 },
    { label: '医学图像',  value: 65 },
    { label: '数据分析',  value: 75 },
    { label: '产品思维',  value: 80 },
  ];

  const svg  = document.getElementById('radar-svg');
  const NS   = 'http://www.w3.org/2000/svg';
  const cx = 150, cy = 150, maxR = 100, n = skillData.length;
  const LEVELS = 5;

  // 辅助：计算第 i 轴、比例 t 的坐标
  const pt = (i, t) => {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    return [cx + maxR * t * Math.cos(angle), cy + maxR * t * Math.sin(angle)];
  };

  // 背景网格（同心多边形）
  for (let lv = 1; lv <= LEVELS; lv++) {
    const poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', Array.from({length: n}, (_, i) => pt(i, lv/LEVELS).join(',')).join(' '));
    poly.setAttribute('fill',   lv % 2 === 0 ? 'rgba(212,150,10,0.06)' : 'none');
    poly.setAttribute('stroke', 'rgba(212,150,10,0.22)');
    poly.setAttribute('stroke-width', '0.8');
    svg.appendChild(poly);
  }

  // 轴线
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(i, 1);
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', x);  line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(212,150,10,0.32)');
    line.setAttribute('stroke-width', '0.8');
    svg.appendChild(line);
  }

  // 轴标签
  skillData.forEach((d, i) => {
    const [x, y] = pt(i, 1.28);
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '10.5');
    text.setAttribute('font-family', "'Noto Serif SC', serif");
    text.setAttribute('fill', '#7a6652');
    text.textContent = d.label;
    svg.appendChild(text);
  });

  // 数据面板（带动画类）
  const points = skillData.map((d, i) => pt(i, d.value / 100).join(',')).join(' ');
  const dataPoly = document.createElementNS(NS, 'polygon');
  dataPoly.setAttribute('points', points);
  dataPoly.setAttribute('fill',   'rgba(212,150,10,0.22)');
  dataPoly.setAttribute('stroke', '#d4960a');
  dataPoly.setAttribute('stroke-width', '2');
  dataPoly.setAttribute('stroke-linejoin', 'round');
  dataPoly.classList.add('radar-data');
  svg.appendChild(dataPoly);

  // 数据点小圆
  skillData.forEach((d, i) => {
    const [x, y] = pt(i, d.value / 100);
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', x); dot.setAttribute('cy', y);
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#d4960a');
    dot.setAttribute('stroke', 'rgba(250,243,224,0.9)');
    dot.setAttribute('stroke-width', '1.8');
    dot.classList.add('radar-data');
    svg.appendChild(dot);
  });

  // 中心点
  const center = document.createElementNS(NS, 'circle');
  center.setAttribute('cx', cx); center.setAttribute('cy', cy);
  center.setAttribute('r', '3.5');
  center.setAttribute('fill', '#d4960a');
  svg.appendChild(center);
}

drawRadarChart();

// 雷达图入场动画（滚动到视口时触发）
const radarEl = document.querySelector('.radar-container');
const radarObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.radar-data').forEach(el => el.classList.add('radar-visible'));
    radarObserver.disconnect();
  }
}, { threshold: 0.3 });
if (radarEl) radarObserver.observe(radarEl);

/* ===== 9. 进度条动画 ===== */
const progressObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.progress-fill').forEach(el => {
      const val = el.dataset.value;
      // 短暂延迟确保 CSS transition 生效
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { el.style.width = val + '%'; });
      });
    });
    progressObserver.disconnect();
  }
}, { threshold: 0.3 });
const progressContainer = document.querySelector('.progress-container');
if (progressContainer) progressObserver.observe(progressContainer);

/* ===== 10. 灯箱 ===== */
const lightbox   = document.getElementById('lightbox');
const lbClose    = document.getElementById('lb-close');
const lbBackdrop = lightbox.querySelector('.lb-backdrop');
const lbImage    = document.getElementById('lb-image');
const lbTitle    = document.getElementById('lb-title');
const lbDesc     = document.getElementById('lb-desc');
const lbTags     = document.getElementById('lb-tags');
const lbLinks    = document.getElementById('lb-links');

function openLightbox(card) {
  const { title, desc, tags, color, github, demo } = card.dataset;

  // 占位图（渐变色块 + emoji）
  const icon = card.querySelector('.project-thumb-icon')?.textContent || '🎯';
  lbImage.style.cssText = `background:${color};font-size:4rem;display:flex;align-items:center;justify-content:center;border-radius:11px 11px 0 0;`;
  lbImage.textContent = icon;

  lbTitle.textContent = title || '';
  lbDesc.textContent  = desc  || '';

  // 标签
  lbTags.innerHTML = '';
  (tags || '').split(',').forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t.trim();
    lbTags.appendChild(span);
  });

  // 链接
  lbLinks.innerHTML = '';
  if (github && github !== '#') {
    lbLinks.innerHTML += `<a href="${github}" target="_blank" rel="noopener" class="lb-link lb-link-primary">GitHub →</a>`;
  } else {
    lbLinks.innerHTML += `<span class="lb-link lb-link-outline" style="opacity:0.45;cursor:default">GitHub（待更新）</span>`;
  }
  if (demo && demo !== '#') {
    lbLinks.innerHTML += `<a href="${demo}" target="_blank" rel="noopener" class="lb-link lb-link-outline">Demo →</a>`;
  }

  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

// 点击项目卡片
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openLightbox(card));
});

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);

// ESC 关闭
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

/* ===== 11. 头像点击粒子爆发 ===== */
const photoWrap = document.querySelector('.photo-frame-wrap');
const BURST_COLORS = ['#d4960a', '#e8b020', '#f0c030', '#d4960a', 'rgba(255,215,80,0.95)'];
let burstCooling = false;

photoWrap.addEventListener('pointerdown', () => {
  if (burstCooling) return;
  burstCooling = true;
  setTimeout(() => { burstCooling = false; }, 1000);

  // 短暂辉光
  photoWrap.classList.add('photo-burst');
  setTimeout(() => photoWrap.classList.remove('photo-burst'), 420);

  // 18 颗爆发粒子，均匀分布角度 + 随机扰动
  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i / 18) + (Math.random() - 0.5) * 0.35;
    const dist  = 90 + Math.random() * 85;
    const bx    = (Math.cos(angle) * dist).toFixed(1);
    const by    = (Math.sin(angle) * dist).toFixed(1);
    const bs    = (5 + Math.random() * 4).toFixed(1) + 'px';
    const bd    = (0.85 + Math.random() * 0.4).toFixed(2) + 's';
    const bc    = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];

    const p = document.createElement('div');
    p.className = 'burst-particle';
    p.style.cssText = `--bx:${bx}px;--by:${by}px;--bs:${bs};--bc:${bc};--bd:${bd};`;
    photoWrap.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }

  // 3 圈脉冲圆环，依次延迟
  [0, 160, 310].forEach(delay => {
    setTimeout(() => {
      const ring = document.createElement('div');
      ring.className = 'pulse-ring';
      photoWrap.appendChild(ring);
      // 触发 reflow 后再加动画，确保 opacity:0 → 动画生效
      ring.getBoundingClientRect();
      ring.style.animation = 'pulse-ring 0.9s ease-out forwards';
      ring.addEventListener('animationend', () => ring.remove(), { once: true });
    }, delay);
  });
});
