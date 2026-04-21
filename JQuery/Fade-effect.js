/**
 * ============================================
 * FADE EFFECTS FOR KAWASAKI WEBSITE
 * ============================================
 * Methods covered: fadeIn, fadeOut, fadeToggle, fadeTo
 */

$(document).ready(function() {

    // ========================================
    // CONFIGURATION
    // ========================================
    
    const fadeSpeed = {
        fast: 300,
        medium: 600,
        slow: 800
    };

    
    // ========================================
    // 1. HERO SECTION - SEQUENTIAL FADE IN
    // ========================================
    
    // Hide elements initially (add to CSS or do it here)
    $('.hero h1, .hero > p, .cta, .search-container, .location-select').css('opacity', '0');
    
    // 1.1 Fade in Hero Title
    $('.hero h1').delay(200).animate({opacity: 1}, fadeSpeed.slow);
    
    // 1.2 Fade in Hero Paragraph (after title)
    $('.hero > p').delay(1000).animate({opacity: 1}, fadeSpeed.medium);
    
    // 1.3 Fade in CTA buttons (staggered)
    $('.cta .btn').each(function(index) {
        $(this).delay(1400 + (index * 150)).animate({opacity: 1}, fadeSpeed.fast);
    });
    
    // 1.4 Fade in Search Bar
    $('.search-container').delay(2000).animate({opacity: 1}, fadeSpeed.fast);
    
    // 1.5 Fade in City Selector
    $('.location-select').delay(2300).animate({opacity: 1}, fadeSpeed.fast);

    
    // ========================================
    // 2. TOAST NOTIFICATIONS - FADE IN/OUT
    // ========================================
    
    // Enhanced toast function with fade
    function showToastWithFade(message) {
        // Create toast element
        const $toast = $('<div class="toast"></div>').text(message);
        $('body').append($toast);
        
        // Fade in
        $toast.fadeIn(fadeSpeed.fast);
        
        // Fade out and remove after 3 seconds
        setTimeout(function() {
            $toast.fadeOut(fadeSpeed.fast, function() {
                $(this).remove();
            });
        }, 3000);
    }
    
    // Example usage - replace existing toast calls
    // showToastWithFade('🏍️ Welcome to Kawasaki Bikes!');

    
    // ========================================
    // 3. LIGHTBOX - FADE IN/OUT
    // ========================================
    
    // 3.1 Open Lightbox with Fade
    $('.lightbox-trigger').on('click', function(e) {
        // Only for images, not parent links
        if ($(this).is('img')) {
            e.preventDefault();
            e.stopPropagation();
            
            const imgSrc = $(this).attr('src');
            const imgAlt = $(this).attr('alt');
            
            // Set image
            $('#lightboxImage').attr('src', imgSrc).attr('alt', imgAlt);
            
            // Fade in lightbox
            $('#lightbox').fadeIn(fadeSpeed.fast, function() {
                // Fade in image after background
                $('#lightboxImage').hide().fadeIn(fadeSpeed.medium);
            });
            
            // Prevent body scroll
            $('body').css('overflow', 'hidden');
        }
    });
    
    // 3.2 Close Lightbox with Fade
    $('#lightboxClose, #lightbox').on('click', function(e) {
        if (e.target === this) {
            $('#lightbox').fadeOut(fadeSpeed.fast, function() {
                $('#lightboxImage').attr('src', '');
                $('body').css('overflow', '');
            });
        }
    });
    
    // Close on Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#lightbox').is(':visible')) {
            $('#lightbox').fadeOut(fadeSpeed.fast, function() {
                $('#lightboxImage').attr('src', '');
                $('body').css('overflow', '');
            });
        }
    });

    
    // ========================================
    // 4. PRICE TAGS - FADE OUT/IN ON UPDATE
    // ========================================
    
    // Enhanced city selector with fade
    $('#city').on('change', function() {
        const city = $(this).val();
        
        if (!city) {
            // Reset prices with fade
            $('.price-tag').fadeOut(fadeSpeed.fast, function() {
                $(this).text('Select City').removeClass('updated');
            }).fadeIn(fadeSpeed.fast);
            
            $('#cityStatus')
                .fadeOut(fadeSpeed.fast, function() {
                    $(this).text('Select a city to see estimated on-road prices.')
                           .removeClass('active');
                })
                .fadeIn(fadeSpeed.fast);
            return;
        }
        
        // Price data (matching your existing data)
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
        
        const data = PRICE_DATA[city];
        
        if (data) {
            // Fade out all price tags
            $('.price-tag').fadeOut(fadeSpeed.fast, function() {
                // Update text while hidden
                $('#zx10r-price').text(data.zx10r);
                $('#z900-price').text(data.z900);
                $('#versys-price').text(data.versys);
                $('#vulcan-price').text(data.vulcan);
                $('#klr-price').text(data.klr);
                
                // Add updated class
                $('.price-tag').addClass('updated');
                
                // Fade back in
                $('.price-tag').fadeIn(fadeSpeed.fast);
            });
            
            // Update city status with fade
            $('#cityStatus').fadeOut(fadeSpeed.fast, function() {
                $(this).text(`Showing estimated on-road prices for ${city}.`)
                       .addClass('active')
                       .fadeIn(fadeSpeed.fast);
            });
            
            // Show toast notification
            showToastWithFade(`📍 Prices updated for ${city}`);
        }
    });

    
    // ========================================
    // 5. BACK TO TOP BUTTON - FADE IN/OUT
    // ========================================
    
    const $backToTop = $('#backToTop');
    
    // Initially hide
    $backToTop.hide();
    
    // Show/hide on scroll
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 400) {
            $backToTop.fadeIn(fadeSpeed.fast);
        } else {
            $backToTop.fadeOut(fadeSpeed.fast);
        }
    });
    
    // Smooth scroll to top on click
    $backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, fadeSpeed.slow);
    });

    
    // ========================================
    // 6. BIKE CARDS - FADE IN ON SCROLL
    // ========================================
    
    // Initially hide bike cards
    $('.bike-row figure').css('opacity', '0');
    
    // Function to check if element is in viewport
    function isInViewport($element) {
        if (!$element.length) return false;
        
        const elementTop = $element.offset().top;
        const elementBottom = elementTop + $element.outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();
        
        return elementBottom > viewportTop && elementTop < (viewportBottom - 100);
    }
    
    // Fade in cards when scrolled into view
    function revealBikeCards() {
        $('.bike-row figure').each(function(index) {
            const $figure = $(this);
            
            if (isInViewport($figure) && $figure.css('opacity') == 0) {
                // Stagger each card
                $figure.delay(index * 100).animate({opacity: 1}, fadeSpeed.medium);
            }
        });
    }
    
    // Check on scroll
    $(window).on('scroll', function() {
        revealBikeCards();
    });
    
    // Check on page load
    revealBikeCards();

    
    // ========================================
    // 7. BANNER IMAGE - FADE IN
    // ========================================
    
    // Hide banner initially
    $('.banner').css('opacity', '0');
    
    // Fade in after hero section
    $('.banner').delay(1500).animate({opacity: 1}, fadeSpeed.slow);

    
    // ========================================
    // 8. CONTENT CARDS - FADE IN ON SCROLL
    // ========================================
    
    // Hide cards initially
    $('.grid .card').css('opacity', '0');
    
    function revealContentCards() {
        $('.grid .card').each(function(index) {
            const $card = $(this);
            
            if (isInViewport($card) && $card.css('opacity') == 0) {
                $card.delay(index * 200).animate({opacity: 1}, fadeSpeed.medium);
            }
        });
    }
    
    $(window).on('scroll', revealContentCards);
    revealContentCards();

    
    // ========================================
    // 9. FAVORITES BADGE - FADE IN
    // ========================================
    
    // When favorites count changes
    function updateFavoritesBadge(count) {
        const $badge = $('#favBadge');
        
        if (count > 0) {
            $badge.text(count).fadeIn(fadeSpeed.fast);
        } else {
            $badge.fadeOut(fadeSpeed.fast);
        }
    }
    
    // Example usage (integrate with your existing favorites system)
    // updateFavoritesBadge(3);

    
    // ========================================
    // 10. FADE TO (Partial Opacity)
    // ========================================
    
    // Hover effect on bike images - fade to 90% on hover
    $('.bike-row figure img').hover(
        function() {
            $(this).fadeTo(fadeSpeed.fast, 0.9);
        },
        function() {
            $(this).fadeTo(fadeSpeed.fast, 1);
        }
    );
    
    // Hover effect on buttons - subtle glow
    $('.btn').hover(
        function() {
            $(this).fadeTo(200, 0.85);
        },
        function() {
            $(this).fadeTo(200, 1);
        }
    );


    
    $('#searchBar').on('focus', function() {
        $(this).parent('.search-container').fadeTo(200, 1);
    }).on('blur', function() {
        if (!$(this).val()) {
            $(this).parent('.search-container').fadeTo(200, 0.85);
        }
    });

    
    // ========================================
    // 12. NOTE BOX - FADE IN
    // ========================================
    
    $('.note-box').hide().delay(3000).fadeIn(fadeSpeed.medium);

    
    // ========================================
    // CONSOLE LOG
    // ========================================
    
    console.log('✓ Fade Effects Initialized');
    
});