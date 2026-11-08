/* ============================================================
   ALDRIN ABIR — CREATIVE PORTFOLIO
   High-Performance Vanilla JS Architecture
   Smooth Cursor · Timeline Playhead · Intersection Reveals · Counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. Lenis Ultra-Smooth Inertia Scroll Engine ───────── */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential luxury spring decay
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.8,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ── 1. Unified 120fps Scroll Pipeline (Zero Layout Thrashing) ── */
  const scrollProgress = document.getElementById('scrollProgress');
  const topNavBar = document.getElementById('topNavBar');
  const topNavLinks = document.querySelectorAll('.top-nav-link');
  const navSections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const floatingDock = document.getElementById('floatingDock');
  const floatingChatTrigger = document.getElementById('floatingChatTrigger');
  const reelScrollTrack = document.getElementById('reelScrollTrack');
  const reelExpandingContainer = document.getElementById('reelExpandingContainer');

  function updateReelScrollExpansion() {
    if (!reelScrollTrack || !reelExpandingContainer || window.innerWidth <= 768) return;

    const rect = reelScrollTrack.getBoundingClientRect();
    const windowH = window.innerHeight;
    
    // Calculate scroll progress from 0 when track top enters viewport, to 1
    const totalTrackDist = rect.height - windowH;
    if (totalTrackDist <= 0) return;

    const scrolledDist = -rect.top;
    let progress = Math.max(0, Math.min(1, scrolledDist / (totalTrackDist * 0.75)));

    // Pure hardware-accelerated GPU scale and border-radius (zero layout reflows)
    const scale = 0.82 + (progress * 0.18);
    const radius = Math.max(8, 28 - (progress * 20));

    reelExpandingContainer.style.transform = `scale(${scale})`;
    reelExpandingContainer.style.borderRadius = `${radius}px`;
  }

  function handleUnifiedScroll(scrollPos) {
    // 1a. GPU-Accelerated Scroll Progress Bar (scaleX)
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && scrollProgress) {
      const progress = scrollPos / totalHeight;
      scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    }

    // 1b. Architectural Top Navigation Elevation
    if (topNavBar) {
      if (scrollPos > 40) {
        topNavBar.classList.add('nav-scrolled');
      } else {
        topNavBar.classList.remove('nav-scrolled');
      }
    }

    // 1c. Back To Top & Floating Controls (Revealed after leaving clean hero)
    if (backToTopBtn) {
      if (scrollPos > 450) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }

    if (floatingChatTrigger) {
      if (scrollPos > 320) {
        floatingChatTrigger.classList.add('is-visible');
      } else {
        floatingChatTrigger.classList.remove('is-visible');
      }
    }

    // 1d. Cinematic Showreel GPU Expansion
    updateReelScrollExpansion();
  }

  if (lenis) {
    lenis.on('scroll', (e) => handleUnifiedScroll(e.scroll));
  }
  window.addEventListener('scroll', () => handleUnifiedScroll(window.scrollY), { passive: true });
  handleUnifiedScroll(window.scrollY || 0);

  // 1e. Zero-Layout-Thrashing Active Nav Indicator for Floating Dock
  const dockLinks = document.querySelectorAll('.dock-item-link, .dock-brand-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        dockLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-25% 0px -50% 0px',
    threshold: 0
  });

  navSections.forEach(sec => navObserver.observe(sec));

  // 1f. Smooth Scroll Anchor Navigation
  function scrollToTarget(target) {
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: -30, duration: 1.25 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  dockLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        scrollToTarget(document.querySelector(href));
      }
    });
  });

  const processTeaserBtn = document.getElementById('processTeaserBtn');
  if (processTeaserBtn) {
    processTeaserBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const reelSection = document.getElementById('reel');
      if (reelSection) scrollToTarget(reelSection);
    });
  }


  /* ── 2. Custom Magnetic Cursor with Lerp Physics ──────────── */
  const cursor = document.getElementById('customCursor');
  const cursorDot = cursor ? cursor.querySelector('.cursor-dot') : null;
  const cursorRing = cursor ? cursor.querySelector('.cursor-ring') : null;
  const cursorLabel = cursor ? cursor.querySelector('.cursor-label') : null;

  if (cursor && window.innerWidth > 768) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    });

    function renderCursor() {
      // Lerp smoothing (0.15 factor for crisp responsiveness)
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (cursorRing) {
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      if (cursorLabel) {
        cursorLabel.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Cursor Context-Aware States
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const type = el.getAttribute('data-cursor');
        document.body.classList.remove('cursor-hover', 'cursor-view', 'cursor-play');

        if (type === 'VIEW') {
          document.body.classList.add('cursor-view');
          if (cursorLabel) cursorLabel.textContent = 'VIEW';
        } else if (type === 'PLAY') {
          document.body.classList.add('cursor-play');
          if (cursorLabel) cursorLabel.textContent = 'PLAY';
        } else if (type === 'SCROLL') {
          document.body.classList.add('cursor-view');
          if (cursorLabel) cursorLabel.textContent = 'SCROLL';
        } else if (type === 'LINK') {
          document.body.classList.add('cursor-hover');
        }
      });

      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover', 'cursor-view', 'cursor-play');
        if (cursorLabel) cursorLabel.textContent = '';
      });
    });

    // Standard anchors and buttons
    document.querySelectorAll('a, button, .app-icon-badge, .service-cyan-pill').forEach((el) => {
      if (!el.hasAttribute('data-cursor')) {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      }
    });

    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }


  /* ── 2b. Synthesized Ambient Spatial UI Audio FX Engine ──────── */
  const audioFx = {
    ctx: null,
    enabled: true,
    lastHoverTime: 0,
    init() {
      const saved = localStorage.getItem('aldrin_audio_fx');
      this.enabled = saved !== 'false';
      this.updateButton();

      const toggleBtn = document.getElementById('audioFxToggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle();
        });
      }

      // Micro-haptic sound events on interactive elements
      document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .pricing-card, .pricing-addon-label, .faq-category-pill, .faq-trigger, .work-slide, .service-focus-item, .sound-pill, .palette-chip');
        if (target && !target.dataset.audioBoundHover) {
          target.dataset.audioBoundHover = 'true';
          target.addEventListener('mouseenter', () => this.playHover());
        }
      }, { passive: true });

      document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, .pricing-addon-label, .faq-category-pill, .faq-trigger, .work-slide, .pricing-lock-btn, .service-drawer-cta-btn');
        if (btn && btn.id !== 'audioFxToggle') {
          this.playClick();
        }
      }, { passive: true });
    },
    getCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    },
    playHover() {
      if (!this.enabled) return;
      const nowMs = performance.now();
      if (nowMs - this.lastHoverTime < 60) return; // Debounce rapid hovering
      this.lastHoverTime = nowMs;
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(640, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.045);
      } catch (err) {}
    },
    playClick() {
      if (!this.enabled) return;
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1050, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.06);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.065);
      } catch (err) {}
    },
    playDrawerOpen() {
      if (!this.enabled) return;
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        [392, 523.25, 659.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.035);
          gain.gain.setValueAtTime(0.02, now + idx * 0.035);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.035);
          osc.stop(now + idx * 0.035 + 0.2);
        });
      } catch (err) {}
    },
    playToggle() {
      if (!this.enabled) return;
      try {
        const ctx = this.getCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(780, now + 0.06);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (err) {}
    },
    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('aldrin_audio_fx', this.enabled ? 'true' : 'false');
      this.updateButton();
      if (this.enabled) {
        this.playToggle();
        if (typeof showToast === 'function') showToast('Spatial UI Audio FX Enabled');
      } else {
        if (typeof showToast === 'function') showToast('Spatial UI Audio FX Muted');
      }
    },
    updateButton() {
      const btn = document.getElementById('audioFxToggle');
      const statusLbl = document.getElementById('audioStatusLabel');
      if (!btn) return;
      if (this.enabled) {
        btn.classList.remove('is-muted');
        btn.setAttribute('aria-label', 'Mute UI micro-sound effects');
        btn.setAttribute('title', 'Audio FX: Enabled (Click to Mute)');
        if (statusLbl) statusLbl.textContent = 'SOUND ON';
      } else {
        btn.classList.add('is-muted');
        btn.setAttribute('aria-label', 'Enable UI micro-sound effects');
        btn.setAttribute('title', 'Audio FX: Muted (Click to Enable)');
        if (statusLbl) statusLbl.textContent = 'MUTED';
      }
    }
  };

  audioFx.init();


  /* ── 3. Magnetic CTA Button Physics (Awwwards Style) ────────── */
  if (window.innerWidth > 768) {
    const magneticElements = document.querySelectorAll(
      '#ctaMagneticBtn, .hero-primary-cta, .hero-secondary-cta, .top-nav-cta-btn, .dock-cta-btn, .coverflow-nav-btn'
    );
    magneticElements.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - btnCenterX) * 0.22;
        const deltaY = (e.clientY - btnCenterY) * 0.22;
        btn.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.03)`;
        btn.style.transition = 'transform 0.08s ease-out';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }


  /* ── 4. Hero Video Controller & Interactive Scrubber ─────── */
  const heroVideo = document.getElementById('heroVideo');
  const heroPlayToggle = document.getElementById('heroPlayToggle');
  const heroIconPause = document.getElementById('heroIconPause');
  const heroIconPlay = document.getElementById('heroIconPlay');
  const heroSoundToggle = document.getElementById('heroSoundToggle');
  const heroIconMuted = document.getElementById('heroIconMuted');
  const heroIconUnmuted = document.getElementById('heroIconUnmuted');
  const heroScrubberWrap = document.getElementById('heroScrubberWrap');
  const heroScrubberTrack = document.getElementById('heroScrubberTrack');
  const heroScrubberProgress = document.getElementById('heroScrubberProgress');
  const heroScrubberThumb = document.getElementById('heroScrubberThumb');

  if (heroVideo) {
    // Autoplay guarantee
    heroVideo.muted = true;
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback if browser requires user gesture
        if (heroPlayToggle) {
          heroPlayToggle.classList.add('is-paused');
          if (heroIconPause) heroIconPause.style.display = 'none';
          if (heroIconPlay) heroIconPlay.style.display = 'block';
        }
      });
    }

    // Play/Pause State Synchronization
    function updatePlayState(isPlaying) {
      if (heroPlayToggle) {
        if (isPlaying) {
          heroPlayToggle.classList.remove('is-paused');
          if (heroIconPause) heroIconPause.style.display = 'block';
          if (heroIconPlay) heroIconPlay.style.display = 'none';
        } else {
          heroPlayToggle.classList.add('is-paused');
          if (heroIconPause) heroIconPause.style.display = 'none';
          if (heroIconPlay) heroIconPlay.style.display = 'block';
        }
      }
    }

    heroVideo.addEventListener('play', () => updatePlayState(true));
    heroVideo.addEventListener('pause', () => updatePlayState(false));

    if (heroPlayToggle) {
      heroPlayToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (heroVideo.paused) {
          heroVideo.play();
        } else {
          heroVideo.pause();
        }
      });
    }


    // Audio Mute/Unmute Toggle
    if (heroSoundToggle) {
      heroSoundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        heroVideo.muted = !heroVideo.muted;
        if (heroVideo.muted) {
          if (heroIconMuted) heroIconMuted.style.display = 'block';
          if (heroIconUnmuted) heroIconUnmuted.style.display = 'none';
          heroSoundToggle.setAttribute('aria-label', 'Unmute audio');
        } else {
          if (heroIconMuted) heroIconMuted.style.display = 'none';
          if (heroIconUnmuted) heroIconUnmuted.style.display = 'block';
          heroSoundToggle.setAttribute('aria-label', 'Mute audio');
        }
      });
    }

    // Real-Time Scrubber Progress Update
    let isScrubbing = false;

    heroVideo.addEventListener('timeupdate', () => {
      if (!isScrubbing && heroVideo.duration) {
        const percent = (heroVideo.currentTime / heroVideo.duration) * 100;
        if (heroScrubberProgress) heroScrubberProgress.style.width = `${percent}%`;
        if (heroScrubberThumb) heroScrubberThumb.style.left = `${percent}%`;
      }
    });

    // Scrubber Seeking (Click & Drag)
    function seekFromEvent(e) {
      if (!heroScrubberTrack || !heroVideo.duration) return;
      const rect = heroScrubberTrack.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      heroVideo.currentTime = pos * heroVideo.duration;
      const percent = pos * 100;
      if (heroScrubberProgress) heroScrubberProgress.style.width = `${percent}%`;
      if (heroScrubberThumb) heroScrubberThumb.style.left = `${percent}%`;
    }

    if (heroScrubberWrap) {
      heroScrubberWrap.addEventListener('mousedown', (e) => {
        isScrubbing = true;
        seekFromEvent(e);

        const onMouseMove = (moveEvent) => {
          if (isScrubbing) seekFromEvent(moveEvent);
        };

        const onMouseUp = () => {
          isScrubbing = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      // Mobile Touch Scrubbing
      heroScrubberWrap.addEventListener('touchstart', (e) => {
        isScrubbing = true;
        if (e.touches && e.touches[0]) seekFromEvent(e.touches[0]);
      }, { passive: true });

      heroScrubberWrap.addEventListener('touchmove', (e) => {
        if (isScrubbing && e.touches && e.touches[0]) seekFromEvent(e.touches[0]);
      }, { passive: true });

      heroScrubberWrap.addEventListener('touchend', () => {
        isScrubbing = false;
      });
    }
  }

  /* ── 4b. About Creative Process Video Controls ───────────────── */
  const aboutProcessCard = document.getElementById('aboutProcessCard');
  const aboutProcessVideo = document.getElementById('aboutProcessVideo');
  const aboutPlayToggle = document.getElementById('aboutPlayToggle');
  const aboutPlayIcon = document.getElementById('aboutPlayIcon');
  const aboutPauseIcon = document.getElementById('aboutPauseIcon');
  const aboutSoundToggle = document.getElementById('aboutSoundToggle');
  const aboutSoundOnIcon = document.getElementById('aboutSoundOnIcon');
  const aboutSoundOffIcon = document.getElementById('aboutSoundOffIcon');

  if (aboutProcessVideo) {
    // Autoplay guarantee muted
    aboutProcessVideo.muted = true;
    const playPromise = aboutProcessVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        updateAboutPlayUI(false);
      });
    }

    function updateAboutPlayUI(isPlaying) {
      if (aboutPlayToggle) {
        if (isPlaying) {
          aboutPlayToggle.classList.remove('is-paused');
          if (aboutPlayIcon) aboutPlayIcon.style.display = 'none';
          if (aboutPauseIcon) aboutPauseIcon.style.display = 'block';
          aboutPlayToggle.setAttribute('aria-label', 'Pause process video');
        } else {
          aboutPlayToggle.classList.add('is-paused');
          if (aboutPlayIcon) aboutPlayIcon.style.display = 'block';
          if (aboutPauseIcon) aboutPauseIcon.style.display = 'none';
          aboutPlayToggle.setAttribute('aria-label', 'Play process video');
        }
      }
    }

    function updateAboutSoundUI(isMuted) {
      if (aboutSoundToggle) {
        if (isMuted) {
          if (aboutSoundOnIcon) aboutSoundOnIcon.style.display = 'none';
          if (aboutSoundOffIcon) aboutSoundOffIcon.style.display = 'block';
          aboutSoundToggle.setAttribute('aria-label', 'Unmute process video');
        } else {
          if (aboutSoundOnIcon) aboutSoundOnIcon.style.display = 'block';
          if (aboutSoundOffIcon) aboutSoundOffIcon.style.display = 'none';
          aboutSoundToggle.setAttribute('aria-label', 'Mute process video');
        }
      }
    }

    aboutProcessVideo.addEventListener('play', () => updateAboutPlayUI(true));
    aboutProcessVideo.addEventListener('pause', () => updateAboutPlayUI(false));

    function toggleAboutPlay() {
      if (aboutProcessVideo.paused) {
        aboutProcessVideo.play().catch(() => {});
      } else {
        aboutProcessVideo.pause();
      }
    }

    if (aboutPlayToggle) {
      aboutPlayToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAboutPlay();
      });
    }

    if (aboutSoundToggle) {
      aboutSoundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        aboutProcessVideo.muted = !aboutProcessVideo.muted;
        updateAboutSoundUI(aboutProcessVideo.muted);
      });
    }

    if (aboutProcessCard) {
      // Clicking card toggles play/pause
      aboutProcessCard.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        toggleAboutPlay();
      });

      // Keyboard accessibility (Space or Enter to toggle play)
      aboutProcessCard.addEventListener('keydown', (e) => {
        if (e.target === aboutProcessCard && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          toggleAboutPlay();
        }
      });
    }
  }

  /* ── 4c. Earth Globe Background Video Auto-Play on View ─────── */
  const earthGlobeVideo = document.getElementById('earthGlobeVideo');
  if (earthGlobeVideo) {
    earthGlobeVideo.muted = true;
    const globeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          earthGlobeVideo.play().catch(() => {});
        } else {
          earthGlobeVideo.pause();
        }
      });
    }, {
      threshold: 0.05
    });
    globeObserver.observe(earthGlobeVideo);
  }


  /* ── 5. IntersectionObserver Scroll Reveal ─────────────────── */
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));


  /* ── 5b. Tools Icons Animate In & Out Scroll Observer ───────── */
  const toolsSection = document.getElementById('tools');
  const toolsIconsRow = document.querySelector('.tools-icons-row');
  if (toolsSection && toolsIconsRow) {
    let ambientTimer = null;
    const toolsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate IN: trigger staggered spring entrance
          toolsIconsRow.classList.remove('is-out-view');
          toolsIconsRow.classList.add('is-in-view');
          clearTimeout(ambientTimer);
          ambientTimer = setTimeout(() => {
            if (toolsIconsRow.classList.contains('is-in-view')) {
              toolsIconsRow.classList.add('is-ambient-active');
            }
          }, 850);
        } else {
          // Animate OUT: trigger exit animation
          clearTimeout(ambientTimer);
          toolsIconsRow.classList.remove('is-ambient-active');
          toolsIconsRow.classList.remove('is-in-view');
          toolsIconsRow.classList.add('is-out-view');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    });
    toolsObserver.observe(toolsSection);

    // Audio click feedback & accessible keyboard support on tool badges
    toolsIconsRow.querySelectorAll('.app-icon-badge').forEach((badge) => {
      badge.setAttribute('tabindex', '0');
      badge.setAttribute('role', 'button');
      badge.setAttribute('data-cursor', 'CLICK');
      badge.addEventListener('click', () => {
        if (typeof audioFx !== 'undefined') {
          audioFx.playClick();
        }
      });
      badge.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          badge.click();
        }
      });
    });
  }


  /* ── 6. Eased Stat Counters Animation ──────────────────────── */
  const statDigits = document.querySelectorAll('.stat-digit');

  function animateDigit(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 2000;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Exponential ease-out
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * target);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  const statsSection = document.querySelector('.projects-stats-bar');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statDigits.forEach((digit) => animateDigit(digit));
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  }


  /* ── 7. Interactive Play Simulation for Video Cards ───────── */
  document.querySelectorAll('.about-media-card, .ai-player-mockup, .studio-reel-frame').forEach((card) => {
    card.addEventListener('click', () => {
      const playBtn = card.querySelector('.play-circle-btn, .ai-play-btn-large, .reel-play-button');
      if (playBtn) {
        playBtn.style.transform = 'scale(0.85)';
        setTimeout(() => {
          playBtn.style.transform = 'scale(1.15)';
        }, 150);
      }
    });
  });


  /* ── 8. Smooth Auto-Scroll for Web Prototype Mockup ────────── */
  const prototypeScroll = document.querySelector('.prototype-scroll-frame');
  if (prototypeScroll) {
    let scrollDirection = 1;
    let autoScrollActive = true;

    prototypeScroll.addEventListener('mouseenter', () => { autoScrollActive = false; });
    prototypeScroll.addEventListener('mouseleave', () => { autoScrollActive = true; });

    setInterval(() => {
      if (!autoScrollActive) return;
      const maxScroll = prototypeScroll.scrollHeight - prototypeScroll.clientHeight;
      if (maxScroll <= 0) return;

      if (prototypeScroll.scrollTop >= maxScroll - 5) {
        scrollDirection = -1;
      } else if (prototypeScroll.scrollTop <= 5) {
        scrollDirection = 1;
      }

      prototypeScroll.scrollTop += scrollDirection * 1;
    }, 40);
  }


  /* ── 10. Toast Notification System ──────────────────────── */
  const portfolioToast = document.getElementById('portfolioToast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(msg, duration = 3200) {
    if (!portfolioToast || !toastMessage) return;
    toastMessage.textContent = msg;
    portfolioToast.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      portfolioToast.classList.remove('is-visible');
    }, duration);
  }

  /* ── 10b. Interactive Contact & Booking Drawer ───────────── */
  const contactDrawerOverlay = document.getElementById('contactDrawerOverlay');
  const contactDrawerClose = document.getElementById('contactDrawerClose');
  const chatTrigger = document.getElementById('floatingChatTrigger');
  const dockCtaBtn = document.getElementById('dockCtaBtn');
  const quickCopyEmailBtn = document.getElementById('quickCopyEmailBtn');
  const drawerInquiryForm = document.getElementById('drawerInquiryForm');

  function openContactDrawer(e) {
    if (e) e.preventDefault();
    if (typeof audioFx !== 'undefined') audioFx.playDrawerOpen();
    if (contactDrawerOverlay) {
      if (lenis) lenis.stop();
      contactDrawerOverlay.classList.add('is-active');
      contactDrawerOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const firstInput = document.getElementById('inquiryName');
      if (firstInput) setTimeout(() => firstInput.focus(), 150);
    }
  }

  function closeContactDrawer() {
    if (contactDrawerOverlay) {
      if (lenis) lenis.start();
      contactDrawerOverlay.classList.remove('is-active');
      contactDrawerOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  const topNavBookBtn = document.getElementById('topNavBookBtn');
  const heroStartProjectBtn = document.getElementById('heroStartProjectBtn');

  if (chatTrigger) chatTrigger.addEventListener('click', openContactDrawer);
  if (dockCtaBtn) dockCtaBtn.addEventListener('click', openContactDrawer);
  if (topNavBookBtn) topNavBookBtn.addEventListener('click', openContactDrawer);
  if (heroStartProjectBtn) heroStartProjectBtn.addEventListener('click', openContactDrawer);
  if (contactDrawerClose) contactDrawerClose.addEventListener('click', closeContactDrawer);

  if (contactDrawerOverlay) {
    contactDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === contactDrawerOverlay) closeContactDrawer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactDrawerOverlay && contactDrawerOverlay.classList.contains('is-active')) {
      closeContactDrawer();
    }
  });

  if (quickCopyEmailBtn) {
    quickCopyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const email = 'aldrinabir@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`);
        }).catch(() => {
          showToast(`Email: ${email}`);
        });
      } else {
        showToast(`Email: ${email}`);
      }
    });
  }

  if (drawerInquiryForm) {
    drawerInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inquiryName')?.value || '';
      const contact = document.getElementById('inquiryContact')?.value || '';
      const budget = document.getElementById('inquiryBudget')?.value || '';
      const brief = document.getElementById('inquiryBrief')?.value || '';
      
      const services = Array.from(document.querySelectorAll('input[name="services"]:checked'))
        .map(cb => cb.value)
        .join(', ') || 'Video Editing';

      const subject = encodeURIComponent(`Project Inquiry from ${name} (${services})`);
      const body = encodeURIComponent(
        `Name: ${name}\nContact: ${contact}\nServices: ${services}\nEstimated Budget: ${budget}\n\nProject Brief:\n${brief}`
      );

      showToast('Opening your email client with your project brief...', 4000);
      
      setTimeout(() => {
        window.location.href = `mailto:aldrinabir@gmail.com?subject=${subject}&body=${body}`;
        closeContactDrawer();
        drawerInquiryForm.reset();
      }, 700);
    });
  }


  /* ── 11. 3D Tilt on Location Glass Cards ──────────────────── */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.location-glass-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      });
    });
  }

  /* ── 14. Interactive Services Focus Wheel (Zero Layout Thrashing) ── */
  const focusWheel = document.querySelector('[data-focus-wheel]');
  const focusItems = document.querySelectorAll('[data-focus-item]');

  if (focusWheel && focusItems.length > 0) {
    let isHoveringList = false;

    const focusObserver = new IntersectionObserver((entries) => {
      if (isHoveringList || window.innerWidth <= 768) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          focusItems.forEach(item => item.classList.toggle('is-focused', item === entry.target));
        }
      });
    }, {
      rootMargin: '-35% 0px -35% 0px',
      threshold: 0.1
    });

    focusItems.forEach(item => focusObserver.observe(item));

    // Hover overrides scroll center
    focusWheel.addEventListener('mouseenter', () => {
      isHoveringList = true;
    });

    focusWheel.addEventListener('mouseleave', () => {
      isHoveringList = false;
    });

    focusItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        focusItems.forEach(other => other.classList.remove('is-focused'));
        item.classList.add('is-focused');
      });
    });
  }


  /* ── 15. Service Detail Slide-Over Drawer Modal ────────────── */
  const serviceData = {
    production: {
      eyebrow: 'CINEMATOGRAPHY & LIGHTING',
      title: 'Commercial & Social Video Production',
      summary: 'From concept and shot-listing to final on-set filming, we capture cinematic 4K footage engineered to make your brand look world-class across platforms.',
      checklist: [
        '4K multi-angle cinematography & camera direction',
        'Studio lighting, wireless lavalier & boom sound recording',
        'Storyboarding, concept direction & talent framing',
        'High-resolution B-roll packages & product hero closeups',
        'Platform-compliant filming for both 16:9 and 9:16 vertical'
      ],
      outcome: 'Pristine, broadcast-grade footage captured right the first time, giving you a comprehensive asset library ready for high-retention post-production.',
      checkboxValue: 'Video Production'
    },
    editing: {
      eyebrow: 'POST-PRODUCTION & STORYTELLING',
      title: 'Retention-Driven Creative Video Editing',
      summary: 'We transform raw footage into viral-ready short-form reels, high-converting social ads, and compelling long-form YouTube episodes optimized for algorithmic watch time.',
      checklist: [
        'Dynamic pacing, narrative rhythm & hook-first structuring',
        'Custom Foley sound design, risers, whooshes & music mixing',
        'Kinetic typography, animated subtitles & motion graphics',
        'Cinematic color grading & contrast curve balancing',
        'Platform-optimized exports in 9:16, 16:9, and 1:1 ratios'
      ],
      outcome: 'Content that stops the scroll within 3 seconds, sustains audience watch-time, and drives viewers to take immediate action.',
      checkboxValue: 'Video Editing'
    },
    content: {
      eyebrow: 'VISUAL DESIGN & CONVERSION',
      title: 'Static Social Creatives & High-CTR Ads',
      summary: 'Eye-catching static visual assets designed specifically for Instagram feeds, LinkedIn thought leadership, and Meta paid advertising campaigns.',
      checklist: [
        'Multi-slide educational and narrative Instagram carousels',
        'High-CTR Meta ad banners & promotional graphics',
        'YouTube thumbnails engineered for maximum click-through rates',
        'Brand-consistent typography, color hierarchy & spatial layouts',
        'Ready-to-post export packs formatted with captions & tags'
      ],
      outcome: 'A continuous feed of visual creatives that builds authority, drives organic engagement, and lowers your cost per click.',
      checkboxValue: 'Static Content Design'
    },
    branding: {
      eyebrow: 'BRAND IDENTITY & SYSTEMS',
      title: 'Brand Identity Systems & Visual Guidelines',
      summary: 'We build memorable brand identities from scratch or overhaul outdated visual languages to ensure consistency across every physical and digital touchpoint.',
      checklist: [
        'Primary, secondary, and responsive favicon logo suites',
        'Color palette systems with high-contrast accessibility curves',
        'Typography pairing rules and spatial hierarchy scales',
        'Social media avatars, banners, and digital asset templates',
        'Comprehensive Brand Book that your team can actually execute'
      ],
      outcome: 'A distinct, unmistakable identity that your market instantly recognizes before reading your name.',
      checkboxValue: 'Brand Identity'
    },
    ai: {
      eyebrow: 'GENERATIVE PIPELINES & AI ASSETS',
      title: 'AI Content Design & Neural Workflows',
      summary: 'Leveraging cutting-edge Midjourney, FLUX, and neural super-resolution pipelines to generate photorealistic backgrounds, futuristic mockups, and rapid concept prototypes.',
      checklist: [
        'Custom prompt engineering & bespoke concept rendering',
        'High-fidelity 3D and surreal product mockup generation',
        'Neural upscaling to pristine 4K print and web resolution',
        'Rapid campaign prototyping delivered in hours instead of weeks',
        'AI asset retouching, compositing & color integration'
      ],
      outcome: 'Boundary-pushing visual concepts that differentiate your campaigns from generic stock photography at a fraction of standard production timelines.',
      checkboxValue: 'AI Content Design'
    },
    printables: {
      eyebrow: 'PACKAGING & MERCHANDISE',
      title: 'Printables, Apparel & Packaging Design',
      summary: 'Vector-exact print production with precision bleeds, spot colors, and vector scalability for luxury packaging, apparel drops, and event stationery.',
      checklist: [
        'Apparel graphics, typography tees & merchandise mockups',
        'Business collateral, luxury menu cards & editorial brochures',
        'Product packaging boxes, die-cut labels & unboxing inserts',
        'Pre-press verified CMYK vector files ready for commercial printing',
        'Material finish consultations (emboss, foil stamp, matte/gloss)'
      ],
      outcome: 'Tactile, premium brand materials that look just as immaculate in your hands as they do on digital screens.',
      checkboxValue: 'Printables & Merch'
    }
  };

  const serviceDrawerOverlay = document.getElementById('serviceDrawerOverlay');
  const serviceDrawerClose = document.getElementById('serviceDrawerClose');
  const serviceDrawerEyebrow = document.getElementById('serviceDrawerEyebrow');
  const serviceDrawerTitle = document.getElementById('serviceDrawerTitle');
  const serviceDrawerSummary = document.getElementById('serviceDrawerSummary');
  const serviceDrawerChecklist = document.getElementById('serviceDrawerChecklist');
  const serviceDrawerOutcome = document.getElementById('serviceDrawerOutcome');
  const serviceDrawerCtaBtn = document.getElementById('serviceDrawerCtaBtn');
  const serviceDrawerCtaLabel = document.getElementById('serviceDrawerCtaLabel');

  let currentActiveServiceId = null;

  function openServiceDrawer(serviceId) {
    const data = serviceData[serviceId];
    if (!data || !serviceDrawerOverlay) return;
    if (typeof audioFx !== 'undefined') audioFx.playDrawerOpen();

    currentActiveServiceId = serviceId;
    if (serviceDrawerEyebrow) serviceDrawerEyebrow.textContent = data.eyebrow;
    if (serviceDrawerTitle) serviceDrawerTitle.textContent = data.title;
    if (serviceDrawerSummary) serviceDrawerSummary.textContent = data.summary;
    if (serviceDrawerOutcome) serviceDrawerOutcome.textContent = data.outcome;
    if (serviceDrawerCtaLabel) serviceDrawerCtaLabel.textContent = `Start a Project with ${data.checkboxValue}`;

    if (serviceDrawerChecklist) {
      serviceDrawerChecklist.innerHTML = '';
      data.checklist.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="drawer-bullet-dot"></span><span>${item}</span>`;
        serviceDrawerChecklist.appendChild(li);
      });
    }

    if (lenis) lenis.stop();
    serviceDrawerOverlay.classList.add('is-active');
    serviceDrawerOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeServiceDrawer() {
    if (!serviceDrawerOverlay) return;
    if (lenis) lenis.start();
    serviceDrawerOverlay.classList.remove('is-active');
    serviceDrawerOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    currentActiveServiceId = null;
  }

  // Bind clicks on service cards
  document.querySelectorAll('.service-focus-item').forEach(item => {
    const btn = item.querySelector('.service-card');
    const serviceId = item.getAttribute('data-service-id');
    if (btn && serviceId) {
      btn.addEventListener('click', () => {
        openServiceDrawer(serviceId);
      });
    }
  });

  if (serviceDrawerClose) {
    serviceDrawerClose.addEventListener('click', closeServiceDrawer);
  }

  if (serviceDrawerOverlay) {
    serviceDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === serviceDrawerOverlay) {
        closeServiceDrawer();
      }
    });
  }

  // Escape key to dismiss drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceDrawerOverlay?.classList.contains('is-active')) {
      closeServiceDrawer();
    }
  });

  // CTA inside service drawer -> opens Contact Drawer with this service checked!
  if (serviceDrawerCtaBtn) {
    serviceDrawerCtaBtn.addEventListener('click', () => {
      const activeData = currentActiveServiceId ? serviceData[currentActiveServiceId] : null;
      closeServiceDrawer();

      // Check corresponding checkbox in the inquiry drawer
      if (activeData) {
        document.querySelectorAll('input[name="services"]').forEach(cb => {
          cb.checked = (cb.value === activeData.checkboxValue);
        });
      }

      // Open contact inquiry drawer
      openContactDrawer();
    });
  }


  /* ── 16. Scroll-Expanding Cinematic Showreel (Design Monks Style) ── */
  const reelVideo = document.getElementById('studioShowreelVideo');
  const reelCenterPlayBtn = document.getElementById('reelCenterPlayBtn');
  const reelPlaySvg = document.getElementById('reelPlaySvg');
  const reelPauseSvg = document.getElementById('reelPauseSvg');
  const reelSoundToggleBtn = document.getElementById('reelSoundToggleBtn');
  const reelSoundOnSvg = document.getElementById('reelSoundOnSvg');
  const reelSoundOffSvg = document.getElementById('reelSoundOffSvg');
  const reelSoundLabel = document.getElementById('reelSoundLabel');
  const reelAudioBars = document.getElementById('reelAudioBars');

  // Play/Pause Controller for Reel
  if (reelVideo && reelCenterPlayBtn) {
    function toggleReelPlay() {
      if (reelVideo.paused) {
        reelVideo.play().then(() => {
          if (reelPlaySvg) reelPlaySvg.style.display = 'none';
          if (reelPauseSvg) reelPauseSvg.style.display = 'block';
        }).catch(() => {});
      } else {
        reelVideo.pause();
        if (reelPlaySvg) reelPlaySvg.style.display = 'block';
        if (reelPauseSvg) reelPauseSvg.style.display = 'none';
      }
    }

    reelCenterPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleReelPlay();
    });

    reelExpandingContainer?.addEventListener('click', (e) => {
      if (!e.target.closest('#reelSoundToggleBtn') && !e.target.closest('#reelCenterPlayBtn')) {
        toggleReelPlay();
      }
    });

    reelVideo.addEventListener('play', () => {
      reelExpandingContainer?.classList.add('is-playing');
      if (reelPlaySvg) reelPlaySvg.style.display = 'none';
      if (reelPauseSvg) reelPauseSvg.style.display = 'block';
    });

    reelVideo.addEventListener('pause', () => {
      reelExpandingContainer?.classList.remove('is-playing');
      if (reelPlaySvg) reelPlaySvg.style.display = 'block';
      if (reelPauseSvg) reelPauseSvg.style.display = 'none';
    });

    if (!reelVideo.paused) {
      reelExpandingContainer?.classList.add('is-playing');
    }
  }

  // Sound Toggle Controller
  if (reelVideo && reelSoundToggleBtn) {
    reelSoundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      reelVideo.muted = !reelVideo.muted;
      if (reelVideo.muted) {
        if (reelSoundOnSvg) reelSoundOnSvg.style.display = 'none';
        if (reelSoundOffSvg) reelSoundOffSvg.style.display = 'block';
        if (reelSoundLabel) reelSoundLabel.textContent = 'UNMUTE SOUND';
        if (reelAudioBars) reelAudioBars.classList.remove('is-playing');
        showToast('Showreel audio muted');
      } else {
        if (reelSoundOnSvg) reelSoundOnSvg.style.display = 'block';
        if (reelSoundOffSvg) reelSoundOffSvg.style.display = 'none';
        if (reelSoundLabel) reelSoundLabel.textContent = 'MUTE SOUND';
        if (reelAudioBars) reelAudioBars.classList.add('is-playing');
        showToast('Showreel audio enabled 🔊');
      }
    });
  }


  /* ── 17. Bento Grid Interactive Plans & Scope Switcher ─────── */
  const planPills = document.querySelectorAll('.plan-pill');
  planPills.forEach(pill => {
    pill.addEventListener('click', () => {
      planPills.forEach(p => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-selected', 'true');
      
      const plan = pill.getAttribute('data-plan');
      if (plan === 'project') {
        showToast('Selected: Per Project Milestone Scope');
      } else if (plan === 'monthly') {
        showToast('Selected: Monthly Dedicated Retainer');
      } else if (plan === 'sprint') {
        showToast('Selected: 2-Week High-Impact Creative Sprint');
      }
    });
  });

  /* ── 18. BizChemists 3D Coverflow Carousel (1:1 Real-Time Glide) ── */
  function initProjectsCoverflow() {
    const stage = document.getElementById('workStage');
    if (!stage) return;

    const slides = Array.from(stage.querySelectorAll('.work-slide'));
    if (!slides.length) return;

    const prevBtn = document.getElementById('coverflowPrevBtn');
    const nextBtn = document.getElementById('coverflowNextBtn');
    const counterEl = document.getElementById('projectCounter');
    const counterCurr = counterEl ? counterEl.querySelector('.counter-curr') : null;
    const counterTotal = counterEl ? counterEl.querySelector('.counter-total') : null;

    const _r = slides.length; // 6
    let activeIndex = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartTime = 0;
    let currentDragOffset = 0;

    if (counterTotal) {
      counterTotal.textContent = String(_r).padStart(2, '0');
    }

    const gk = (idx, curr) => ((idx - curr) % _r + _r + Math.floor(_r / 2)) % _r - Math.floor(_r / 2);

    function renderSlidePositions(dragFraction = 0, isDirect = false) {
      slides.forEach((slide, idx) => {
        const baseC = gk(idx, activeIndex);
        const c = baseC + dragFraction;
        const f = Math.abs(c);
        const isCentre = Math.abs(c) < 0.35;

        if (isDirect) {
          slide.style.transition = 'none';
        } else {
          slide.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
        }

        if (f > 2.5) {
          slide.style.transform = `translateX(calc(-50% + ${c * 58}%)) rotateY(${c * -26}deg) scale(0.6)`;
          slide.style.opacity = '0';
          slide.style.zIndex = '0';
          slide.style.pointerEvents = 'none';
          slide.classList.remove('is-centre');
          slide.removeAttribute('aria-current');
          slide.setAttribute('tabindex', '-1');
          slide.setAttribute('aria-hidden', 'true');
          const vid = slide.querySelector('video');
          if (vid && !vid.paused) vid.pause();
          return;
        }

        slide.style.transform = `translateX(calc(-50% + ${c * 58}%)) rotateY(${c * -26}deg) scale(${Math.max(0.65, 1 - f * 0.13)})`;
        slide.style.opacity = String(Math.max(0, 1 - f * 0.42));
        slide.style.zIndex = String(Math.round(10 - f));
        slide.style.pointerEvents = f > 1.2 ? 'none' : 'auto';
        slide.setAttribute('tabindex', isCentre ? '0' : '-1');
        slide.setAttribute('aria-hidden', String(!isCentre));

        const vid = slide.querySelector('video');
        if (isCentre) {
          slide.classList.add('is-centre');
          slide.setAttribute('aria-current', 'true');
          if (vid && !isDirect && vid.paused) {
            vid.play().catch(() => {});
          }
        } else {
          slide.classList.remove('is-centre');
          slide.classList.remove('is-unmuted');
          slide.removeAttribute('aria-current');
          if (vid) {
            vid.muted = true;
            if (!vid.paused) vid.pause();
          }
          const badgeText = slide.querySelector('.work-sound-label');
          if (badgeText) badgeText.textContent = 'TAP FOR SOUND';
        }
      });

      if (counterCurr) {
        counterCurr.textContent = String(activeIndex + 1).padStart(2, '0');
      }
    }

    const step = (direction) => {
      activeIndex = (activeIndex + direction + _r) % _r;
      renderSlidePositions(0, false);
    };

    if (nextBtn) nextBtn.addEventListener('click', () => step(1));
    if (prevBtn) prevBtn.addEventListener('click', () => step(-1));

    slides.forEach((slide, idx) => {
      slide.addEventListener('click', (e) => {
        if (Math.abs(currentDragOffset) > 10) {
          e.preventDefault();
          return;
        }
        const c = gk(idx, activeIndex);
        if (c !== 0) {
          e.preventDefault();
          step(c > 0 ? 1 : -1);
        } else {
          e.preventDefault();
          const studyLink = e.target.closest('.work-details-link');
          if (studyLink) {
            openProjectDrawer(idx);
            return;
          }

          // Tap for Sound on center video
          const vid = slide.querySelector('video');
          if (vid) {
            if (typeof audioFx !== 'undefined') audioFx.playClick();
            vid.muted = !vid.muted;
            const badgeText = slide.querySelector('.work-sound-label');
            if (!vid.muted) {
              slide.classList.add('is-unmuted');
              if (badgeText) badgeText.textContent = 'SOUND ON';
              if (vid.paused) vid.play().catch(() => {});
            } else {
              slide.classList.remove('is-unmuted');
              if (badgeText) badgeText.textContent = 'TAP FOR SOUND';
            }
          }
        }
      });
    });

    // Real-Time 1:1 Pointer Tracking Physics
    const handlePointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartTime = performance.now();
      currentDragOffset = 0;
      stage.classList.add('is-dragging');
      renderSlidePositions(0, true);
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      currentDragOffset = deltaX;
      const stageWidth = stage.offsetWidth || 800;
      const dragFraction = (deltaX / (stageWidth * 0.48));
      renderSlidePositions(dragFraction, true);
    };

    const handlePointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove('is-dragging');

      const deltaX = e.clientX - dragStartX;
      const deltaTime = performance.now() - dragStartTime;
      const velocity = Math.abs(deltaX) / Math.max(1, deltaTime);

      if (Math.abs(deltaX) > 45 || velocity > 0.3) {
        step(deltaX < 0 ? 1 : -1);
      } else {
        step(0);
      }
      setTimeout(() => { currentDragOffset = 0; }, 50);
    };

    stage.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    // Keyboard accessibility
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        step(-1);
      }
    });

    // Category Filter Pills Integration
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        if (filter === 'all') {
          showToast('Showing all 9 production reels');
          return;
        }

        // Find first slide matching category
        const targetIdx = slides.findIndex(s => {
          const cat = s.getAttribute('data-category') || '';
          return cat.includes(filter);
        });

        if (targetIdx !== -1) {
          activeIndex = targetIdx;
          renderSlidePositions(0, false);
          showToast(`Filtered: ${btn.querySelector('span')?.textContent || filter}`);
        }
      });
    });

    // Initial render
    renderSlidePositions(0, false);
  }

  initProjectsCoverflow();

  /* ── 18b. Slide 5 AI Video Player Controller ───────────────── */
  const aiFeaturedVideo = document.getElementById('aiFeaturedVideo');
  const aiPlayerMockup = document.getElementById('aiPlayerMockup');
  const aiPlayToggleBtn = document.getElementById('aiPlayToggleBtn');
  const aiSoundToggleBtn = document.getElementById('aiSoundToggleBtn');
  const aiSoundBtnText = document.getElementById('aiSoundBtnText');
  const aiTimelineFill = document.getElementById('aiTimelineFill');
  const aiTimeText = document.getElementById('aiTimeText');

  if (aiFeaturedVideo) {
    const aiIconPlay = aiPlayToggleBtn ? aiPlayToggleBtn.querySelector('.ai-icon-play') : null;
    const aiIconPause = aiPlayToggleBtn ? aiPlayToggleBtn.querySelector('.ai-icon-pause') : null;

    function toggleAiVideoPlay(e) {
      if (e) e.stopPropagation();
      if (aiFeaturedVideo.paused) {
        aiFeaturedVideo.play().then(() => {
          aiPlayerMockup?.classList.remove('is-paused');
          if (aiIconPlay) aiIconPlay.style.display = 'none';
          if (aiIconPause) aiIconPause.style.display = 'block';
        }).catch(() => {});
      } else {
        aiFeaturedVideo.pause();
        aiPlayerMockup?.classList.add('is-paused');
        if (aiIconPlay) aiIconPlay.style.display = 'block';
        if (aiIconPause) aiIconPause.style.display = 'none';
      }
    }

    aiPlayToggleBtn?.addEventListener('click', toggleAiVideoPlay);
    aiPlayerMockup?.addEventListener('click', (e) => {
      if (e.target.closest('#aiSoundToggleBtn') || e.target.closest('#aiPlayToggleBtn')) return;
      toggleAiVideoPlay();
    });

    aiSoundToggleBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      aiFeaturedVideo.muted = !aiFeaturedVideo.muted;
      if (aiSoundBtnText) {
        aiSoundBtnText.textContent = aiFeaturedVideo.muted ? '🔇 UNMUTE AI REEL' : '🔊 SOUND ON';
      }
      if (aiFeaturedVideo.paused && !aiFeaturedVideo.muted) {
        aiFeaturedVideo.play().catch(() => {});
      }
    });

    aiFeaturedVideo.addEventListener('timeupdate', () => {
      const cur = aiFeaturedVideo.currentTime || 0;
      const dur = aiFeaturedVideo.duration || 53.7;
      if (aiTimelineFill && dur > 0) {
        aiTimelineFill.style.width = `${(cur / dur) * 100}%`;
      }
      if (aiTimeText) {
        const formatSec = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
        aiTimeText.textContent = `${formatSec(cur)} / ${formatSec(dur)}`;
      }
    });
  }

  /* ── 19. Project Case Study Slide-Over Drawer with Cinema Player (9 Canva Reels) ── */
  const projectCaseStudies = [
    {
      idx: 0,
      title: "Creator Studio Reel",
      category: "Talking-Head & Visual Hooks",
      eyebrow: "CENTER FEATURED CANVA REEL",
      tagline: "High-retention creator studio talking-head edit featuring dynamic kinetic captions, zoom cuts, and spatial sound design.",
      image: "assets/proj_1_creator_poster.jpg",
      video: "assets/proj_1_creator.mp4",
      sensor: "Sony FX3 · 4K 10-bit 4:2:2 · S-Cinetone",
      palette: [
        { hex: '#090D16', name: 'Studio Shadow' },
        { hex: '#1E293B', name: 'Slate Keylight' },
        { hex: '#00F2FE', name: 'Hook Cyan' },
        { hex: '#F59E0B', name: 'Warm Practical' },
        { hex: '#FFFFFF', name: 'Caption White' }
      ],
      metrics: [
        { val: "25s", lbl: "Tightly Paced Cut" },
        { val: "88%", lbl: "3-Sec Hook Retention" },
        { val: "1080x1920", lbl: "Vertical Master" }
      ],
      description: "Featured at the center of the portfolio showcase, this creator talking-head reel demonstrates how intentional pacing, micro-zoom punch-ins, and bold kinetic captions transform a studio recording into a scroll-stopping social asset.",
      tags: ["Premiere Pro", "After Effects", "Kinetic Captions", "Sound Design & Risers", "Studio Color Grade"]
    },
    {
      idx: 1,
      title: "Artisan Iced Latte",
      category: "Commercial Product Shoot",
      eyebrow: "BEVERAGE CINEMATOGRAPHY & EDIT",
      tagline: "Sensory commercial beverage shoot pairing slow-motion espresso pours, fresh citrus garnishes, and rhythmic sound foley.",
      image: "assets/proj_2_coffee_poster.jpg",
      video: "assets/proj_2_coffee.mp4",
      sensor: "Sony A7S III · 4K 120fps High Frame Rate",
      palette: [
        { hex: '#1C110A', name: 'Roasted Espresso' },
        { hex: '#78350F', name: 'Amber Crema' },
        { hex: '#F97316', name: 'Citrus Zest' },
        { hex: '#FDE68A', name: 'Cold Foam' },
        { hex: '#FFFBEB', name: 'Ice Highlight' }
      ],
      metrics: [
        { val: "51s", lbl: "Full Commercial Cut" },
        { val: "120fps", lbl: "Slow-Motion Pour" },
        { val: "100%", lbl: "Tactile Foley Mix" }
      ],
      description: "Filmed on location with macro lens optics and high-speed frame rates, this specialty coffee commercial captures every ice clink, citrus slice, and espresso swirl with rich warm color grading and appetite-inducing sound design.",
      tags: ["Commercial Shoot", "120fps Speed Ramps", "Foley Audio Stems", "DaVinci Resolve Grade", "Hospitality Reel"]
    },
    {
      idx: 2,
      title: "Raw vs. After Edit",
      category: "Before & After Post-Production",
      eyebrow: "RAW FOOTAGE TO FINAL MASTER",
      tagline: "Side-by-side transformation proving how raw camera footage becomes an authoritative, high-engagement educational reel.",
      image: "assets/proj_3_raw_edit_poster.jpg",
      video: "assets/proj_3_raw_edit.mp4",
      sensor: "Sony FX30 · S-Log3 to Rec.709 Master LUT",
      palette: [
        { hex: '#0F172A', name: 'Deep Navy' },
        { hex: '#0284C7', name: 'Academic Blue' },
        { hex: '#EAB308', name: 'Highlight Gold' },
        { hex: '#22C55E', name: 'After Badge' },
        { hex: '#F8FAFC', name: 'Clean Studio' }
      ],
      metrics: [
        { val: "27s", lbl: "Before/After Showcase" },
        { val: "+310%", lbl: "Watch Time Lift" },
        { val: "4K", lbl: "Color & Audio Polish" }
      ],
      description: "Raw camera footage is only the starting point. This breakdown compares ungraded, static talking-head footage directly against the final edited master — complete with background cleanup, color correction, animated callouts, and vocal EQ.",
      tags: ["Before & After", "Vocal EQ & Mastering", "Motion Callouts", "Color Transformation", "Retention Editing"]
    },
    {
      idx: 3,
      title: "KMF Global Education",
      category: "Brand Campaign & Motion",
      eyebrow: "INTERNATIONAL EDUCATION CAMPAIGN",
      tagline: "High-conversion promotional reel engineered for KMF Global Education Ltd. to drive student consultations and visa inquiries.",
      image: "assets/proj_4_kmf_poster.jpg",
      video: "assets/proj_4_kmf.mp4",
      sensor: "Cinema 4K · Brand Motion Graphics Pipeline",
      palette: [
        { hex: '#081226', name: 'KMF Oxford Blue' },
        { hex: '#1D4ED8', name: 'Global Royal' },
        { hex: '#DC2626', name: 'Action Crimson' },
        { hex: '#38BDF8', name: 'Sky Accent' },
        { hex: '#FFFFFF', name: 'Crisp White' }
      ],
      metrics: [
        { val: "35s", lbl: "Promotional Reel" },
        { val: "High CTR", lbl: "Paid Ad Creative" },
        { val: "9:16", lbl: "Meta & TikTok Ready" }
      ],
      description: "Created for KMF Global Education Ltd., this promotional video combines presenter delivery with branded motion graphics, country pathway callouts, and clear calls-to-action tailored for prospective international students.",
      tags: ["KMF Global Education", "Paid Ad Creative", "Brand Motion Graphics", "Lower Thirds", "Conversion CTA"]
    },
    {
      idx: 4,
      title: "Sartorial Menswear",
      category: "Fashion Commercial & Grade",
      eyebrow: "MENSWEAR EDITORIAL PRODUCTION",
      tagline: "Cinematic menswear commercial walk blending tailored suiting, natural urban daylight, and filmic color grading.",
      image: "assets/proj_5_suit_poster.jpg",
      video: "assets/proj_5_suit.mp4",
      sensor: "Sony FX3 · 35mm Prime Gimbal Tracking",
      palette: [
        { hex: '#141413', name: 'Espresso Wool' },
        { hex: '#44403C', name: 'Warm Charcoal' },
        { hex: '#A8A29E', name: 'Stone Pavement' },
        { hex: '#D6D3D1', name: 'Linen Shirt' },
        { hex: '#F5F5F4', name: 'Daylight Key' }
      ],
      metrics: [
        { val: "15s", lbl: "Fashion Spot" },
        { val: "60fps", lbl: "Gimbal Tracking" },
        { val: "235:1", lbl: "Film Emulation Grade" }
      ],
      description: "A sleek fashion lookbook reel capturing movement, fabric drape, and confidence. Smooth gimbal tracking and seamless speed-ramped transitions highlight the bespoke tailoring.",
      tags: ["Fashion Cinematography", "Gimbal Direction", "Film Print Emulation", "Speed Ramping", "Luxury Lookbook"]
    },
    {
      idx: 5,
      title: "AI Search Interface",
      category: "UI Motion & Kinetic Design",
      eyebrow: "SAAS & UI MOTION GRAPHICS",
      tagline: "Sleek dark-mode UI animation showcasing conversational AI prompts, glassmorphic cards, and fluid cursor choreography.",
      image: "assets/proj_6_ai_ui_poster.jpg",
      video: "assets/proj_6_ai_ui.mp4",
      sensor: "After Effects 60fps Vector Raster Engine",
      palette: [
        { hex: '#050507', name: 'OLED Pitch' },
        { hex: '#18181B', name: 'Surface Glass' },
        { hex: '#00F2FE', name: 'Prompt Cyan' },
        { hex: '#A855F7', name: 'Neural Violet' },
        { hex: '#FAFAFA', name: 'UI Typography' }
      ],
      metrics: [
        { val: "15s", lbl: "UI Motion Loop" },
        { val: "60fps", lbl: "Vector Smoothness" },
        { val: "100%", lbl: "Custom After Effects" }
      ],
      description: "Designed for digital product launches and brand identity showcases, this UI motion reel brings software interfaces to life using custom cubic-bezier motion curves, tactile typing sound effects, and depth-of-field camera pans.",
      tags: ["After Effects", "UI/UX Animation", "60fps Motion", "Tactile UI SFX", "Product Teaser"]
    },
    {
      idx: 6,
      title: "Time & Value Motion",
      category: "Kinetic Typography & VFX",
      eyebrow: "3D MOTION GRAPHICS & COMPOSITING",
      tagline: "Visual metaphor reel using 3D clocks, hourglasses, and kinetic typography to illustrate time investment and audience attention.",
      image: "assets/proj_7_spend_on_poster.jpg",
      video: "assets/proj_7_spend_on.mp4",
      sensor: "After Effects 3D Camera & Compositing Suite",
      palette: [
        { hex: '#07090E', name: 'Void Black' },
        { hex: '#1E293B', name: 'Clockwork Slate' },
        { hex: '#38BDF8', name: 'Chrono Cyan' },
        { hex: '#FACC15', name: 'Sand Gold' },
        { hex: '#FFFFFF', name: 'Kinetic Type' }
      ],
      metrics: [
        { val: "33s", lbl: "Motion Essay" },
        { val: "3D", lbl: "Camera Space Rig" },
        { val: "92%", lbl: "Average Watch Time" }
      ],
      description: "When abstract concepts need visual impact, custom motion graphics bridge the gap. This piece layers 3D depth, animated timepieces, and synchronized kinetic typography to keep viewers locked in from frame one.",
      tags: ["3D Camera Tracker", "Kinetic Typography", "Visual Metaphors", "Sound Riser Stems", "After Effects"]
    },
    {
      idx: 7,
      title: "Clinical Aesthetics",
      category: "Educational Talking-Head",
      eyebrow: "HEALTHCARE & EXPERT AUTHORITY",
      tagline: "Clean, authoritative medical talking-head production featuring picture-in-picture visual callouts and clarity-first captions.",
      image: "assets/proj_8_doctor_poster.jpg",
      video: "assets/proj_8_doctor.mp4",
      sensor: "Sony FX3 · Dual-Lav Broadcast Audio Chain",
      palette: [
        { hex: '#0B131E', name: 'Clinical Slate' },
        { hex: '#0EA5E9', name: 'Medical Cyan' },
        { hex: '#E2E8F0', name: 'Lab Coat White' },
        { hex: '#F43F5E', name: 'Callout Accent' },
        { hex: '#FFFFFF', name: 'Pure Key' }
      ],
      metrics: [
        { val: "44s", lbl: "Expert Breakdown" },
        { val: "Crystal", lbl: "De-Essed Voice Master" },
        { val: "PiP", lbl: "Visual Evidence Overlays" }
      ],
      description: "Healthcare and specialist creators rely on trust and clarity. We paired flattering clinical lighting and pristine vocal mastering with dynamic picture-in-picture visual callouts that illustrate medical points in real time.",
      tags: ["Healthcare Content", "Visual Callout Boxes", "Broadcast Vocal Chain", "Clean Typography", "Expert Positioning"]
    },
    {
      idx: 8,
      title: "Creator Narrative",
      category: "Storytelling & Sound Design",
      eyebrow: "LONG-FORM RETENTION REEL",
      tagline: "74-second narrative creator reel demonstrating sustained storytelling pacing, B-roll cutaways, and emotional music swells.",
      image: "assets/proj_9_is_the_day_poster.jpg",
      video: "assets/proj_9_is_the_day.mp4",
      sensor: "Sony FX3 · 24fps Narrative Cadence",
      palette: [
        { hex: '#090A0F', name: 'Cinema Black' },
        { hex: '#1F2937', name: 'Moody Midtone' },
        { hex: '#60A5FA', name: 'Rim Light Blue' },
        { hex: '#FBBF24', name: 'Tungsten Practical' },
        { hex: '#F9FAFB', name: 'Soft Highlight' }
      ],
      metrics: [
        { val: "74s", lbl: "Narrative Arc" },
        { val: "Multi-Layer", lbl: "Music & SFX Stems" },
        { val: "4K", lbl: "Cinema Grade" }
      ],
      description: "Holding viewer attention across a 74-second vertical video requires deliberate narrative rhythm. We structured the edit around curiosity loops, expressive typography, and dynamic audio ducking.",
      tags: ["Narrative Storytelling", "Curiosity Loops", "Audio Ducking", "Dynamic Captions", "Creator Growth"]
    }
  ];

  const projectDrawerOverlay = document.getElementById('projectDrawerOverlay');
  const projectDrawerClose = document.getElementById('projectDrawerClose');
  const projectDrawerImage = document.getElementById('projectDrawerImage');
  const projectDrawerVideo = document.getElementById('projectDrawerVideo');
  const drawerPlayBtn = document.getElementById('drawerPlayBtn');
  const drawerPlayIcon = drawerPlayBtn ? drawerPlayBtn.querySelector('.play-icon') : null;
  const drawerPauseIcon = drawerPlayBtn ? drawerPlayBtn.querySelector('.pause-icon') : null;
  const drawerScrubberTrack = document.getElementById('drawerScrubberTrack');
  const drawerScrubberFill = document.getElementById('drawerScrubberFill');
  const drawerTimecode = document.getElementById('drawerTimecode');
  const drawerSoundBtn = document.getElementById('drawerSoundBtn');
  const drawerSoundOffIcon = drawerSoundBtn ? drawerSoundBtn.querySelector('.sound-off-icon') : null;
  const drawerSoundOnIcon = drawerSoundBtn ? drawerSoundBtn.querySelector('.sound-on-icon') : null;
  const gradeSensorBadge = document.getElementById('gradeSensorBadge');
  const gradePaletteChips = document.getElementById('gradePaletteChips');

  const projectDrawerCategory = document.getElementById('projectDrawerCategory');
  const projectDrawerEyebrow = document.getElementById('projectDrawerEyebrow');
  const projectDrawerTitle = document.getElementById('projectDrawerTitle');
  const projectDrawerTagline = document.getElementById('projectDrawerTagline');
  const projectDrawerMetrics = document.getElementById('projectDrawerMetrics');
  const projectDrawerDescription = document.getElementById('projectDrawerDescription');
  const projectDrawerTags = document.getElementById('projectDrawerTags');
  const projectDrawerInquireBtn = document.getElementById('projectDrawerInquireBtn');

  let currentProjectStudy = null;

  function formatTimecode(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateDrawerVideoUi() {
    if (!projectDrawerVideo) return;
    const cur = projectDrawerVideo.currentTime || 0;
    const dur = projectDrawerVideo.duration || 0;
    if (drawerScrubberFill && dur > 0) {
      drawerScrubberFill.style.width = `${(cur / dur) * 100}%`;
    }
    if (drawerTimecode) {
      drawerTimecode.textContent = `${formatTimecode(cur)} / ${formatTimecode(dur)}`;
    }
  }

  function toggleDrawerVideoPlay() {
    if (!projectDrawerVideo) return;
    if (typeof audioFx !== 'undefined') audioFx.playClick();
    if (projectDrawerVideo.paused) {
      projectDrawerVideo.play().then(() => {
        if (drawerPlayIcon) drawerPlayIcon.style.display = 'none';
        if (drawerPauseIcon) drawerPauseIcon.style.display = 'block';
      }).catch(() => {});
    } else {
      projectDrawerVideo.pause();
      if (drawerPlayIcon) drawerPlayIcon.style.display = 'block';
      if (drawerPauseIcon) drawerPauseIcon.style.display = 'none';
    }
  }

  function toggleDrawerVideoSound() {
    if (!projectDrawerVideo) return;
    if (typeof audioFx !== 'undefined') audioFx.playClick();
    projectDrawerVideo.muted = !projectDrawerVideo.muted;
    if (projectDrawerVideo.muted) {
      if (drawerSoundOffIcon) drawerSoundOffIcon.style.display = 'block';
      if (drawerSoundOnIcon) drawerSoundOnIcon.style.display = 'none';
    } else {
      if (drawerSoundOffIcon) drawerSoundOffIcon.style.display = 'none';
      if (drawerSoundOnIcon) drawerSoundOnIcon.style.display = 'block';
    }
  }

  if (drawerPlayBtn) drawerPlayBtn.addEventListener('click', toggleDrawerVideoPlay);
  if (drawerSoundBtn) drawerSoundBtn.addEventListener('click', toggleDrawerVideoSound);

  if (projectDrawerVideo) {
    projectDrawerVideo.addEventListener('timeupdate', updateDrawerVideoUi);
    projectDrawerVideo.addEventListener('loadedmetadata', updateDrawerVideoUi);
    projectDrawerVideo.addEventListener('click', toggleDrawerVideoPlay);
  }

  if (drawerScrubberTrack && projectDrawerVideo) {
    drawerScrubberTrack.addEventListener('click', (e) => {
      const rect = drawerScrubberTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      if (projectDrawerVideo.duration) {
        projectDrawerVideo.currentTime = pct * projectDrawerVideo.duration;
      }
    });
  }

  function openProjectDrawer(idx) {
    const study = projectCaseStudies[idx] || projectCaseStudies[0];
    if (!study || !projectDrawerOverlay) return;
    currentProjectStudy = study;
    if (typeof audioFx !== 'undefined') audioFx.playDrawerOpen();

    if (projectDrawerImage) {
      projectDrawerImage.src = study.image;
      projectDrawerImage.alt = study.title;
    }

    // Cinema video player setup
    if (projectDrawerVideo && study.video) {
      projectDrawerVideo.src = study.video;
      projectDrawerVideo.style.display = 'block';
      if (projectDrawerImage) projectDrawerImage.style.display = 'none';
      projectDrawerVideo.currentTime = 0;
      projectDrawerVideo.muted = true;
      if (drawerSoundOffIcon) drawerSoundOffIcon.style.display = 'block';
      if (drawerSoundOnIcon) drawerSoundOnIcon.style.display = 'none';
      projectDrawerVideo.play().then(() => {
        if (drawerPlayIcon) drawerPlayIcon.style.display = 'none';
        if (drawerPauseIcon) drawerPauseIcon.style.display = 'block';
      }).catch(() => {
        if (drawerPlayIcon) drawerPlayIcon.style.display = 'block';
        if (drawerPauseIcon) drawerPauseIcon.style.display = 'none';
      });
    } else if (projectDrawerVideo) {
      projectDrawerVideo.style.display = 'none';
      if (projectDrawerImage) projectDrawerImage.style.display = 'block';
    }

    // DaVinci Grade Pipeline Badges and Chips
    if (gradeSensorBadge) {
      gradeSensorBadge.textContent = study.sensor || 'Sony FX6 · S-Log3 / S-Gamut3.Cine · CineEI 800';
    }

    if (gradePaletteChips) {
      gradePaletteChips.innerHTML = '';
      const palette = study.palette || [
        { hex: '#0A0E17', name: 'Obsidian' },
        { hex: '#00F2FE', name: 'Cyan' },
        { hex: '#3B82F6', name: 'Blue' },
        { hex: '#E2E8F0', name: 'White' }
      ];
      palette.forEach(c => {
        const chip = document.createElement('div');
        chip.className = 'palette-chip';
        chip.setAttribute('title', `Click to copy ${c.hex} (${c.name})`);
        chip.innerHTML = `
          <div class="chip-swatch" style="background-color: ${c.hex};"></div>
          <div class="chip-info">
            <span class="chip-hex">${c.hex}</span>
            <span class="chip-label">${c.name}</span>
          </div>
        `;
        chip.addEventListener('click', () => {
          if (typeof audioFx !== 'undefined') audioFx.playClick();
          if (navigator.clipboard) {
            navigator.clipboard.writeText(c.hex).then(() => {
              showToast(`Copied ${c.hex} (${c.name})`);
            });
          }
        });
        gradePaletteChips.appendChild(chip);
      });
    }

    if (projectDrawerCategory) projectDrawerCategory.textContent = study.category;
    if (projectDrawerEyebrow) projectDrawerEyebrow.textContent = study.eyebrow;
    if (projectDrawerTitle) projectDrawerTitle.textContent = study.title;
    if (projectDrawerTagline) projectDrawerTagline.textContent = study.tagline;
    if (projectDrawerDescription) projectDrawerDescription.textContent = study.description;

    if (projectDrawerMetrics) {
      projectDrawerMetrics.innerHTML = '';
      study.metrics.forEach(m => {
        const div = document.createElement('div');
        div.className = 'p-metric-cell';
        div.innerHTML = `<span class="p-metric-val">${m.val}</span><span class="p-metric-lbl">${m.lbl}</span>`;
        projectDrawerMetrics.appendChild(div);
      });
    }

    if (projectDrawerTags) {
      projectDrawerTags.innerHTML = '';
      study.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'p-tag-pill';
        span.textContent = tag;
        projectDrawerTags.appendChild(span);
      });
    }

    if (lenis) lenis.stop();
    projectDrawerOverlay.classList.add('is-active');
    projectDrawerOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeProjectDrawer() {
    if (!projectDrawerOverlay) return;
    if (projectDrawerVideo) {
      projectDrawerVideo.pause();
      projectDrawerVideo.src = '';
    }
    if (lenis) lenis.start();
    projectDrawerOverlay.classList.remove('is-active');
    projectDrawerOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    currentProjectStudy = null;
  }

  if (projectDrawerClose) projectDrawerClose.addEventListener('click', closeProjectDrawer);

  if (projectDrawerOverlay) {
    projectDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === projectDrawerOverlay) closeProjectDrawer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectDrawerOverlay?.classList.contains('is-active')) {
      closeProjectDrawer();
    }
  });

  if (projectDrawerInquireBtn) {
    projectDrawerInquireBtn.addEventListener('click', () => {
      const projName = currentProjectStudy ? currentProjectStudy.title : 'Selected Project';
      closeProjectDrawer();
      openContactDrawer();
      const planSelect = document.getElementById('contactProjectPlan');
      if (planSelect) planSelect.value = 'Dedicated Production Retainer';
      const briefText = document.getElementById('inquiryBrief');
      if (briefText && !briefText.value) {
        briefText.value = `Hi Aldrin, I am inquiring about a production similar to "${projName}". We need commercial video editing & creative direction.`;
      }
    });
  }

  // Bind campaign cards to project case study drawer
  const campaignCards = document.querySelectorAll('.campaign-card');
  campaignCards.forEach((card, cIdx) => {
    card.addEventListener('click', () => {
      const targetIdx = (cIdx === 0) ? 1 : (cIdx === 1 ? 4 : (cIdx % 6));
      openProjectDrawer(targetIdx);
    });
  });

  /* ── 20. Collaboration & Production FAQ Accordion & Live Filter ── */
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearchInput = document.getElementById('faqSearchInput');
  const faqSearchClear = document.getElementById('faqSearchClear');
  const faqCategoryPills = document.querySelectorAll('.faq-pill-btn, .faq-category-pill');

  let activeFaqCategory = 'all';

  function filterFaqItems() {
    const query = faqSearchInput ? faqSearchInput.value.toLowerCase().trim() : '';
    if (faqSearchClear) {
      faqSearchClear.style.display = query.length > 0 ? 'flex' : 'none';
    }

    let matchCount = 0;
    faqItems.forEach(item => {
      const itemCat = item.getAttribute('data-category') || 'all';
      const questionText = item.querySelector('.faq-trigger')?.textContent.toLowerCase() || '';
      const answerText = item.querySelector('.faq-body')?.textContent.toLowerCase() || '';
      
      const matchesCategory = (activeFaqCategory === 'all' || itemCat === activeFaqCategory);
      const matchesSearch = !query || questionText.includes(query) || answerText.includes(query);

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        matchCount++;
      } else {
        item.style.display = 'none';
      }
    });

    const emptyState = document.getElementById('faqEmptyState') || document.getElementById('faqEmptyStateNotice');
    if (emptyState) {
      emptyState.style.display = (matchCount === 0) ? 'block' : 'none';
    }
  }

  const faqEmptyCta = document.getElementById('faqEmptyCta');
  if (faqEmptyCta) {
    faqEmptyCta.addEventListener('click', () => {
      if (typeof audioFx !== 'undefined') audioFx.playClick();
      openContactDrawer();
    });
  }

  faqCategoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (typeof audioFx !== 'undefined') audioFx.playClick();
      faqCategoryPills.forEach(p => {
        p.classList.remove('active', 'is-active');
      });
      pill.classList.add('active', 'is-active');
      activeFaqCategory = pill.getAttribute('data-faq-cat') || pill.getAttribute('data-filter') || 'all';
      filterFaqItems();
    });
  });

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', filterFaqItems);
  }

  if (faqSearchClear) {
    faqSearchClear.addEventListener('click', () => {
      if (typeof audioFx !== 'undefined') audioFx.playClick();
      if (faqSearchInput) {
        faqSearchInput.value = '';
        filterFaqItems();
        faqSearchInput.focus();
      }
    });
  }

  // Keyboard shortcut '/' to search FAQ
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
      e.preventDefault();
      const faqSec = document.getElementById('faq');
      if (faqSec) {
        scrollToTarget(faqSec);
        setTimeout(() => {
          if (faqSearchInput) faqSearchInput.focus();
        }, 400);
      }
    }
  });

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      if (typeof audioFx !== 'undefined') audioFx.playClick();
      const isAlreadyActive = item.classList.contains('is-active');
      faqItems.forEach(other => {
        other.classList.remove('is-active');
        const otherTrigger = other.querySelector('.faq-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });
      if (!isAlreadyActive) {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── 21. Fullscreen Mobile Navigation Drawer ─────────────────── */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileNavBookBtn = document.getElementById('mobileNavBookBtn');

  function openMobileNav() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.add('is-open');
    mobileNavOverlay.setAttribute('aria-hidden', 'false');
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.add('is-active');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
    if (lenis) lenis.stop();
    document.body.classList.add('modal-open');
  }

  function closeMobileNav() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.remove('is-open');
    mobileNavOverlay.setAttribute('aria-hidden', 'true');
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.remove('is-active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    if (lenis) lenis.start();
    document.body.classList.remove('modal-open');
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (mobileNavOverlay?.classList.contains('is-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  if (mobileNavBookBtn) {
    mobileNavBookBtn.addEventListener('click', () => {
      closeMobileNav();
      openContactDrawer();
    });
  }



  /* ── 23. NLE Playhead Live SMPTE Timecode HUD ─────────────────── */
  function initHeroNleHud() {
    const heroVid = document.getElementById('heroVideo');
    const timecodeDisplay = document.getElementById('heroTimecodeDisplay');
    if (!heroVid || !timecodeDisplay) return;

    function formatSmpteTimecode(seconds) {
      const s = Math.max(0, seconds || 0);
      const hrs = String(Math.floor(s / 3600)).padStart(2, '0');
      const mins = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const secs = String(Math.floor(s % 60)).padStart(2, '0');
      const frames = String(Math.floor((s % 1) * 23.976)).padStart(2, '0');
      return `${hrs}:${mins}:${secs}:${frames}`;
    }

    heroVid.addEventListener('timeupdate', () => {
      timecodeDisplay.textContent = formatSmpteTimecode(heroVid.currentTime);
    });
  }

  initHeroNleHud();

  /* ── 24. Interactive Video Production Pricing & Scope Estimator ── */
  function initPricingEstimator() {
    const tierCards = document.querySelectorAll('.pricing-card[data-tier]');
    const hudTotalPrice = document.getElementById('hudTotalPrice');
    const hudTurnaround = document.getElementById('hudTurnaround');
    const lockScopeBtn = document.getElementById('lockScopeBtn');

    const tierData = {
      reels: {
        name: 'Viral Short-Form Suite',
        basePrice: 750,
        turnaround: '24–48 Hours',
        rushTurnaround: '12–24 Hours'
      },
      saas: {
        name: 'SaaS & Product Demo',
        basePrice: 1250,
        turnaround: '3–5 Business Days',
        rushTurnaround: '48 Hours'
      },
      commercial: {
        name: 'Commercial & Brand Hero',
        basePrice: 2400,
        turnaround: '5–7 Business Days',
        rushTurnaround: '72 Hours'
      },
      retainer: {
        name: 'Monthly Creative Retainer',
        basePrice: 3800,
        turnaround: 'Continuous Monthly',
        rushTurnaround: 'Priority Same-Day Slots'
      }
    };

    const addons = [
      { id: 'addonRush', price: 450, label: 'Rush Turnaround (+48h Priority)' },
      { id: 'addonMultiCut', price: 350, label: 'Multi-Aspect Pack (9:16 + 16:9 + 1:1)' },
      { id: 'addonVoiceover', price: 250, label: 'Pro Studio Voiceover & Stems' },
      { id: 'addon3D', price: 550, label: '3D Product Motion & VFX' },
      { id: 'addonSourceFiles', price: 200, label: 'Source Timeline & Project Files' }
    ];

    let currentTierKey = 'saas';
    let displayedPrice = 1250;
    let priceAnimFrame = null;

    function animatePriceTo(targetPrice) {
      if (priceAnimFrame) cancelAnimationFrame(priceAnimFrame);
      const startPrice = displayedPrice;
      const startTime = performance.now();
      const duration = 300;

      function step(now) {
        const progress = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        displayedPrice = Math.round(startPrice + (targetPrice - startPrice) * ease);
        if (hudTotalPrice) {
          hudTotalPrice.textContent = displayedPrice.toLocaleString();
        }
        if (progress < 1) {
          priceAnimFrame = requestAnimationFrame(step);
        } else {
          displayedPrice = targetPrice;
          if (hudTotalPrice) hudTotalPrice.textContent = targetPrice.toLocaleString();
        }
      }
      priceAnimFrame = requestAnimationFrame(step);
    }

    function calculateScope() {
      const tier = tierData[currentTierKey] || tierData.saas;
      let total = tier.basePrice;
      let hasRush = false;
      const selectedAddonLabels = [];

      addons.forEach(addon => {
        const el = document.getElementById(addon.id);
        if (el && el.checked) {
          total += addon.price;
          selectedAddonLabels.push(addon.label);
          if (addon.id === 'addonRush') hasRush = true;
        }
      });

      animatePriceTo(total);

      if (hudTurnaround) {
        hudTurnaround.textContent = hasRush ? tier.rushTurnaround : tier.turnaround;
      }

      const hudSelectedTierName = document.getElementById('hudSelectedTierName');
      if (hudSelectedTierName) hudSelectedTierName.textContent = tier.name;

      const hudScopeBreakdown = document.getElementById('hudScopeBreakdown');
      if (hudScopeBreakdown) {
        const addonSummary = selectedAddonLabels.length > 0 ? selectedAddonLabels.join(' · ') : 'Standard Deliverables Suite';
        hudScopeBreakdown.innerHTML = `<span>Includes: ${tier.name} + ${addonSummary}</span>`;
      }

      return {
        tierName: tier.name,
        total,
        hasRush,
        turnaround: hasRush ? tier.rushTurnaround : tier.turnaround,
        addons: selectedAddonLabels
      };
    }

    tierCards.forEach(card => {
      card.addEventListener('click', () => {
        if (typeof audioFx !== 'undefined') audioFx.playClick();
        tierCards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        currentTierKey = card.getAttribute('data-tier') || 'saas';
        calculateScope();
      });
    });

    addons.forEach(addon => {
      const el = document.getElementById(addon.id);
      if (el) {
        el.addEventListener('change', () => {
          if (typeof audioFx !== 'undefined') audioFx.playClick();
          calculateScope();
        });
      }
    });

    // Lock Scope CTA -> opens contact drawer with prefilled brief & budget
    if (lockScopeBtn) {
      lockScopeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof audioFx !== 'undefined') audioFx.playClick();
        const scope = calculateScope();
        
        openContactDrawer();

        // Select best budget match
        const budgetSelect = document.getElementById('inquiryBudget');
        if (budgetSelect) {
          if (scope.total < 500) {
            budgetSelect.value = '<$500';
          } else if (scope.total <= 1500) {
            budgetSelect.value = '$500 - $1,500';
          } else if (scope.total <= 3000) {
            budgetSelect.value = '$1,500 - $3,000';
          } else {
            budgetSelect.value = '$3,000+';
          }
        }

        // Fill brief
        const briefField = document.getElementById('inquiryBrief');
        if (briefField) {
          const addonText = scope.addons.length > 0 ? scope.addons.join(', ') : 'None (Standard Scope)';
          briefField.value = `[ESTIMATED SCOPE: ${scope.tierName.toUpperCase()} — $${scope.total.toLocaleString()}]\nTurnaround Target: ${scope.turnaround}\nSelected Add-ons: ${addonText}\n\nHi Aldrin, I configured this scope in your calculator and would like to confirm production availability.`;
        }

        // Select Video Editing or Production service checkbox
        const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
        serviceCheckboxes.forEach(cb => {
          if (cb.value === 'Video Production' || cb.value === 'Video Editing') {
            cb.checked = true;
          }
        });

        showToast(`Scope locked ($${scope.total.toLocaleString()}) — Inquiry drawer loaded!`);
      });
    }

    // Initial calculation
    calculateScope();
  }

  initPricingEstimator();

  /* ── 25. 3D Perspective Card Tilt & Dynamic Specular Sheen ───── */
  function initPerspectiveCardTilt() {
    if (window.innerWidth < 900) return;

    const tiltTargets = document.querySelectorAll('.campaign-card, .service-card-item, .statement-card, .phone-mockup-frame, .flyer-mockup-card, .pillar-card, .step-visual-card, .pricing-card');

    tiltTargets.forEach(card => {
      card.classList.add('tilt-sheen-surface');

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -((y - centerY) / centerY) * 6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── 26. Behind The Edit: Interactive NLE Stems Deconstructor ── */
  function initNleStemsSandbox() {
    const video = document.getElementById('stemVideoPlayer');
    const layerV3 = document.getElementById('layerV3Overlay');
    const layerV2 = document.getElementById('layerV2Overlay');
    const gradeBtn = document.getElementById('stemGradeSwitchBtn');
    const gradeBtnLabel = document.getElementById('stemGradeBtnLabel');
    const pictureBadge = document.getElementById('stemPictureBadge');
    const pictureLabel = document.getElementById('stemPictureModeLabel');
    const playhead = document.getElementById('stemScrubPlayhead');
    const timecodeDisplay = document.getElementById('nleTimecodeDisplay');
    const rulerTrack = document.getElementById('stemRulerTrack');

    const presetBtns = document.querySelectorAll('.stem-preset-btn');
    const muteBtns = document.querySelectorAll('.stem-toggle-btn.btn-mute');
    const soloBtns = document.querySelectorAll('.stem-toggle-btn.btn-solo');
    const laneRows = document.querySelectorAll('.nle-lane-row');

    const telemetryPct = document.getElementById('telemetryRetentionPct');
    const telemetryStatus = document.getElementById('telemetryRetentionStatus');
    const telemetryFill = document.getElementById('telemetryRetentionFill');
    const telemetryHookIndex = document.getElementById('telemetryHookIndex');
    const telemetryInsightText = document.getElementById('telemetryInsightText');
    const lockScopeBtn = document.getElementById('telemetryLockScopeBtn');

    if (!video) return;

    // Stem State Dictionary
    const stems = {
      v3: true,      // Subtitles & Hooks
      v2: true,      // 3D Motion VFX
      v1Grade: true, // Color Grade: true = Master, false = RAW S-Log3
      a1: true,      // Music Bed
      a2: true,      // Foley & SFX
      a3: true       // Voiceover
    };

    let soloActive = null; // Track ID if in solo mode
    let userHasUnmutedAudio = false;

    // Guaranteed initial muted autoplay on mobile and desktop
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', 'true');
    video.play().catch(() => {});

    function updateState() {
      // 1. Update Video Color Grade
      if (stems.v1Grade) {
        video.classList.remove('stem-grade-raw');
        video.classList.add('stem-grade-master');
        if (gradeBtn) {
          gradeBtn.classList.remove('is-raw');
          if (gradeBtnLabel) gradeBtnLabel.textContent = 'GRADED';
        }
        if (pictureBadge) {
          pictureBadge.classList.remove('is-raw');
          if (pictureLabel) pictureLabel.textContent = 'DAVINCI FILM MASTER GRADE';
        }
      } else {
        video.classList.remove('stem-grade-master');
        video.classList.add('stem-grade-raw');
        if (gradeBtn) {
          gradeBtn.classList.add('is-raw');
          if (gradeBtnLabel) gradeBtnLabel.textContent = 'RAW S-LOG3';
        }
        if (pictureBadge) {
          pictureBadge.classList.add('is-raw');
          if (pictureLabel) pictureLabel.textContent = 'FLAT S-LOG3 RAW (ACEScc)';
        }
      }

      // 2. Update Overlay Layers
      if (layerV3) {
        layerV3.classList.toggle('is-muted', !stems.v3);
      }
      if (layerV2) {
        layerV2.classList.toggle('is-muted', !stems.v2);
      }

      // 3. Update Audio state (stay muted on load so browsers never block playback)
      const hasAnyAudio = stems.a1 || stems.a2 || stems.a3;
      if (userHasUnmutedAudio) {
        video.muted = !hasAnyAudio;
      } else {
        video.muted = true;
      }

      // 4. Update Lane Rows UI
      laneRows.forEach(lane => {
        const stemId = lane.getAttribute('data-stem');
        let isMuted = false;
        if (stemId === 'v3') isMuted = !stems.v3;
        if (stemId === 'v2') isMuted = !stems.v2;
        if (stemId === 'v1') isMuted = !stems.v1Grade;
        if (stemId === 'a1') isMuted = !stems.a1;
        if (stemId === 'a2') isMuted = !stems.a2;
        if (stemId === 'a3') isMuted = !stems.a3;

        lane.classList.toggle('is-muted', isMuted);

        // Update Mute button within this lane
        const mBtn = lane.querySelector('.btn-mute');
        if (mBtn) mBtn.classList.toggle('is-active', isMuted);

        // Update Solo button within this lane
        const sBtn = lane.querySelector('.btn-solo');
        if (sBtn) sBtn.classList.toggle('is-active', soloActive === stemId);
      });

      // 5. Update Retention Telemetry
      calculateRetentionTelemetry();
    }

    function calculateRetentionTelemetry() {
      let score = 22; // Base baseline raw video (no polish)
      if (stems.v3) score += 21;      // Kinetic Captions & Retention Hooks (+21%)
      if (stems.v2) score += 11;      // 3D Motion VFX & Tracking (+11%)
      if (stems.v1Grade) score += 13; // DaVinci Film Color Master (+13%)
      if (stems.a1) score += 12;      // Music Bed & Rhythm (+12%)
      if (stems.a2) score += 11;      // Sub-Bass Foley & SFX (+11%)
      if (stems.a3) score += 8;       // Voiceover Clarity (+8%)
      // Sum when all active: 22 + 21 + 11 + 13 + 12 + 11 + 8 = 98%

      score = Math.min(98, Math.max(22, score));

      if (telemetryPct) telemetryPct.textContent = `${score}%`;
      if (telemetryFill) telemetryFill.style.width = `${score}%`;

      if (score >= 80) {
        if (telemetryStatus) {
          telemetryStatus.textContent = 'VIRAL CLASS';
          telemetryStatus.style.color = '#00f2fe';
          telemetryStatus.style.background = 'rgba(0, 242, 254, 0.15)';
        }
        if (telemetryHookIndex) telemetryHookIndex.textContent = 'MAXIMUM · 94/100';
        if (telemetryFill) telemetryFill.style.background = 'linear-gradient(90deg, #3b82f6, #00f2fe)';
      } else if (score >= 50) {
        if (telemetryStatus) {
          telemetryStatus.textContent = 'AVERAGE PACING';
          telemetryStatus.style.color = '#f59e0b';
          telemetryStatus.style.background = 'rgba(245, 158, 11, 0.15)';
        }
        if (telemetryHookIndex) telemetryHookIndex.textContent = 'MODERATE · 62/100';
        if (telemetryFill) telemetryFill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
      } else {
        if (telemetryStatus) {
          telemetryStatus.textContent = 'HIGH DROP-OFF';
          telemetryStatus.style.color = '#ef4444';
          telemetryStatus.style.background = 'rgba(239, 68, 68, 0.15)';
        }
        if (telemetryHookIndex) telemetryHookIndex.textContent = 'CRITICAL · 28/100';
        if (telemetryFill) telemetryFill.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
      }

      // Dynamic Pedagogical Narrative
      if (telemetryInsightText) {
        if (!stems.v3 && !stems.a1 && !stems.a2) {
          telemetryInsightText.textContent = '⚠️ Severe Drop-off Risk: 78% of mobile feeds scroll on mute. Without subtitles and sound design, raw footage holds virtually zero viewer attention.';
        } else if (!stems.v3) {
          telemetryInsightText.textContent = '⚠️ Silent Scroll Vulnerability: Without kinetic subtitles, mobile users watching without headphones scroll past within 2.4 seconds.';
        } else if (!stems.a2) {
          telemetryInsightText.textContent = '⚠️ Missing Tactile Foley: Sub-bass impacts and risers cue the brain that an important shift is coming. Without them, pacing feels lifeless.';
        } else if (!stems.v1Grade) {
          telemetryInsightText.textContent = '⚠️ Uncorrected Flat S-Log3: Low contrast and washed-out gamma curves signal amateur production to high-ticket clients.';
        } else if (!stems.a1) {
          telemetryInsightText.textContent = '⚠️ Missing Music Rhythm: Music sets the subconscious tempo of the commercial. Without a score, the video feels awkwardly quiet.';
        } else {
          telemetryInsightText.textContent = '✅ Complete 6-Stem Production Architecture: Dynamic hook captions, layered foley, 3D tracking, and DaVinci film color deliver maximum audience retention.';
        }
      }
    }

    // Toggle Grade Button
    if (gradeBtn) {
      gradeBtn.addEventListener('click', () => {
        if (typeof audioFx !== 'undefined') audioFx.playClick();
        stems.v1Grade = !stems.v1Grade;
        updateState();
        video.play().catch(() => {});
      });
    }

    // Mute Buttons
    muteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof audioFx !== 'undefined') audioFx.playClick();
        userHasUnmutedAudio = true;
        const stem = btn.getAttribute('data-stem-mute');
        if (stem && stems.hasOwnProperty(stem)) {
          stems[stem] = !stems[stem];
          soloActive = null;
          updateState();
          video.play().catch(() => {});
        }
      });
    });

    // Solo Buttons
    soloBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof audioFx !== 'undefined') audioFx.playClick();
        userHasUnmutedAudio = true;
        const stem = btn.getAttribute('data-stem-solo');
        if (!stem) return;

        if (soloActive === stem) {
          // Unsolo: Restore all
          soloActive = null;
          Object.keys(stems).forEach(k => stems[k] = true);
        } else {
          // Solo this stem
          soloActive = stem;
          Object.keys(stems).forEach(k => stems[k] = (k === stem || k === 'v1Grade'));
        }
        updateState();
        video.play().catch(() => {});
      });
    });

    // 1-Click Studio Presets
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof audioFx !== 'undefined') audioFx.playClick();
        userHasUnmutedAudio = true;
        presetBtns.forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');

        const preset = btn.getAttribute('data-preset');
        soloActive = null;

        if (preset === 'full') {
          stems.v3 = true;
          stems.v2 = true;
          stems.v1Grade = true;
          stems.a1 = true;
          stems.a2 = true;
          stems.a3 = true;
        } else if (preset === 'raw') {
          stems.v3 = false;
          stems.v2 = false;
          stems.v1Grade = false;
          stems.a1 = false;
          stems.a2 = false;
          stems.a3 = true;
        } else if (preset === 'sfx') {
          stems.v3 = false;
          stems.v2 = true;
          stems.v1Grade = true;
          stems.a1 = true;
          stems.a2 = true;
          stems.a3 = false;
        } else if (preset === 'silent') {
          stems.v3 = true;
          stems.v2 = true;
          stems.v1Grade = true;
          stems.a1 = false;
          stems.a2 = false;
          stems.a3 = false;
        }

        updateState();
        video.play().catch(() => {});
      });
    });

    // Tap/Click Monitor to Toggle Play/Pause
    const monitorViewport = document.getElementById('stemMonitorViewport');
    if (monitorViewport) {
      monitorViewport.addEventListener('click', () => {
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }

    // Sync Playhead and Timecode with Video Playback
    video.addEventListener('timeupdate', () => {
      const cur = video.currentTime || 0;
      const dur = video.duration || 15;
      const pct = (cur / dur) * 100;

      if (playhead) {
        playhead.style.left = `calc(240px + ${pct * 0.75}%)`;
      }

      if (timecodeDisplay) {
        const frames = Math.floor((cur % 1) * 24);
        const s = Math.floor(cur % 60);
        const m = Math.floor(cur / 60);
        timecodeDisplay.textContent = `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
      }
    });

    // Scrub by clicking timeline ruler
    if (rulerTrack) {
      rulerTrack.addEventListener('click', (e) => {
        const rect = rulerTrack.getBoundingClientRect();
        const clickX = e.clientX - (rect.left + 240);
        const availWidth = rect.width - 240;
        if (availWidth > 0 && clickX > 0) {
          const ratio = Math.max(0, Math.min(1, clickX / availWidth));
          if (video.duration) {
            video.currentTime = ratio * video.duration;
          }
        }
      });
    }

    // Lock Scope Button
    if (lockScopeBtn) {
      lockScopeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof audioFx !== 'undefined') audioFx.playClick();
        openContactDrawer();

        const planSelect = document.getElementById('contactProjectPlan');
        if (planSelect) planSelect.value = 'Dedicated Production Retainer';

        const budgetSelect = document.getElementById('inquiryBudget');
        if (budgetSelect) budgetSelect.value = '$1,500 - $3,000';

        const briefField = document.getElementById('inquiryBrief');
        if (briefField) {
          briefField.value = `[STUDIO EDITING PIPELINE: 6-STEM RETENTION MASTER]\nI explored your Behind The Edit sandbox and want to lock in this full post-production scope (DaVinci Film Master, 3D Motion VFX, Kinetic Subtitles, Multi-Layer Foley & Sound Score).\n\nPlease let me know your earliest kickoff timeline.`;
        }

        // Check Video Editing and Production checkboxes
        document.querySelectorAll('input[name="services"]').forEach(cb => {
          if (cb.value === 'Video Editing' || cb.value === 'Video Production') {
            cb.checked = true;
          }
        });

        showToast('Multi-stem edit scope locked into inquiry form!');
      });
    }

    // Initialize state
    updateState();
  }

  initNleStemsSandbox();
  initPerspectiveCardTilt();

  /* ── 27. Smartphone Mockup Playback Controller ───────── */
  function initPhoneMockupController() {
    const phoneFrame = document.getElementById('phoneMockupFrame');
    const phoneVideo = document.getElementById('phoneMockupVideo');
    const phoneTapIndicator = document.getElementById('phoneTapIndicator');
    const phoneLiveText = document.getElementById('phoneLiveText');
    const phonePlayIcon = phoneTapIndicator ? phoneTapIndicator.querySelector('.phone-play-icon') : null;
    const phonePauseIcon = phoneTapIndicator ? phoneTapIndicator.querySelector('.phone-pause-icon') : null;

    if (!phoneVideo) return;

    phoneVideo.muted = true;
    phoneVideo.playsInline = true;
    phoneVideo.setAttribute('webkit-playsinline', 'true');
    phoneVideo.play().catch(() => {});

    function togglePhonePlayback() {
      if (typeof audioFx !== 'undefined') audioFx.playClick();
      if (phoneVideo.paused) {
        phoneVideo.play().then(() => {
          if (phoneFrame) phoneFrame.classList.remove('is-paused');
          if (phoneLiveText) phoneLiveText.textContent = 'LIVE UI';
          if (phonePlayIcon) phonePlayIcon.style.display = 'none';
          if (phonePauseIcon) phonePauseIcon.style.display = 'block';
        }).catch(() => {});
      } else {
        phoneVideo.pause();
        if (phoneFrame) phoneFrame.classList.add('is-paused');
        if (phoneLiveText) phoneLiveText.textContent = 'PAUSED';
        if (phonePlayIcon) phonePlayIcon.style.display = 'block';
        if (phonePauseIcon) phonePauseIcon.style.display = 'none';
      }
    }

    if (phoneFrame) {
      phoneFrame.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePhonePlayback();
      });
      phoneFrame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePhonePlayback();
        }
      });
    }
  }
  initPhoneMockupController();

  /* ── 28. Universal Mobile Video Autoplay & Intersection Engine ── */
  function initUniversalMobileVideoAutoplay() {
    const mediaVideos = document.querySelectorAll('video');

    mediaVideos.forEach(v => {
      if (v.hasAttribute('autoplay') || v.classList.contains('phone-screen-video') || v.classList.contains('nle-monitor-video')) {
        v.muted = true;
        v.playsInline = true;
        v.setAttribute('webkit-playsinline', 'true');
        v.play().catch(() => {});
      }
    });

    if ('IntersectionObserver' in window) {
      const looperObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const vid = entry.target;
          if (entry.isIntersecting) {
            if (vid.paused && (vid.hasAttribute('autoplay') || vid.classList.contains('phone-screen-video') || vid.classList.contains('nle-monitor-video'))) {
              vid.muted = true;
              vid.playsInline = true;
              vid.play().catch(() => {});
            }
          }
        });
      }, { threshold: 0.15 });

      mediaVideos.forEach(v => {
        if (v.hasAttribute('autoplay') || v.classList.contains('phone-screen-video') || v.classList.contains('nle-monitor-video')) {
          looperObserver.observe(v);
        }
      });
    }

    // Touch, Pointer, and Scroll Gesture Unlocker for iOS Safari and Android Chrome
    const unlockVideosOnGesture = () => {
      mediaVideos.forEach(v => {
        if (v.hasAttribute('autoplay') || v.classList.contains('phone-screen-video') || v.classList.contains('nle-monitor-video')) {
          if (v.paused) {
            v.muted = true;
            v.playsInline = true;
            v.play().catch(() => {});
          }
        }
      });
    };

    ['touchstart', 'touchend', 'pointerdown', 'scroll'].forEach(evt => {
      window.addEventListener(evt, unlockVideosOnGesture, { passive: true, once: true });
    });
  }
  initUniversalMobileVideoAutoplay();

  /* ── 19. Digital Rights & Media Download Prevention ───────── */
  // Prevent right-click context menu on all images, videos, canvas, and media showcases
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('img, video, .hero-video-wrapper, .earth-globe-wrapper, .about-process-card, .brand-mockups-stage, .work-stage, .work-slide, .campaign-card, .prototype-scroll-frame, .reel-expanding-container, .nle-monitor-stage, .nle-studio-frame')) {
      e.preventDefault();
      return false;
    }
  }, { passive: false });

  // Prevent drag-to-desktop / drag-to-folder on all media
  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('img, video, .work-slide')) {
      e.preventDefault();
      return false;
    }
  }, { passive: false });

  // Block keyboard shortcuts commonly used to scrape/download media (Ctrl+S, Cmd+S)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  }, { passive: false });

});


