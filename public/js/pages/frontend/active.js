$(document).ready(function(){



       // owl-carousel-activation
   // Hero-image-slider-area start----
   var heroSlider = $('.heroSlide');
    
   heroSlider.owlCarousel({
       animateIn:'fadeIn',
       animateOut: 'fadeOut',
       items: 1,
       loop: false,
       autoplay: true,
       dots:true,
       rewind:false
   });
   // owl-carousel-caption-animation
   heroSlider.on('changed.owl.carousel', function (event) {
       var item = event.item.index - 2;
       $('.single-left h2,b,span,a').removeClass('animate__animated animate__fadeInDown');
       $('.owl-item').not('.cloned').eq(item).find('.single-left h2,b,span,a').addClass('animate__animated animate__fadeInDown');
        $('.single-right img').removeClass('animate__animated animate__backInUp');
       $('.owl-item').not('.cloned').eq(item).find('.single-right img').addClass('animate__animated animate__backInUp');
   });
   // Hero-image-slider-area end----


   // product-carousel-active-----------
     // testimonial-owl-slider-active------
  $('.product-carousel-wrapper').owlCarousel({
   loop:true,
   margin:10,
   responsiveClass: true,
   responsive:{
       0:{
           items:1,
           nav: true,
           dots:false
       },
       600:{
           items:1,
           nav: false,
           dots:false,
           autoplay:true
       },
       1000:{
           items:6,
           nav:true,
           loop: true,
           dots:false,
           autoplay:false,
       },
       1400:{
           items:6,
           nav:true,
           loop: true,
           dots:false,
           autoplay:true,
       }
   }
});


  // testimonial-owl-slider-active------
  $('.testimonial-wrapper').owlCarousel({
   loop:true,
   margin:0,
   responsiveClass: true,
   responsive:{
       0:{
           items:1,
           nav: true,
           dots:false
       },
       600:{
           items:1,
           nav: false,
           dots:false,
           autoplay:true
       },
       1000:{
           items:2,
           nav:true,
           loop: true,
           dots:false,
           autoplay:true

       },
       1400:{
           items:3,
           nav:true,
           loop: true,
           dots:false,
           autoplay:true
       }
   }
});
// modal-data-view----------------------
       

        $(".clickButton").click(function () {
            var  category;
            const modalTitle = $('.modal-title');
            const modalQunatityConroler = $('#modal-quantity-control');
            const dryWash = $('.dryWash');
            const steamWash = $('.steamWash');
            const dryIron = $('.dryIron');
            const steamIron = $('.steamIron');
            const addToCartBtn = $('.addToCartBtn');
            category = $(this).data("category");
            itemOnePrice = $(this).data("itemone");
            itemTwoPrice = $(this).data("itemtwo");
            itemThreePrice = $(this).data("itemthree");
            itemFourPrice = $(this).data("itemfour"); 
            dataId = $(this).data("id");
            const ProId = document.querySelector('.ProId');
            ProId.innerText = $(this).data("id");
            addToCartBtn.data('id',dataId);
            modalTitle.text(category);
            if(itemOnePrice){
                dryWash.html(`<label class="container-box" data-bs-toggle="collapse" href="#dryWash">Dry Wash<b class="float-right mr-5 itemOnePrice">${itemOnePrice}TK</b>
                <input type="checkbox" id="itemPriceOne" value="${itemOnePrice}">
                <span class="checkmark"></span>
                </label>`);
            }
            if(itemTwoPrice){
                steamWash.html(`<label class="container-box" data-bs-toggle="collapse" href="#dryWash">Steam Wash<b class="float-right mr-5 itemTwoPrice">${itemTwoPrice}TK</b>
                <input type="checkbox" id="itemPriceTwo" value="${itemTwoPrice}">
                <span class="checkmark"></span>
                </label>`);
            }
            if(itemThreePrice){
                dryIron.html(`<label class="container-box" data-bs-toggle="collapse" href="#dryWash">Dry Iron<b class="float-right mr-5 itemThreePrice">${itemThreePrice}TK</b>
            <input type="checkbox" id="itemPriceThree" value="${itemThreePrice}">
            <span class="checkmark"></span>
            </label>`);
            }
            if(itemFourPrice){
                steamIron.html(`<label class="container-box" data-bs-toggle="collapse" href="#dryWash">Steam Wash<b class="float-right mr-5 itemFourPrice">${itemFourPrice}TK</b>
                <input type="checkbox" id="itemPriceFour" value="${itemFourPrice}">
                <span class="checkmark"></span>
                </label>`);

            }
           
           
        });


       
        // quantity-control--------------
        var quantity = $('.quantityNumber').text();
        quantity =  parseInt(quantity);
        // increase-----------
        $('.increaseBtn').click(function(){
            quantity += 1;
            $('.quantityNumber').text(quantity);
        })
        // decrease----------
        $('.decreaseBtn').click(function(){
            quantity -= 1;
            if(quantity <1){
                quantity = 1;
            }
            $('.quantityNumber').text(quantity);
            
        })
         
            

})