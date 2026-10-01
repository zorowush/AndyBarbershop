/**
 * Andy Barbershop - Custom Interactive Logic
 * WhatsApp Booking Generator, Dynamic Schedule & Live Open Status
 */

(function($) {
    "use strict";

    // Official WhatsApp Number from PRD
    const ANDY_WA_NUMBER = "6289690752162";

    // Operational Schedules (0: Minggu, 1: Senin, ..., 6: Sabtu)
    const SCHEDULES = {
        0: { name: "Minggu", openHour: 12, closeHour: 23, text: "12:00 - 23:00 WIB" },
        1: { name: "Senin", openHour: 19, closeHour: 22, text: "19:00 - 22:00 WIB" },
        2: { name: "Selasa", openHour: 19, closeHour: 22, text: "19:00 - 22:00 WIB" },
        3: { name: "Rabu", openHour: 19, closeHour: 22, text: "19:00 - 22:00 WIB" },
        4: { name: "Kamis", openHour: 19, closeHour: 23, text: "19:00 - 23:00 WIB" },
        5: { name: "Jumat", openHour: 19, closeHour: 22, text: "19:00 - 22:00 WIB" },
        6: { name: "Sabtu", openHour: 15, closeHour: 23, text: "15:00 - 23:00 WIB" }
    };

    $(document).ready(function() {
        initDynamicSchedule();
        initBookingModal();
        initContactForm();
        initScrollSpy();
    });

    /**
     * Scroll Spy: Automatically highlight active nav item based on scroll position.
     * Only works on index.html where sections use anchor IDs (#about, #services, etc.).
     */
    function initScrollSpy() {
        // Only run on pages with anchor-based navigation (index.html)
        var navLinks = $('#navigation li a[href^="#"]');
        if (navLinks.length === 0) return;

        // Map of nav link href → corresponding section element
        var sections = [];
        navLinks.each(function() {
            var href = $(this).attr('href');
            var target = $(href);
            if (target.length) {
                sections.push({ link: $(this).parent('li'), target: target });
            }
        });

        if (sections.length === 0) return;

        var headerHeight = 100; // offset for sticky header

        $(window).on('scroll', function() {
            var scrollPos = $(window).scrollTop() + headerHeight + 10;

            // Find which section is currently in view
            var currentSection = null;
            for (var i = sections.length - 1; i >= 0; i--) {
                if (sections[i].target.offset().top <= scrollPos) {
                    currentSection = sections[i];
                    break;
                }
            }

            // Update active class
            if (currentSection) {
                navLinks.parent('li').removeClass('active');
                currentSection.link.addClass('active');
            }
        });

        // Also handle smooth scroll when clicking nav links
        navLinks.on('click', function(e) {
            var href = $(this).attr('href');
            if (href === '#home') {
                e.preventDefault();
                $('html, body').animate({ scrollTop: 0 }, 600);
                return;
            }
            var target = $(href);
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - headerHeight + 10
                }, 600);
            }
        });
    }

    /**
     * FR-04: Deteksi Jam Operasional Hari Ini & Penanda Visual
     */
    function initDynamicSchedule() {
        const now = new Date();
        const todayIndex = now.getDay();
        const currentHour = now.getHours();
        const todaySchedule = SCHEDULES[todayIndex];

        // Highlight today in schedule table
        $(`.schedule-row[data-day="${todayIndex}"]`).addClass('today-highlight');
        $(`.schedule-row[data-day="${todayIndex}"] .day-name`).append('<span class="today-tag">HARI INI</span>');

        // Check if currently open
        const isOpen = (currentHour >= todaySchedule.openHour && currentHour < todaySchedule.closeHour);
        const statusContainer = $('#live-status-container');
        const heroStatusBadge = $('#hero-schedule-badge');

        if (statusContainer.length > 0) {
            if (isOpen) {
                statusContainer.html(`
                    <div class="live-status-pill live-status-open">
                        <span class="status-dot pulse-green"></span>
                        <strong>BUKA SEKARANG</strong> (Tutup jam ${todaySchedule.closeHour}:00 WIB)
                    </div>
                `);
            } else {
                statusContainer.html(`
                    <div class="live-status-pill live-status-closed">
                        <span class="status-dot pulse-red"></span>
                        <strong>SEDANG TUTUP</strong> • Hari ini buka: ${todaySchedule.text}
                    </div>
                `);
            }
        }

        if (heroStatusBadge.length > 0) {
            heroStatusBadge.text(`Hari ini (${todaySchedule.name}): ${todaySchedule.text}`);
        }
    }

    /**
     * FR-02 & FR-03: Modal WhatsApp Reservation Generator
     */
    function initBookingModal() {
        // Set default date to today in datepicker input
        const todayStr = new Date().toISOString().split('T')[0];
        $('#booking-date').val(todayStr);

        // Prefill service on click from service cards
        $(document).on('click', '.btn-choose-service', function(e) {
            e.preventDefault();
            const serviceName = $(this).data('service');
            if (serviceName) {
                $('#booking-service').val(serviceName);
                if ($.fn.niceSelect) {
                    $('#booking-service').niceSelect('update');
                }
            }
            $('#bookingModal').modal('show');
        });

        // Open modal from header or hero CTA
        $(document).on('click', '.btn-open-booking', function(e) {
            e.preventDefault();
            $('#bookingModal').modal('show');
        });

        // Submit WhatsApp Booking Form
        $('#waBookingForm').on('submit', function(e) {
            e.preventDefault();

            const name = $('#booking-name').val().trim();
            const service = $('#booking-service').val();
            const date = $('#booking-date').val();
            const time = $('#booking-time').val();
            const notes = $('#booking-notes').val().trim();

            if (!name) {
                alert('Silakan masukkan nama Anda terlebih dahulu.');
                $('#booking-name').focus();
                return;
            }

            // Construct payload according to PRD Section 9
            let message = `Halo Andy Barbershop, saya ingin booking antrean cukur:\n\n`;
            message += `• Nama: ${name}\n`;
            message += `• Layanan: ${service}\n`;
            message += `• Tanggal: ${date}\n`;
            message += `• Estimasi Jam: ${time}\n`;
            if (notes) {
                message += `• Catatan / Model: ${notes}\n`;
            }
            message += `\nMohon infokan ketersediaan slotnya. Terima kasih!`;

            const waUrl = `https://wa.me/${ANDY_WA_NUMBER}?text=${encodeURIComponent(message)}`;

            // Close modal & open WhatsApp
            $('#bookingModal').modal('hide');
            window.open(waUrl, '_blank');
        });
    }

    /**
     * Contact Form Submission without PHP (Direct WhatsApp Gateway)
     */
    function initContactForm() {
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            const name = $('#name').val() ? $('#name').val().trim() : '';
            const email = $('#email').val() ? $('#email').val().trim() : '';
            const subject = $('#subject').val() ? $('#subject').val().trim() : '';
            const message = $('#message').val() ? $('#message').val().trim() : '';

            if (!name || !message) {
                alert('Mohon isi nama dan pesan Anda.');
                return;
            }

            let waText = `Halo Andy Barbershop, pesan dari Website:\n\n`;
            waText += `• Nama: ${name}\n`;
            if (email) waText += `• Email: ${email}\n`;
            if (subject) waText += `• Subjek: ${subject}\n`;
            waText += `• Pesan: ${message}\n`;

            const waUrl = `https://wa.me/${ANDY_WA_NUMBER}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
        });
    }

})(jQuery);
