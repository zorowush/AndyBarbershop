/**
 * DepthCarousel - 3D Perspective Card Stack (React Bits Port for Vanilla JS)
 * Enhanced for Andy Barbershop with GSAP Tweening & Full Touch/Drag Interactivity
 */

(function (global) {
    'use strict';

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    class DepthCarousel {
        constructor(container, options = {}) {
            this.container = typeof container === 'string' ? document.querySelector(container) : container;
            if (!this.container) {
                console.warn('[DepthCarousel] Container not found:', container);
                return;
            }

            this.options = Object.assign({
                cardWidth: 320,
                cardHeight: 440,
                radius: 18,
                tint: '#05060a',
                depth: 220,
                spread: 90,
                tilt: 22,
                tiltDirection: 'right',
                perspective: 1400,
                visibleCards: 4,
                falloff: 0.2,
                blur: 6,
                duration: 700,
                ease: 'power3.out',
                autoplay: true,
                autoplayDelay: 3500,
                loop: true,
                showControls: true,
                showIndicators: true,
                onChange: null
            }, options);

            this.stage = this.container.querySelector('.depth-carousel__stage');
            this.cards = Array.from(this.container.querySelectorAll('.depth-carousel__card'));
            this.tints = Array.from(this.container.querySelectorAll('.depth-carousel__tint'));
            this.count = this.cards.length;

            if (this.count === 0) {
                console.warn('[DepthCarousel] No .depth-carousel__card elements found inside container');
                return;
            }

            this.pos = 0;
            this.focus = 0;
            this.scale = 1;
            this.active = 0;
            this.tween = null;

            this.drag = null;
            this.wheelTimer = null;
            this.autoTimer = null;
            this.isHovered = false;
            this.isFocused = false;

            this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            this.init();
        }

        init() {
            this.container.style.setProperty('--dc-perspective', `${this.options.perspective}px`);

            // Ensure cards have dimensions and tints
            this.cards.forEach((card, idx) => {
                card.style.borderRadius = `${this.options.radius}px`;
                card.setAttribute('role', 'group');
                card.setAttribute('aria-roledescription', 'slide');
                card.setAttribute('aria-label', `${idx + 1} of ${this.count}`);

                // If tint element does not exist inside card, create one
                if (!card.querySelector('.depth-carousel__tint')) {
                    const tintEl = document.createElement('span');
                    tintEl.className = 'depth-carousel__tint';
                    tintEl.style.background = this.options.tint;
                    card.appendChild(tintEl);
                }

                // Click to focus card
                card.addEventListener('click', (e) => {
                    // Do not focus if user was dragging or clicked a button/link inside caption
                    if (this.drag && this.drag.moved) return;
                    if (e.target.closest('a') || e.target.closest('button')) return;
                    this.setFocus(idx, true);
                });
            });

            this.tints = Array.from(this.container.querySelectorAll('.depth-carousel__tint'));

            // Build or hook controls
            this.setupControls();

            // Bind events
            this.bindEvents();

            // Initial layout calculation
            this.updateScale();
            this.layout(this.pos);

            // Start autoplay if enabled
            if (this.options.autoplay && !this.reducedMotion && this.count > 1) {
                this.startAutoplay();
            }
        }

        setupControls() {
            // Check for previous / next arrow buttons
            this.prevBtn = this.container.querySelector('.depth-carousel__arrow--prev');
            this.nextBtn = this.container.querySelector('.depth-carousel__arrow--next');

            if (!this.prevBtn && this.options.showControls && this.count > 1) {
                this.prevBtn = document.createElement('button');
                this.prevBtn.type = 'button';
                this.prevBtn.className = 'depth-carousel__arrow depth-carousel__arrow--prev';
                this.prevBtn.setAttribute('aria-label', 'Model sebelumnya');
                this.prevBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                this.container.appendChild(this.prevBtn);
            }

            if (!this.nextBtn && this.options.showControls && this.count > 1) {
                this.nextBtn = document.createElement('button');
                this.nextBtn.type = 'button';
                this.nextBtn.className = 'depth-carousel__arrow depth-carousel__arrow--next';
                this.nextBtn.setAttribute('aria-label', 'Model selanjutnya');
                this.nextBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                this.container.appendChild(this.nextBtn);
            }

            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateBy(-1);
                });
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateBy(1);
                });
            }

            // Dot indicators
            this.dotsContainer = this.container.querySelector('.depth-carousel__dots');
            if (!this.dotsContainer && this.options.showIndicators && this.count > 1) {
                this.dotsContainer = document.createElement('div');
                this.dotsContainer.className = 'depth-carousel__dots';
                this.dotsContainer.setAttribute('role', 'tablist');
                this.dotsContainer.setAttribute('aria-label', 'Slides');

                for (let i = 0; i < this.count; i++) {
                    const dot = document.createElement('button');
                    dot.type = 'button';
                    dot.className = `depth-carousel__dot${i === 0 ? ' is-active' : ''}`;
                    dot.setAttribute('role', 'tab');
                    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
                    dot.setAttribute('aria-label', `Pilih model ${i + 1}`);
                    dot.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.setFocus(i, true);
                    });
                    this.dotsContainer.appendChild(dot);
                }
                this.container.appendChild(this.dotsContainer);
            }
            this.dots = this.dotsContainer ? Array.from(this.dotsContainer.querySelectorAll('.depth-carousel__dot')) : [];
        }

        bindEvents() {
            // Resize observer for responsive auto-scale
            if (window.ResizeObserver) {
                this.resizeObserver = new ResizeObserver((entries) => {
                    if (!entries || !entries[0]) return;
                    this.updateScale(entries[0].contentRect.width);
                    this.layout(this.pos);
                });
                this.resizeObserver.observe(this.container);
            } else {
                window.addEventListener('resize', () => {
                    this.updateScale();
                    this.layout(this.pos);
                });
            }

            // Pointer drag events
            this.container.addEventListener('pointerdown', (e) => this.onPointerDown(e));
            window.addEventListener('pointermove', (e) => this.onPointerMove(e));
            window.addEventListener('pointerup', (e) => this.onPointerEnd(e));
            window.addEventListener('pointercancel', (e) => this.onPointerEnd(e));

            // Mouse wheel event
            this.container.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

            // Keyboard navigation
            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.navigateBy(-1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.navigateBy(1);
                }
            });

            // Autoplay pause on hover / focus
            this.container.addEventListener('mouseenter', () => {
                this.isHovered = true;
                this.stopAutoplay();
            });
            this.container.addEventListener('mouseleave', () => {
                this.isHovered = false;
                this.startAutoplay();
            });
            this.container.addEventListener('focusin', () => {
                this.isFocused = true;
                this.stopAutoplay();
            });
            this.container.addEventListener('focusout', () => {
                this.isFocused = false;
                this.startAutoplay();
            });
        }

        updateScale(currentWidth) {
            const w = currentWidth || this.container.getBoundingClientRect().width || window.innerWidth;
            const needed = this.options.cardWidth + Math.abs(this.options.spread) * 2 + 80;
            this.scale = clamp(w / needed, 0.45, 1);
        }

        layout(pos) {
            const cfg = this.options;
            const n = this.count;
            if (!n) return;
            const dir = cfg.tiltDirection === 'left' ? -1 : 1;
            const sc = this.scale;

            for (let i = 0; i < n; i++) {
                const el = this.cards[i];
                if (!el) continue;

                let d = i - pos;
                if (cfg.loop && n > 1) {
                    d = ((d % n) + n) % n;
                    if (d > n / 2) d -= n;
                }

                const back = Math.max(0, d);
                const az = Math.abs(d);
                const shown = az <= cfg.visibleCards + 0.5;

                const tz = -cfg.depth * d;
                const tx = dir * cfg.spread * d;
                const ry = dir * cfg.tilt * clamp(d, 0, 1);

                let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
                if (!shown) opacity = 0;

                const brightness = Math.max(0.15, 1 - back * cfg.falloff);
                const blurPx = cfg.blur > 0 ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur) : 0;
                const zi = Math.round(2000 - d * 20);

                el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
                el.style.opacity = opacity.toFixed(3);
                el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
                el.style.zIndex = String(zi);
                el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

                const ov = this.tints[i];
                if (ov) {
                    ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.86).toFixed(3);
                }
            }
        }

        notify(idx) {
            this.active = idx;
            // Update dots
            if (this.dots && this.dots.length) {
                this.dots.forEach((dot, i) => {
                    if (i === idx) {
                        dot.classList.add('is-active');
                        dot.setAttribute('aria-selected', 'true');
                    } else {
                        dot.classList.remove('is-active');
                        dot.setAttribute('aria-selected', 'false');
                    }
                });
            }

            if (typeof this.options.onChange === 'function') {
                this.options.onChange(idx, this.cards[idx]);
            }
        }

        tweenTo(target, animate) {
            if (this.tween) {
                if (typeof this.tween.kill === 'function') this.tween.kill();
                this.tween = null;
            }

            const cfg = this.options;
            const dur = animate && !this.reducedMotion ? cfg.duration / 1000 : 0;

            if (window.gsap && dur > 0) {
                const proxy = { p: this.pos };
                this.tween = window.gsap.to(proxy, {
                    p: target,
                    duration: dur,
                    ease: cfg.ease || 'power3.out',
                    onUpdate: () => {
                        this.pos = proxy.p;
                        this.layout(proxy.p);
                    },
                    onComplete: () => {
                        const n = this.count;
                        if (n > 0) this.pos = ((this.pos % n) + n) % n;
                        this.layout(this.pos);
                    }
                });
            } else {
                // Fallback direct placement
                this.pos = target;
                const n = this.count;
                if (n > 0) this.pos = ((this.pos % n) + n) % n;
                this.layout(this.pos);
            }
        }

        setFocus(rawIndex, animate = true) {
            const cfg = this.options;
            const n = this.count;
            if (!n) return;
            const idx = cfg.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
            let delta = idx - this.pos;
            if (cfg.loop && n > 1) {
                delta = ((delta % n) + n) % n;
                if (delta > n / 2) delta -= n;
            }
            this.tweenTo(this.pos + delta, animate);
            if (idx !== this.focus) {
                this.focus = idx;
                this.notify(idx);
            }
        }

        navigateBy(step) {
            this.setFocus(this.focus + step, true);
        }

        onPointerDown(e) {
            if (this.count < 2) return;
            // Ignore if clicked on an active action button inside the card caption
            if (e.target.closest('a') || e.target.closest('button')) return;

            if (this.tween && typeof this.tween.kill === 'function') {
                this.tween.kill();
            }

            this.drag = {
                x: e.clientX,
                startPos: this.pos,
                lastX: e.clientX,
                lastT: performance.now(),
                v: 0,
                moved: false,
                id: e.pointerId
            };
        }

        onPointerMove(e) {
            const drag = this.drag;
            if (!drag) return;
            const stepPx = Math.max(this.options.cardWidth * 0.55 * this.scale, 40);
            const dx = e.clientX - drag.x;

            if (!drag.moved && Math.abs(dx) > 4) {
                drag.moved = true;
                if (this.container.setPointerCapture) {
                    try {
                        this.container.setPointerCapture(drag.id);
                    } catch (err) {}
                }
            }

            if (!drag.moved) return;

            const now = performance.now();
            const dt = Math.max(now - drag.lastT, 1);
            drag.v = (e.clientX - drag.lastX) / dt;
            drag.lastX = e.clientX;
            drag.lastT = now;
            this.pos = drag.startPos - dx / stepPx;
            this.layout(this.pos);
        }

        onPointerEnd() {
            const drag = this.drag;
            if (!drag) return;
            this.drag = null;
            if (!drag.moved) return;

            const stepPx = Math.max(this.options.cardWidth * 0.55 * this.scale, 40);
            const projected = this.pos - (drag.v * 180) / stepPx;
            this.setFocus(Math.round(projected), true);
        }

        onWheel(e) {
            if (this.count < 2) return;
            // Only capture wheel if user is scrolling mostly horizontally or hovering the stage directly
            const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(raw) < 10) return;

            e.preventDefault();
            if (this.tween && typeof this.tween.kill === 'function') {
                this.tween.kill();
            }

            const delta = e.deltaMode === 1 ? raw * 24 : raw;
            const step = clamp(delta / (this.options.cardWidth * 0.9), -0.6, 0.6);
            this.pos += step;
            this.layout(this.pos);

            if (this.wheelTimer) clearTimeout(this.wheelTimer);
            this.wheelTimer = setTimeout(() => {
                this.setFocus(Math.round(this.pos), true);
            }, 130);
        }

        startAutoplay() {
            this.stopAutoplay();
            if (!this.options.autoplay || this.count < 2) return;
            const delay = Math.max(this.options.autoplayDelay, 1000);
            this.autoTimer = setInterval(() => {
                if (!this.isHovered && !this.isFocused) {
                    this.navigateBy(1);
                }
            }, delay);
        }

        stopAutoplay() {
            if (this.autoTimer) {
                clearInterval(this.autoTimer);
                this.autoTimer = null;
            }
        }

        destroy() {
            this.stopAutoplay();
            if (this.tween && typeof this.tween.kill === 'function') {
                this.tween.kill();
            }
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
        }
    }

    // Auto-init helper
    document.addEventListener('DOMContentLoaded', () => {
        const carouselEl = document.getElementById('haircut-depth-carousel');
        if (carouselEl && !carouselEl.dataset.initialized) {
            carouselEl.dataset.initialized = 'true';
            window.andyDepthCarousel = new DepthCarousel(carouselEl, {
                depth: 220,
                spread: 95,
                tilt: 22,
                tiltDirection: 'right',
                perspective: 1400,
                visibleCards: 4,
                falloff: 0.22,
                blur: 5,
                autoplay: true,
                autoplayDelay: 3400,
                loop: true
            });
        }
    });

    global.DepthCarousel = DepthCarousel;
})(typeof window !== 'undefined' ? window : this);
