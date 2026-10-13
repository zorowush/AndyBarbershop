/**
 * Polaroid Line Carousel — Andy Barbershop (Vanilla JS Engine)
 * Instant photos pegged to a sagging string with spring & swing physics
 */
(function () {
    'use strict';

    function clamp(v, a, b) {
        return Math.min(b, Math.max(a, v));
    }

    function stringY(x, w, y0, sag) {
        var t = clamp(x / w, 0, 1);
        return y0 + 4 * sag * t * (1 - t);
    }

    function springStep(x, v, target, dt, k) {
        if (k === undefined) k = 70;
        var c = 2 * Math.sqrt(k);
        var nv = v + (k * (target - x) - c * v) * dt;
        return [x + nv * dt, nv];
    }

    function swingStep(a, w, lineVel, dt, gain) {
        var nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt;
        return [clamp(a + nw * dt, -0.6, 0.6), nw];
    }

    function nearestAt(off, spacing, n) {
        return clamp(Math.round(off / spacing), 0, Math.max(0, n - 1));
    }

    function pad2(n) {
        return n < 10 ? '0' + n : String(n);
    }

    function initPolaroidCarousel() {
        var root = document.getElementById('polaroid-line-carousel');
        if (!root) return;

        var pathEl = root.querySelector('.pl-string path');
        var cards = Array.from(root.querySelectorAll('.pl-card'));
        var n = cards.length;
        if (n === 0) return;

        var titleEl = root.querySelector('.pl-title');
        var subEl = root.querySelector('.pl-sub');
        var countEl = root.querySelector('.pl-count');
        var prevBtn = root.querySelector('.pl-btn-prev');
        var nextBtn = root.querySelector('.pl-btn-next');
        var bookCta = root.querySelector('.pl-book-cta');

        var sag = 46;
        var swing = 1;
        var autoplayMs = 4500;
        var stringColor = '#af804d';

        var activeIndex = 0;
        var dragging = false;
        var size = { w: 1200, h: 620, cw: 280 };
        var spacing = size.cw * 1.08;

        var sim = {
            off: 0,
            vel: 0,
            target: 0,
            a: new Array(n).fill(0),
            w: new Array(n).fill(0)
        };

        var drag = null;
        var lastInteraction = performance.now();
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function updateCardData(index) {
            var activeCard = cards[index];
            if (!activeCard) return;

            var title = activeCard.getAttribute('data-title') || '';
            var caption = activeCard.getAttribute('data-caption') || '';

            if (titleEl) titleEl.textContent = title;
            if (subEl) subEl.textContent = caption;
            if (countEl) {
                countEl.innerHTML = '<b>' + pad2(index + 1) + '</b> / ' + pad2(n);
            }
            if (bookCta) {
                bookCta.setAttribute('data-model', title);
            }
        }

        function updateDimensions() {
            var rect = root.getBoundingClientRect();
            var cw = Math.round(Math.max(160, Math.min(290, rect.width * 0.42, rect.height * 0.48)));
            size = { w: rect.width, h: rect.height, cw: cw };
            spacing = size.cw * 1.08;
            root.style.setProperty('--pl-cw', cw + 'px');
            sim.target = activeIndex * spacing;
            sim.off = activeIndex * spacing;
        }

        updateDimensions();

        if (window.ResizeObserver) {
            var ro = new ResizeObserver(function () {
                updateDimensions();
            });
            ro.observe(root);
        } else {
            window.addEventListener('resize', updateDimensions);
        }

        function goTo(index) {
            sim.target = clamp(index, 0, n - 1) * spacing;
        }

        function step(dir) {
            lastInteraction = performance.now();
            goTo(clamp(activeIndex + dir, 0, n - 1));
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                step(-1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                step(1);
            });
        }

        // Pointer drag & click
        root.addEventListener('pointerdown', function (e) {
            if (e.target.closest('.pl-bar')) return;
            lastInteraction = performance.now();
            drag = {
                x: e.clientX,
                off: sim.off,
                lx: e.clientX,
                lt: e.timeStamp,
                v: 0,
                moved: false
            };
        });

        root.addEventListener('pointermove', function (e) {
            if (!drag) return;
            var dx = e.clientX - drag.x;
            if (!drag.moved && Math.abs(dx) > 5) {
                drag.moved = true;
                dragging = true;
                root.setAttribute('data-drag', '1');
                try {
                    root.setPointerCapture(e.pointerId);
                } catch (err) {}
            }
            if (!drag.moved) return;

            var dt = Math.max(1, e.timeStamp - drag.lt);
            drag.v = 0.7 * ((e.clientX - drag.lx) / dt) + 0.3 * drag.v;
            drag.lx = e.clientX;
            drag.lt = e.timeStamp;

            var max = (n - 1) * spacing;
            var off = drag.off - dx;
            if (off < 0) off *= 0.35;
            if (off > max) off = max + (off - max) * 0.35;
            sim.off = off;
        });

        function handlePointerUp(e) {
            if (!drag) return;
            var d = drag;
            drag = null;
            lastInteraction = performance.now();

            if (d.moved) {
                dragging = false;
                root.setAttribute('data-drag', '0');
                sim.vel = -d.v * 1000;
                goTo(nearestAt(sim.off - d.v * 180, spacing, n));
                return;
            }

            var clickedCard = e.target.closest('.pl-card');
            if (clickedCard) {
                var idx = Number(clickedCard.getAttribute('data-i'));
                if (!isNaN(idx)) goTo(idx);
            }
        }

        root.addEventListener('pointerup', handlePointerUp);
        root.addEventListener('pointercancel', handlePointerUp);

        // Keyboard navigation
        root.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') {
                step(1);
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                step(-1);
                e.preventDefault();
            }
        });

        // Autoplay loop
        setInterval(function () {
            if (document.hidden || drag || performance.now() - lastInteraction < autoplayMs) return;
            var next = activeIndex >= n - 1 ? 0 : activeIndex + 1;
            goTo(next);
        }, autoplayMs);

        // Physics animation loop via requestAnimationFrame
        var prevTime = performance.now();
        var isVisible = true;

        function animateFrame(now) {
            if (!isVisible) {
                requestAnimationFrame(animateFrame);
                return;
            }

            var dt = Math.min(0.033, (now - prevTime) / 1000);
            prevTime = now;

            var w = size.w;
            var h = size.h;
            var cw = size.cw;
            var y0 = Math.max(45, h * 0.18);
            var lineVel;

            if (drag && drag.moved) {
                lineVel = drag.v * 1000;
            } else {
                var before = sim.off;
                var res = springStep(sim.off, sim.vel, sim.target, dt);
                sim.off = res[0];
                sim.vel = res[1];
                lineVel = -(sim.off - before) / Math.max(dt, 0.001);
            }

            var g = reduceMotion ? 0 : swing;
            var near = nearestAt(sim.off, spacing, n);

            for (var i = 0; i < n; i++) {
                var card = cards[i];
                if (!card) continue;

                var x = w / 2 + i * spacing - sim.off;
                if (x < -cw * 1.5 || x > w + cw * 1.5) {
                    card.style.visibility = 'hidden';
                    continue;
                }
                card.style.visibility = 'visible';

                var a = sim.a[i] || 0;
                var av = sim.w[i] || 0;
                var sres = swingStep(a, av, lineVel, dt, g);
                a = sres[0];
                av = sres[1];

                // Soft ambient breeze swaying
                if (g) a += Math.sin(now / 1300 + i * 1.7) * 0.0009 * g;

                sim.a[i] = a;
                sim.w[i] = av;

                var y = stringY(x, w, y0, sag) - 6;
                card.style.transform = 'translate(' + (x - cw / 2).toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + a.toFixed(4) + 'rad)';
                card.style.zIndex = String(i === near ? n + 2 : n - Math.abs(i - near));
                card.setAttribute('data-on', i === near ? '1' : '0');
            }

            if (pathEl) {
                pathEl.setAttribute('d', 'M0 ' + y0 + ' Q' + (w / 2) + ' ' + (y0 + 2 * sag) + ' ' + w + ' ' + y0);
            }

            if (near !== activeIndex) {
                activeIndex = near;
                updateCardData(near);
            }

            requestAnimationFrame(animateFrame);
        }

        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                isVisible = entries[0].isIntersecting;
            });
            io.observe(root);
        }

        updateCardData(0);
        requestAnimationFrame(animateFrame);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPolaroidCarousel);
    } else {
        initPolaroidCarousel();
    }
})();
