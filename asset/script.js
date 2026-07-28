document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tahun otomatis di footer ---------- */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ---------- Toggle menu navigasi (mobile) ---------- */
  const navToggle = document.getElementById('navToggle');
  const navRooms = document.querySelector('.nav-rooms');

  if (navToggle && navRooms) {
    navToggle.addEventListener('click', () => {
      const isOpen = navRooms.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navRooms.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navRooms.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Nav transparan di atas hero, padat saat digulir ---------- */
  const siteNav = document.getElementById('siteNav');

  if (siteNav) {
    const scrollThreshold = 40;
    function updateNavShell() {
      siteNav.classList.toggle('scrolled', window.scrollY > scrollThreshold);
    }
    updateNavShell();
    window.addEventListener('scroll', updateNavShell, { passive: true });
  }

  /* ---------- Sorotan aktif pada ruang yang sedang dilihat ---------- */
  const navLinks = document.querySelectorAll('.nav-rooms a');
  const rooms = document.querySelectorAll('main .room, main .hero');

  if ('IntersectionObserver' in window && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    rooms.forEach(room => navObserver.observe(room));
  }

  /* ---------- Kursor sorot lampu galeri ---------- */
  const spotlight = document.getElementById('spotlightCursor');

  if (spotlight && window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    let rafId = null;
    document.addEventListener('mousemove', (e) => {
      spotlight.classList.add('active');
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    });
    document.addEventListener('mouseleave', () => spotlight.classList.remove('active'));
  }

  /* ---------- Reveal saat digulir ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), (index % 4) * 90);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Statistik: hitung naik saat terlihat ---------- */
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    statNumbers.forEach(el => statObserver.observe(el));
  } else {
    statNumbers.forEach(animateCount);
  }

  /* ---------- Halaman detail (karya & ekstrakurikuler), overlay dalam satu file ----------
     Ganti seluruh isi objek "detailItems" ini dengan data karya/organisasimu sendiri.
     "meta" adalah daftar baris info bebas (label/value) yang tampil di kartu keterangan. */
  const detailItems = {

    'animasi-cerita-sekolah': {
      title: 'Short Animation: SKARISA Art',
      eyebrow: 'Keterangan Karya · 01',
      thumbClass: 'thumb-a',
      badge: 'Coming Soon',
      meta: [
        { label: 'Medium', value: 'Animasi 2D · Software Animasi' },
        { label: 'Tahun', value: '2026' },
        { label: 'Status', value: 'Sedang Dikerjakan' },
        { label: 'Peran', value: 'Konsep, Ilustrasi, Animator' }
      ],
      lede: 'Proyek animasi 2D sederhana yang mengangkat suasana dan keseharian di SMK Krian 1 Sidoarjo.',
      paragraphs: [
        '(Contoh teks — silakan ganti dengan cerita proyekmu.) Karya ini menjadi eksperimen pertama Nasywa dalam menggabungkan storytelling visual dengan teknik animasi dasar, mulai dari sketsa karakter, penyusunan storyboard, hingga penganimasian gerak sederhana.',
        'Idenya berangkat dari pengamatan suasana kelas dan koridor sekolah sehari-hari, lalu dituangkan menjadi rangkaian adegan pendek yang ringan dan personal.'
      ],
      featuresHeading: 'Yang Dikerjakan',
      features: [
        'Menyusun storyboard dan alur cerita singkat',
        'Menggambar karakter dan aset latar secara digital',
        'Menganimasikan gerakan dasar (frame by frame / tweening)',
        'Menyusun musik dan efek suara pendukung'
      ],
      tagsHeading: 'Perkakas & Teknologi',
      tags: ['Software Animasi 2D', 'Handphone', 'Storyboard Digital'],
      backHref: 'karya',
      backLabel: 'Kembali ke Dinding Karya'
    },

    'sistem-informasi-sekolah': {
      title: 'Sistem Informasi Sekolah',
      eyebrow: 'Keterangan Karya · 02',
      thumbClass: 'thumb-b',
      badge: '',
      meta: [
        { label: 'Medium', value: 'PHP · MySQL · Bootstrap' },
        { label: 'Tahun', value: '2025' },
        { label: 'Status', value: 'Contoh Proyek' },
        { label: 'Peran', value: 'Pengembang Web (Full-Stack Sederhana)' }
      ],
      lede: 'Contoh proyek berbasis web untuk mengelola data siswa, nilai, dan jadwal pelajaran.',
      paragraphs: [
        '(Contoh teks — ganti bagian ini dengan proyek nyata yang pernah kamu kerjakan selama praktik di jurusan RPL.) Sistem ini dirancang untuk membantu tata usaha sekolah mencatat data siswa, memasukkan nilai per mata pelajaran, dan menyusun jadwal pelajaran secara terpusat.',
        'Antarmuka dibangun dengan Bootstrap agar tetap rapi di berbagai ukuran layar, sementara data disimpan dan diolah menggunakan MySQL melalui backend PHP.'
      ],
      featuresHeading: 'Yang Dikerjakan',
      features: [
        'Login multi-peran (admin, guru, siswa)',
        'Manajemen data siswa dan kelas',
        'Input dan rekap nilai per semester',
        'Penjadwalan mata pelajaran otomatis'
      ],
      tagsHeading: 'Perkakas & Teknologi',
      tags: ['PHP', 'MySQL', 'Bootstrap', 'HTML/CSS'],
      backHref: 'karya',
      backLabel: 'Kembali ke Dinding Karya'
    },

    'ui-aplikasi-mobile': {
      title: 'Desain UI Aplikasi Mobile',
      eyebrow: 'Keterangan Karya · 03',
      thumbClass: 'thumb-c',
      badge: '',
      meta: [
        { label: 'Medium', value: 'Figma · Prototyping' },
        { label: 'Tahun', value: '2025' },
        { label: 'Status', value: 'Contoh Proyek' },
        { label: 'Peran', value: 'UI/UX Designer' }
      ],
      lede: 'Contoh rancangan antarmuka aplikasi mobile sederhana, lengkap dengan alur interaksi dasar.',
      paragraphs: [
        '(Contoh teks — bagian ini juga bisa diganti dengan tangkapan layar dan tautan prototipe dari desainmu sendiri.) Rancangan dimulai dari riset kebutuhan pengguna sederhana, dilanjutkan dengan wireframe kasar, lalu disempurnakan menjadi tampilan visual penuh di Figma.',
        'Prototipe interaktif dibuat agar alur perpindahan antar halaman bisa dicoba langsung sebelum masuk ke tahap pengembangan.'
      ],
      featuresHeading: 'Yang Dikerjakan',
      features: [
        'Riset kebutuhan pengguna secara sederhana',
        'Wireframe dan alur navigasi aplikasi',
        'Desain visual (UI Kit, warna, tipografi)',
        'Prototipe interaktif siap uji coba'
      ],
      tagsHeading: 'Perkakas & Teknologi',
      tags: ['Figma', 'FigJam', 'Prototyping'],
      backHref: 'karya',
      backLabel: 'Kembali ke Dinding Karya'
    },

    'landing-page-acara-sekolah': {
      title: 'Landing Page Acara Sekolah',
      eyebrow: 'Keterangan Karya · 04',
      thumbClass: 'thumb-d',
      badge: '',
      meta: [
        { label: 'Medium', value: 'HTML · CSS · JavaScript' },
        { label: 'Tahun', value: '2025' },
        { label: 'Status', value: 'Contoh Proyek' },
        { label: 'Peran', value: 'Front-End Developer' }
      ],
      lede: 'Contoh situs landing page satu halaman untuk keperluan promosi acara sekolah.',
      paragraphs: [
        '(Contoh teks — ganti dengan cerita proyek aslimu.) Situs ini dibangun sebagai halaman promosi satu layar penuh, lengkap dengan animasi scroll sederhana agar informasi acara tersampaikan secara menarik.',
        'Fokus utamanya adalah kecepatan akses dan kemudahan dibaca di perangkat mobile, mengingat sebagian besar pengunjung mengaksesnya lewat ponsel.'
      ],
      featuresHeading: 'Yang Dikerjakan',
      features: [
        'Struktur halaman satu layar (single page)',
        'Animasi saat elemen muncul ketika di-scroll',
        'Formulir pendaftaran/kontak sederhana',
        'Tampilan responsif untuk mobile dan desktop'
      ],
      tagsHeading: 'Perkakas & Teknologi',
      tags: ['HTML5', 'CSS3', 'JavaScript'],
      backHref: 'karya',
      backLabel: 'Kembali ke Dinding Karya'
    },

    'english-club': {
      title: 'English Club',
      eyebrow: 'Keterangan Organisasi · 01',
      thumbClass: 'thumb-e',
      badge: 'Aktif',
      meta: [
        { label: 'Kategori', value: 'Ekstrakurikuler Bahasa' },
        { label: 'Periode', value: '2024 — Sekarang' },
        { label: 'Status', value: 'Aktif Mengikuti' },
        { label: 'Peran', value: 'Anggota' }
      ],
      lede: 'Ekstrakurikuler yang melatih kemampuan berbahasa Inggris lewat percakapan, presentasi, dan berbagai lomba.',
      paragraphs: [
        '(Contoh teks — silakan ganti dengan ceritamu sendiri di English Club.) Di sini aku berlatih speaking dan public speaking lewat sesi diskusi rutin, permainan bahasa, dan simulasi percakapan sehari-hari bersama anggota lain.',
        'Ikut English Club juga membantu rasa percaya diriku saat harus presentasi dalam bahasa Inggris, termasuk untuk keperluan proyek RPL dan dokumentasi teknis.'
      ],
      featuresHeading: 'Kegiatan yang Diikuti',
      features: [
        'Sesi latihan speaking dan diskusi rutin mingguan',
        'Simulasi presentasi dan public speaking',
        'Games dan tantangan kosakata bahasa Inggris',
        'Persiapan lomba/kompetisi bahasa Inggris antar sekolah'
      ],
      tagsHeading: 'Keterampilan yang Diasah',
      tags: ['Speaking', 'Public Speaking', 'Listening', 'Kepercayaan Diri'],
      backHref: 'pengalaman',
      backLabel: 'Kembali ke Riwayat & Pengalaman'
    },

    'seni-lukis-rupa': {
      title: 'Seni Lukis / Rupa',
      eyebrow: 'Keterangan Organisasi · 02',
      thumbClass: 'thumb-f',
      badge: 'Aktif',
      meta: [
        { label: 'Kategori', value: 'Ekstrakurikuler Seni' },
        { label: 'Periode', value: '2024 — Sekarang' },
        { label: 'Status', value: 'Aktif Mengikuti' },
        { label: 'Peran', value: 'Anggota' }
      ],
      lede: 'Ekstrakurikuler seni rupa tempatku menyalurkan minat menggambar dan melukis di luar jam coding.',
      paragraphs: [
        '(Contoh teks — silakan ganti dengan ceritamu sendiri di Seni Lukis/Rupa.) Di ekstrakurikuler ini aku belajar berbagai teknik menggambar dan melukis, mulai dari sketsa dasar, pewarnaan, hingga komposisi visual sederhana.',
        'Minat di bidang seni rupa ini juga yang membuatku senang memperhatikan detail visual saat menyusun tampilan (UI) di proyek-proyek RPL-ku.'
      ],
      featuresHeading: 'Kegiatan yang Diikuti',
      features: [
        'Latihan sketsa dan menggambar dasar',
        'Eksplorasi teknik pewarnaan dan cat',
        'Diskusi komposisi warna dan bentuk',
        'Turut serta dalam pameran karya seni sekolah'
      ],
      tagsHeading: 'Keterampilan yang Diasah',
      tags: ['Sketsa', 'Pewarnaan', 'Komposisi Visual', 'Kreativitas'],
      backHref: 'pengalaman',
      backLabel: 'Kembali ke Riwayat & Pengalaman'
    }
  };

  const detailOverlay = document.getElementById('detailOverlay');

  function fillDetailContent(slug) {
    const data = detailItems[slug];
    if (!data) return false;

    document.getElementById('detailEyebrow').textContent = data.eyebrow;
    document.getElementById('detailTitle').textContent = data.title;
    document.getElementById('detailLede').textContent = data.lede;

    const thumbEl = document.getElementById('detailThumb');
    const badgeEl = document.getElementById('detailBadge');
    thumbEl.className = 'detail-thumb ' + data.thumbClass;
    if (data.badge) {
      badgeEl.textContent = data.badge;
      badgeEl.style.display = '';
      thumbEl.appendChild(badgeEl);
    } else {
      badgeEl.textContent = '';
      badgeEl.style.display = 'none';
    }

    const metaEl = document.getElementById('detailMeta');
    metaEl.innerHTML = '';
    data.meta.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'plaque-row';
      const labelEl = document.createElement('span');
      labelEl.textContent = row.label;
      const valueEl = document.createElement('span');
      valueEl.textContent = row.value;
      rowEl.appendChild(labelEl);
      rowEl.appendChild(valueEl);
      metaEl.appendChild(rowEl);
    });

    const paraWrap = document.getElementById('detailParagraphs');
    paraWrap.innerHTML = '';
    data.paragraphs.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      paraWrap.appendChild(p);
    });

    document.getElementById('detailListHeading').textContent = data.featuresHeading;
    const featuresEl = document.getElementById('detailFeatures');
    featuresEl.innerHTML = '';
    data.features.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      featuresEl.appendChild(li);
    });

    document.getElementById('detailTagHeading').textContent = data.tagsHeading;
    const tagsEl = document.getElementById('detailTech');
    tagsEl.innerHTML = '';
    data.tags.forEach(text => {
      const span = document.createElement('span');
      span.textContent = text;
      tagsEl.appendChild(span);
    });

    const closeLink = document.getElementById('detailClose');
    const backLink = document.getElementById('detailBackLink');
    const backLabelEl = document.getElementById('detailBackLabel');
    closeLink.href = '#' + data.backHref;
    backLink.href = '#' + data.backHref;
    backLabelEl.textContent = data.backLabel;

    return true;
  }

  function openDetail(slug) {
    if (!detailOverlay) return;
    if (!fillDetailContent(slug)) return;
    detailOverlay.classList.add('open');
    detailOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const scrollWrap = detailOverlay.querySelector('.detail-overlay-scroll');
    if (scrollWrap) scrollWrap.scrollTop = 0;
  }

  function closeDetail() {
    if (!detailOverlay) return;
    detailOverlay.classList.remove('open');
    detailOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function handleHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#detail=(.+)$/);
    if (match && detailItems[match[1]]) {
      openDetail(match[1]);
    } else {
      closeDetail();
    }
  }

  if (detailOverlay) {
    window.addEventListener('hashchange', handleHash);
    handleHash();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detailOverlay.classList.contains('open')) {
        const fallback = detailOverlay.querySelector('.detail-back-link');
        const target = fallback ? fallback.getAttribute('href') : '#karya';
        history.replaceState(null, '', window.location.pathname + window.location.search + target);
        closeDetail();
      }
    });
  }

  /* ---------- Tombol kembali ke atas ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > window.innerHeight * 0.8);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Form buku tamu (validasi sederhana, tanpa server) ---------- */
  const form = document.getElementById('guestbookForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.fname.value.trim();
      const email = form.femail.value.trim();
      const message = form.fmessage.value.trim();
    
      if (!name || !email || !message) {
        status.textContent = 'Mohon lengkapi semua kolom terlebih dahulu.';
        status.style.color = '#B02E2E';
        return;
      }
    
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
    
      if (res.ok) {
        status.textContent = `Terima kasih, ${name}! Pesanmu sudah terkirim.`;
        status.style.color = '';
        form.reset();
      } else {
        status.textContent = 'Maaf, pesan gagal terkirim. Coba lagi ya.';
        status.style.color = '#B02E2E';
      }
    });
  }

});