// Animations initialization
new WOW().init();

// SideNav Button Initialization
$(".button-collapse").sideNav();
// SideNav Scrollbar Initialization
var sideNavScrollbar = document.querySelector('.custom-scrollbar');
Ps.initialize(sideNavScrollbar);

$('.qty-add').on('click', function (events) {
   var currentQty = parseFloat($('.qty').html());
   var newQty = currentQty + 1;
   $('.qty').html(newQty + ' ');
   $('input[name=qty]').attr('value', newQty);
});

$('.qty-minus').on('click', function (events) {
    var currentQty = parseFloat($('.qty').html());
    var newQty = currentQty - 1;
    if (newQty < 1) {
        $('.qty').html(1 + ' ');
        $('input[name=qty]').attr('value', 1);
    }

    else {
        $('.qty').html(newQty + ' ');
        $('input[name=qty]').attr('value', newQty);
    }
 });