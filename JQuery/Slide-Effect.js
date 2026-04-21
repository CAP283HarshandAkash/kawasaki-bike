$(document).ready(function() {

    const slideSpeed = {
        fast: 250,
        medium: 400,
        slow: 600
    };


    $('#menuToggle').on('click', function() {
        const $nav = $('#primaryNav');
        const isOpen = $nav.hasClass('open');

        if (isOpen) {
            $nav.slideUp(slideSpeed.medium, function() {
                $nav.removeClass('open');
            });
            $(this).attr('aria-expanded', 'false');
            $(this).text('☰');
        } else {
            $nav.slideDown(slideSpeed.medium, function() {
                $nav.addClass('open');
            });
            $(this).attr('aria-expanded', 'true');
            $(this).text('✕');
        }
    });


    $('#primaryNav a').on('click', function() {
        if ($('#primaryNav').hasClass('open')) {
            $('#primaryNav').slideUp(slideSpeed.fast, function() {
                $(this).removeClass('open');
                $('#menuToggle').attr('aria-expanded', 'false');
                $('#menuToggle').text('☰');
            });
        }
    });


    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#primaryNav').hasClass('open')) {
            $('#primaryNav').slideUp(slideSpeed.fast, function() {
                $(this).removeClass('open');
                $('#menuToggle').attr('aria-expanded', 'false').text('☰').focus();
            });
        }
    });


    $('.hero').hide().slideDown(slideSpeed.slow);


    $('.banner').hide();
    setTimeout(function() {
        $('.banner').slideDown(slideSpeed.slow);
    }, 600);


    function isInViewport($el) {
        if (!$el.length) return false;
        const top = $el.offset().top;
        const bottom = top + $el.outerHeight();
        const vtop = $(window).scrollTop();
        const vbottom = vtop + $(window).height();
        return bottom > vtop && top < (vbottom - 80);
    }


    $('.grid .card').hide();

    function revealCards() {
        $('.grid .card').each(function(i) {
            const $card = $(this);
            if (isInViewport($card) && !$card.is(':visible')) {
                setTimeout(function() {
                    $card.slideDown(slideSpeed.medium);
                }, i * 180);
            }
        });
    }

    $(window).on('scroll', revealCards);
    revealCards();


    $('.bike-row figure').each(function(i) {
        const $fig = $(this);
        $fig.hide();
        setTimeout(function() {
            if (isInViewport($fig)) {
                $fig.slideDown(slideSpeed.medium);
            }
        }, 300 + i * 120);
    });

    function revealFigures() {
        $('.bike-row figure').each(function() {
            const $fig = $(this);
            if (isInViewport($fig) && !$fig.is(':visible')) {
                $fig.slideDown(slideSpeed.medium);
            }
        });
    }

    $(window).on('scroll', revealFigures);


    $('.note-box').hide();
    setTimeout(function() {
        $('.note-box').slideDown(slideSpeed.medium);
    }, 2500);


    $('.cta').hide();
    setTimeout(function() {
        $('.cta').slideDown(slideSpeed.medium);
    }, 400);


    $('.search-container').hide();
    setTimeout(function() {
        $('.search-container').slideDown(slideSpeed.medium);
    }, 700);


    $('.location-select').hide();
    setTimeout(function() {
        $('.location-select').slideDown(slideSpeed.medium);
    }, 950);


    $('#city').on('change', function() {
        const $status = $('#cityStatus');
        $status.slideUp(slideSpeed.fast, function() {
            $(this).slideDown(slideSpeed.fast);
        });
    });


    const $backToTop = $('#backToTop');
    $backToTop.hide();

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 400) {
            $backToTop.slideDown(slideSpeed.fast);
        } else {
            $backToTop.slideUp(slideSpeed.fast);
        }
    });

    $backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, slideSpeed.slow);
    });


    function createToastSlide(message) {
        const $toast = $('<div class="toast"></div>').text(message);
        $('body').append($toast);
        $toast.slideDown(slideSpeed.fast);
        setTimeout(function() {
            $toast.slideUp(slideSpeed.fast, function() {
                $(this).remove();
            });
        }, 3000);
    }


    if ($('.lightbox').length) {
        $('.lightbox-trigger').on('click', function(e) {
            if ($(this).is('img')) {
                e.preventDefault();
                e.stopPropagation();

                const src = $(this).attr('src');
                const alt = $(this).attr('alt');

                $('#lightboxImage').attr({ src: src, alt: alt });

                $('#lightbox').css('display', 'flex').hide().slideDown(slideSpeed.medium);
                $('body').css('overflow', 'hidden');
            }
        });

        $('#lightboxClose, #lightbox').on('click', function(e) {
            if (e.target === this) {
                $('#lightbox').slideUp(slideSpeed.medium, function() {
                    $('#lightboxImage').attr('src', '');
                    $('body').css('overflow', '');
                });
            }
        });
    }


    $('.fav-header-btn').on('click', function() {
        const $badge = $('#favBadge');
        if ($badge.is(':visible')) {
            $badge.slideUp(slideSpeed.fast);
        } else {
            $badge.slideDown(slideSpeed.fast);
        }
    });


    $('.footer-links').hide();
    setTimeout(function() {
        $('.footer-links').slideDown(slideSpeed.medium);
    }, 1000);


    console.log('✓ Slide Effects Initialized');

});