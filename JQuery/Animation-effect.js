

$(document).ready(function() {

    const animateSpeed = {
        fast: 200,
        medium: 400,
        slow: 600,
        verySlow: 900
    };

    $('.hero h1').css({ opacity: 0, marginTop: '40px' });
    $('.hero > p').css({ opacity: 0, marginTop: '20px' });
    $('.cta').css({ opacity: 0 });
    $('.search-container').css({ opacity: 0 });
    $('.location-select').css({ opacity: 0 });


    $('.hero h1')
        .delay(200)
        .animate(
            { opacity: 1, marginTop: '0px' },
            {
                duration: animateSpeed.slow,
                easing: 'swing',
                complete: function() {
                    $('.hero > p').animate(
                        { opacity: 1, marginTop: '0px' },
                        {
                            duration: animateSpeed.medium,
                            complete: function() {
                                $('.cta').animate(
                                    { opacity: 1 },
                                    {
                                        duration: animateSpeed.medium,
                                        complete: function() {
                                            $('.search-container').animate(
                                                { opacity: 1 },
                                                {
                                                    duration: animateSpeed.fast,
                                                    complete: function() {
                                                        $('.location-select').animate(
                                                            { opacity: 1 },
                                                            animateSpeed.fast
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );




    $('.cta .btn').each(function(index) {
        $(this).css({ opacity: 0, marginLeft: '20px' });
        $(this).delay(1200 + index * 150).animate(
            { opacity: 1, marginLeft: '0px' },
            animateSpeed.medium
        );
    });


    $('.btn').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '22px', paddingRight: '22px' },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '18px', paddingRight: '18px' },
            animateSpeed.fast
        );
    });


    $('.btn.primary').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            {
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: '14px',
                paddingBottom: '14px'
            },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            {
                paddingLeft: '18px',
                paddingRight: '18px',
                paddingTop: '12px',
                paddingBottom: '12px'
            },
            animateSpeed.fast
        );
    });

    $('.banner').css({ opacity: 0, marginTop: '30px' });
    $('.banner').delay(800).animate(
        { opacity: 1, marginTop: '18px' },
        {
            duration: animateSpeed.slow,
            easing: 'swing'
        }
    );


    $('.banner').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { marginTop: '14px' },
            animateSpeed.medium
        );
        $(this).find('img').stop(true, false).animate(
            { opacity: 0.92 },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { marginTop: '18px' },
            animateSpeed.medium
        );
        $(this).find('img').stop(true, false).animate(
            { opacity: 1 },
            animateSpeed.fast
        );
    });


    function isInViewport($el) {
        if (!$el.length) return false;
        const top = $el.offset().top;
        const bottom = top + $el.outerHeight();
        const vtop = $(window).scrollTop();
        const vbottom = vtop + $(window).height();
        return bottom > vtop && top < (vbottom - 60);
    }


    $('.bike-row figure').css({ opacity: 0, marginTop: '30px' });

    function animateBikeCards() {
        $('.bike-row figure').each(function(index) {
            const $fig = $(this);
            if (isInViewport($fig) && $fig.css('opacity') == 0) {
                $fig.delay(index * 100).animate(
                    { opacity: 1, marginTop: '0px' },
                    {
                        duration: animateSpeed.medium,
                        easing: 'swing'
                    }
                );
            }
        });
    }

    $(window).on('scroll', animateBikeCards);
    animateBikeCards();


    $('.bike-row figure').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { marginTop: '-6px' },
            animateSpeed.fast
        );
        $(this).find('.media img').stop(true, false).animate(
            { opacity: 0.88 },
            animateSpeed.fast
        );
        $(this).find('figcaption').stop(true, false).animate(
            { opacity: 0.75 },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { marginTop: '0px' },
            animateSpeed.fast
        );
        $(this).find('.media img').stop(true, false).animate(
            { opacity: 1 },
            animateSpeed.fast
        );
        $(this).find('figcaption').stop(true, false).animate(
            { opacity: 1 },
            animateSpeed.fast
        );
    });


    $('.fav-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        const isActive = $btn.hasClass('active');

        $btn.stop(true, false)
            .animate({ width: '42px', height: '42px' }, 100)
            .animate({ width: '36px', height: '36px' }, 100)
            .animate({ width: '40px', height: '40px' }, 80)
            .animate({ width: '36px', height: '36px' }, 80, function() {
                $btn.toggleClass('active');
                $btn.text(isActive ? '🤍' : '❤️');
            });
    });

    $('#city').on('change', function() {
        const city = $(this).val();

        const PRICE_DATA = {
            Delhi:      { zx10r: "₹21,00,000", z900: "₹10,00,000", versys: "₹8,80,000", vulcan: "₹8,30,000", klr: "₹2,10,000" },
            Mumbai:     { zx10r: "₹21,40,000", z900: "₹10,20,000", versys: "₹9,00,000", vulcan: "₹8,50,000", klr: "₹2,20,000" },
            Bangalore:  { zx10r: "₹21,50,000", z900: "₹10,30,000", versys: "₹9,10,000", vulcan: "₹8,60,000", klr: "₹2,25,000" },
            Chennai:    { zx10r: "₹21,30,000", z900: "₹10,15,000", versys: "₹8,95,000", vulcan: "₹8,45,000", klr: "₹2,18,000" },
            Hyderabad:  { zx10r: "₹21,20,000", z900: "₹10,10,000", versys: "₹8,85,000", vulcan: "₹8,35,000", klr: "₹2,12,000" },
            Kolkata:    { zx10r: "₹21,60,000", z900: "₹10,35,000", versys: "₹9,05,000", vulcan: "₹8,55,000", klr: "₹2,22,000" },
            Pune:       { zx10r: "₹21,35,000", z900: "₹10,18,000", versys: "₹8,90,000", vulcan: "₹8,40,000", klr: "₹2,15,000" },
            Ahmedabad:  { zx10r: "₹21,25,000", z900: "₹10,12,000", versys: "₹8,88,000", vulcan: "₹8,38,000", klr: "₹2,14,000" },
            Chandigarh: { zx10r: "₹21,10,000", z900: "₹10,05,000", versys: "₹8,82,000", vulcan: "₹8,32,000", klr: "₹2,11,000" },
            Jaipur:     { zx10r: "₹21,45,000", z900: "₹10,22,000", versys: "₹8,98,000", vulcan: "₹8,48,000", klr: "₹2,19,000" },
            Kochi:      { zx10r: "₹21,55,000", z900: "₹10,28,000", versys: "₹9,08,000", vulcan: "₹8,58,000", klr: "₹2,24,000" }
        };

        if (city && PRICE_DATA[city]) {
            const data = PRICE_DATA[city];

            $('.price-tag').each(function() {
                const $tag = $(this);
                $tag.animate({ opacity: 0 }, animateSpeed.fast, function() {
                    if ($tag.attr('id') === 'zx10r-price')  $tag.text(data.zx10r);
                    if ($tag.attr('id') === 'z900-price')   $tag.text(data.z900);
                    if ($tag.attr('id') === 'versys-price') $tag.text(data.versys);
                    if ($tag.attr('id') === 'vulcan-price') $tag.text(data.vulcan);
                    if ($tag.attr('id') === 'klr-price')    $tag.text(data.klr);
                    $tag.addClass('updated');
                    $tag.animate({ opacity: 1 }, animateSpeed.fast);
                });
            });

            $('#cityStatus')
                .animate({ opacity: 0 }, animateSpeed.fast, function() {
                    $(this)
                        .text(`Showing estimated on-road prices for ${city}.`)
                        .addClass('active')
                        .animate({ opacity: 1 }, animateSpeed.fast);
                });

        } else {
            $('.price-tag').animate({ opacity: 0 }, animateSpeed.fast, function() {
                $(this).text('Select City').removeClass('updated');
                $(this).animate({ opacity: 1 }, animateSpeed.fast);
            });

            $('#cityStatus').animate({ opacity: 0 }, animateSpeed.fast, function() {
                $(this)
                    .text('Select a city to see estimated on-road prices.')
                    .removeClass('active')
                    .animate({ opacity: 1 }, animateSpeed.fast);
            });
        }
    });

    $('#searchBar').on('focus', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '46px' },
            animateSpeed.fast
        );
    }).on('blur', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '40px' },
            animateSpeed.fast
        );
    });


    $('#searchBar').on('input', function() {
        const $bar = $(this);
        if ($bar.val().length > 0) {
            $bar.stop(true, false)
                .animate({ opacity: 0.85 }, 80)
                .animate({ opacity: 1 }, 80);
        }
    });


    $('.location-select select').on('change', function() {
        const $select = $(this);
        $select.stop(true, false)
            .animate({ opacity: 0.6 }, 100)
            .animate({ opacity: 1 }, 100)
            .animate({ opacity: 0.8 }, 100)
            .animate({ opacity: 1 }, 100);
    });


    $('.grid .card').css({ opacity: 0, marginTop: '30px' });

    function animateContentCards() {
        $('.grid .card').each(function(index) {
            const $card = $(this);
            if (isInViewport($card) && $card.css('opacity') == 0) {
                $card.delay(index * 200).animate(
                    { opacity: 1, marginTop: '0px' },
                    {
                        duration: animateSpeed.slow,
                        easing: 'swing'
                    }
                );
            }
        });
    }

    $(window).on('scroll', animateContentCards);
    animateContentCards();


    $('.card').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { marginTop: '-4px' },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { marginTop: '0px' },
            animateSpeed.fast
        );
    });

    $('nav a').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '18px', paddingRight: '18px' },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '14px', paddingRight: '14px' },
            animateSpeed.fast
        );
    });


    $('#menuToggle').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '16px', paddingRight: '16px' },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '12px', paddingRight: '12px' },
            animateSpeed.fast
        );
    });

    const $backToTop = $('#backToTop');
    $backToTop.css({ opacity: 0, bottom: '10px' });

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 400) {
            $backToTop.stop(true, false).animate(
                { opacity: 1, bottom: '24px' },
                animateSpeed.medium
            );
        } else {
            $backToTop.stop(true, false).animate(
                { opacity: 0, bottom: '10px' },
                animateSpeed.medium
            );
        }
    });


    $backToTop.on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { bottom: '28px', width: '48px', height: '48px' },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { bottom: '24px', width: '44px', height: '44px' },
            animateSpeed.fast
        );
    });


    $backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, animateSpeed.verySlow, 'swing');
    });

    $('.lightbox-trigger').on('click', function(e) {
        if ($(this).is('img')) {
            e.preventDefault();
            e.stopPropagation();

            const src = $(this).attr('src');
            const alt = $(this).attr('alt');

            $('#lightboxImage')
                .attr({ src: src, alt: alt })
                .css({ opacity: 0, marginTop: '30px' });

            $('#lightbox')
                .css('display', 'flex')
                .css('opacity', 0)
                .animate({ opacity: 1 }, animateSpeed.medium, function() {
                    $('#lightboxImage').animate(
                        { opacity: 1, marginTop: '0px' },
                        animateSpeed.medium
                    );
                });

            $('body').css('overflow', 'hidden');
        }
    });


    $('#lightboxClose').on('click', function() {
        closeLightboxAnimate();
    });

    $('#lightbox').on('click', function(e) {
        if (e.target === this) {
            closeLightboxAnimate();
        }
    });

    function closeLightboxAnimate() {
        $('#lightboxImage').animate(
            { opacity: 0, marginTop: '30px' },
            animateSpeed.fast,
            function() {
                $('#lightbox').animate(
                    { opacity: 0 },
                    animateSpeed.fast,
                    function() {
                        $(this).hide().css('opacity', '');
                        $('#lightboxImage')
                            .attr('src', '')
                            .css({ opacity: '', marginTop: '' });
                        $('body').css('overflow', '');
                    }
                );
            }
        );
    }


    $('#lightboxClose').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { width: '40px', height: '40px' },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { width: '36px', height: '36px' },
            animateSpeed.fast
        );
    });

    function showAnimatedToast(message) {
        $('.toast').stop(true).animate({ opacity: 0, bottom: '10px' }, animateSpeed.fast, function() {
            $(this).remove();
        });

        const $toast = $('<div class="toast"></div>').text(message);
        $('body').append($toast);

        $toast.css({ opacity: 0, bottom: '10px' });
        $toast.animate(
            { opacity: 1, bottom: '20px' },
            {
                duration: animateSpeed.medium,
                easing: 'swing'
            }
        );

        setTimeout(function() {
            $toast.animate(
                { opacity: 0, bottom: '10px' },
                {
                    duration: animateSpeed.fast,
                    complete: function() {
                        $(this).remove();
                    }
                }
            );
        }, 3000);
    }

    $('#themeToggle').on('click', function() {
        const $btn = $(this);
        $btn.stop(true, false)
            .animate({ opacity: 0, marginTop: '4px' }, animateSpeed.fast, function() {
                const isDark = $('body').attr('data-theme') === 'dark';
                $('body').attr('data-theme', isDark ? 'light' : 'dark');
                $btn.text(isDark ? '🌙' : '☀️');
                $btn.animate(
                    { opacity: 1, marginTop: '0px' },
                    animateSpeed.fast
                );
            });
    });

    let lastScrollTop = 0;

    $(window).on('scroll', function() {
        const currentScroll = $(this).scrollTop();

        if (currentScroll > lastScrollTop && currentScroll > 100) {
            $('header').stop(true, false).animate(
                { opacity: 0.92 },
                animateSpeed.fast
            );
        } else {
            $('header').stop(true, false).animate(
                { opacity: 1 },
                animateSpeed.fast
            );
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });


    $(window).on('scroll', function() {
        const scrollTop = $(this).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        $('#readingProgress').animate(
            { width: progress + '%' },
            { duration: 100, queue: false }
        );
    });


    $('footer').css({ opacity: 0, marginTop: '20px' });

    function animateFooter() {
        if (isInViewport($('footer')) && $('footer').css('opacity') == 0) {
            $('footer').animate(
                { opacity: 1, marginTop: '0px' },
                animateSpeed.slow
            );
        }
    }

    $(window).on('scroll', animateFooter);
    animateFooter();


    $('.footer-links a').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '4px' },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { paddingLeft: '0px' },
            animateSpeed.fast
        );
    });


    $('.brand').on('mouseenter', function() {
        $(this).find('img').stop(true, false).animate(
            { width: '48px', height: '48px' },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).find('img').stop(true, false).animate(
            { width: '44px', height: '44px' },
            animateSpeed.fast
        );
    });

    $('.card li').css({ opacity: 0, marginLeft: '10px' });

    function animateListItems() {
        $('.card li').each(function(index) {
            const $li = $(this);
            if (isInViewport($li) && $li.css('opacity') == 0) {
                $li.delay(index * 80).animate(
                    { opacity: 1, marginLeft: '0px' },
                    animateSpeed.medium
                );
            }
        });
    }

    $(window).on('scroll', animateListItems);
    animateListItems();


    $('.quick-links a').on('mouseenter', function() {
        $(this).stop(true, false).animate(
            { paddingBottom: '2px' },
            animateSpeed.fast
        );
    }).on('mouseleave', function() {
        $(this).stop(true, false).animate(
            { paddingBottom: '0px' },
            animateSpeed.fast
        );
    });

    $('header').css({ opacity: 0, marginTop: '-10px' });

    $('header').animate(
        { opacity: 1, marginTop: '0px' },
        {
            duration: animateSpeed.medium,
            complete: function() {
                $('.hero h1').animate(
                    { opacity: 1, marginTop: '0px' },
                    {
                        duration: animateSpeed.slow,
                        complete: function() {
                            $('.hero > p').animate(
                                { opacity: 1, marginTop: '0px' },
                                animateSpeed.medium
                            );
                            $('.cta').delay(200).animate(
                                { opacity: 1 },
                                animateSpeed.medium
                            );
                        }
                    }
                );
            }
        }
    );

    $(window).on('resize', function() {
        if ($(window).width() > 700) {
            $('#primaryNav').show().css('opacity', 1);
            $('#menuToggle').text('☰').attr('aria-expanded', 'false');
        }
    });


    console.log('✓ Custom Animation Effects Initialized');

});