
$(document).ready(function() {

    const toggleSpeed = {
        fast: 250,
        medium: 400,
        slow: 600
    };


    $('#menuToggle').on('click', function() {
        const $nav = $('#primaryNav');

        $nav.slideToggle(toggleSpeed.medium, function() {
            const isOpen = $nav.is(':visible');
            $('#menuToggle').attr('aria-expanded', isOpen ? 'true' : 'false');
            $('#menuToggle').text(isOpen ? '✕' : '☰');
            $nav.toggleClass('open', isOpen);
        });
    });

    $('#primaryNav a').on('click', function() {
        if ($(window).width() <= 700) {
            $('#primaryNav').slideToggle(toggleSpeed.fast);
            $('#menuToggle').text('☰').attr('aria-expanded', 'false');
            $('#primaryNav').removeClass('open');
        }
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#primaryNav').is(':visible')) {
            $('#primaryNav').slideToggle(toggleSpeed.fast);
            $('#menuToggle').text('☰').attr('aria-expanded', 'false');
            $('#primaryNav').removeClass('open');
            $('#menuToggle').focus();
        }
    });


    $('#themeToggle').on('click', function() {
        const $body = $('body');
        const isDark = $body.attr('data-theme') === 'dark';

        $body.fadeToggle(toggleSpeed.fast, function() {
            $body.attr('data-theme', isDark ? 'light' : 'dark');
            $('#themeToggle').text(isDark ? '🌙' : '☀️');
            $body.fadeToggle(toggleSpeed.fast);
        });
    });


    $('.fav-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        const bikeId = $btn.attr('data-bike-id');

        $btn.fadeToggle(toggleSpeed.fast, function() {
            const isActive = $btn.hasClass('active');
            $btn.toggleClass('active');
            $btn.text(isActive ? '🤍' : '❤️');
            $btn.fadeToggle(toggleSpeed.fast);
        });

        updateFavBadgeToggle();
    });


    function updateFavBadgeToggle() {
        const $badge = $('#favBadge');
        const currentCount = parseInt($badge.text()) || 0;
        const newCount = $('.fav-btn.active').length;

        $badge.fadeToggle(toggleSpeed.fast, function() {
            $badge.text(newCount);
            if (newCount > 0) {
                $badge.css('display', 'flex');
            } else {
                $badge.hide();
            }
            if (newCount !== currentCount) {
                $badge.fadeToggle(toggleSpeed.fast);
            }
        });
    }


    $('#favBtn').on('click', function() {
        const $badge = $('#favBadge');
        $badge.fadeToggle(toggleSpeed.fast);
    });


    $('.note-box').on('click', function() {
        $(this).slideToggle(toggleSpeed.medium);
    });


    $('<button class="toggle-note-btn">ℹ️ Navigation Note</button>').insertBefore('.note-box');

    $('.toggle-note-btn').css({
        background: 'var(--white-subtle)',
        border: '1px solid var(--line)',
        color: 'var(--text-primary)',
        padding: '8px 14px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        marginTop: '12px',
        display: 'block',
        width: '100%',
        textAlign: 'left'
    });

    $('.note-box').hide();

    $('.toggle-note-btn').on('click', function() {
        $('.note-box').slideToggle(toggleSpeed.medium);
        const isVisible = $('.note-box').is(':visible');
        $(this).text(isVisible ? '✕ Close Note' : 'ℹ️ Navigation Note');
    });


    $('.search-container').on('click', function() {
        $('#searchBar').fadeToggle(toggleSpeed.fast, function() {
            if ($(this).is(':visible')) {
                $(this).focus();
            }
        });
    });

    $('#searchBar').on('click', function(e) {
        e.stopPropagation();
    });


    $('.location-select select').on('change', function() {
        const $status = $('#cityStatus');
        $status.fadeToggle(toggleSpeed.fast, function() {
            $status.fadeToggle(toggleSpeed.fast);
        });
    });


    $('<button class="toggle-location-btn">📍 Show / Hide City Selector</button>').insertBefore('.location-select');

    $('.toggle-location-btn').css({
        background: 'var(--white-subtle)',
        border: '1px solid var(--line)',
        color: 'var(--kawa-green-2)',
        padding: '8px 14px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        marginTop: '12px',
        marginBottom: '8px',
        display: 'block',
        width: '100%',
        textAlign: 'left',
        fontWeight: '600'
    });

    $('.toggle-location-btn').on('click', function() {
        $('.location-select').slideToggle(toggleSpeed.medium);
        $(this).text(
            $('.location-select').is(':visible')
                ? '📍 Show / Hide City Selector'
                : '📍 Show City Selector'
        );
    });


    $('.bike-row figure').on('click', function() {
        const $caption = $(this).find('figcaption');
        $caption.slideToggle(toggleSpeed.medium);
    });


    $('<button class="toggle-bikes-btn">🏍️ Show / Hide Bikes</button>').insertBefore('.bike-row');

    $('.toggle-bikes-btn').css({
        background: 'linear-gradient(135deg, rgba(0,177,64,0.75), rgba(0,217,87,0.35))',
        border: '1px solid rgba(0,217,87,0.6)',
        color: '#fff',
        padding: '10px 18px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
    });

    $('.toggle-bikes-btn').on('click', function() {
        $('.bike-row').slideToggle(toggleSpeed.medium);
        const isVisible = $('.bike-row').is(':visible');
        $(this).text(isVisible ? '🏍️ Show / Hide Bikes' : '🏍️ Show Bikes');
    });


    $('<button class="toggle-lists-btn">📋 Show / Hide Lists</button>').prependTo('.card.span-5');

    $('.toggle-lists-btn').css({
        background: 'var(--white-subtle)',
        border: '1px solid var(--line)',
        color: 'var(--text-primary)',
        padding: '8px 14px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        marginBottom: '12px',
        display: 'block',
        width: '100%',
        textAlign: 'left',
        fontWeight: '600'
    });

    $('.card.span-5 section').hide();

    $('.toggle-lists-btn').on('click', function() {
        $('.card.span-5 section').slideToggle(toggleSpeed.medium);
        const isVisible = $('.card.span-5 section').is(':visible');
        $(this).text(isVisible ? '📋 Hide Lists' : '📋 Show Lists');
    });


    $('<button class="toggle-quick-btn">🔗 Quick Links</button>').insertBefore('.quick-links');

    $('.toggle-quick-btn').css({
        background: 'var(--white-subtle)',
        border: '1px solid var(--line)',
        color: 'var(--text-primary)',
        padding: '6px 12px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        marginTop: '12px',
        display: 'inline-block'
    });

    $('.quick-links').hide();

    $('.toggle-quick-btn').on('click', function() {
        $('.quick-links').slideToggle(toggleSpeed.medium);
        $(this).text(
            $('.quick-links').is(':visible') ? '🔗 Hide Links' : '🔗 Quick Links'
        );
    });


    $('#lightbox').on('click', function(e) {
        if (e.target === this) {
            $(this).fadeToggle(toggleSpeed.medium, function() {
                if (!$(this).is(':visible')) {
                    $('#lightboxImage').attr('src', '');
                    $('body').css('overflow', '');
                }
            });
        }
    });

    $('#lightboxClose').on('click', function() {
        $('#lightbox').fadeToggle(toggleSpeed.medium, function() {
            $('#lightboxImage').attr('src', '');
            $('body').css('overflow', '');
        });
    });

    $('.lightbox-trigger').on('click', function(e) {
        if ($(this).is('img')) {
            e.preventDefault();
            e.stopPropagation();
            $('#lightboxImage').attr({
                src: $(this).attr('src'),
                alt: $(this).attr('alt')
            });
            $('#lightbox').css('display', 'flex').hide().fadeToggle(toggleSpeed.medium);
            $('body').css('overflow', 'hidden');
        }
    });


    const $backToTop = $('#backToTop');
    $backToTop.hide();

    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 400) {
            $backToTop.fadeIn(toggleSpeed.fast);
        } else {
            $backToTop.fadeOut(toggleSpeed.fast);
        }
    });

    $backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, toggleSpeed.slow);
    });


    $('.footer-links a').on('click', function() {
        $(this).fadeToggle(100, function() {
            $(this).fadeToggle(100);
        });
    });


    $('nav a').on('mouseenter', function() {
        $(this).stop(true).fadeTo(toggleSpeed.fast, 0.75);
    }).on('mouseleave', function() {
        $(this).stop(true).fadeTo(toggleSpeed.fast, 1);
    });


    function createToastToggle(message) {
        const $existing = $('.toast');
        if ($existing.length) {
            $existing.fadeToggle(toggleSpeed.fast, function() {
                $(this).remove();
                showNewToast(message);
            });
        } else {
            showNewToast(message);
        }
    }

    function showNewToast(message) {
        const $toast = $('<div class="toast"></div>').text(message);
        $('body').append($toast);
        $toast.fadeToggle(toggleSpeed.fast);
        setTimeout(function() {
            $toast.fadeToggle(toggleSpeed.fast, function() {
                $(this).remove();
            });
        }, 3000);
    }


    $(document).on('keydown', function(e) {
        if (e.target.matches('input, textarea, select')) return;

        if (e.key === 't' || e.key === 'T') {
            if (e.altKey) {
                $('#themeToggle').trigger('click');
            }
        }

        if (e.key === 'm' || e.key === 'M') {
            if (e.altKey) {
                $('#menuToggle').trigger('click');
            }
        }

        if (e.key === 'b' || e.key === 'B') {
            if (e.altKey) {
                $('.toggle-bikes-btn').trigger('click');
            }
        }
    });


    console.log('✓ Toggle Effects Initialized');

});