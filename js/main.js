$('.menu').on('click', function() {
  $(this).toggleClass('active');
  $('.overlay').toggleClass('menu-open');
});


$('.nav a').on('click', function() {
  $('.menu').removeClass('active');
  $('.overlay').removeClass('menu-open');
});

// ===== Scroll to Top ====
$(window).scroll(function() {
    if ($(this).scrollTop() >= 500) {        // If page is scrolled more than 50px
        $('.back-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('.back-to-top').fadeOut(200);   // Else fade out the arrow
    }
});

$(function(){
    $('.back-to-top').on('click', function() {      // When arrow is clicked
        $(this).toggleClass('active-top');
        $('body,html').animate({
            scrollTop : 0                       // Scroll to top of body
        }, 100);
        setTimeout(RemoveClass, 1500);
    		});
    function RemoveClass() {
        $('.back-to-top').removeClass('active-top');
    }
});
