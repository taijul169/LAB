$(document).ready(function(){

    const custom_alert = $("#custom-alert");
    const customAlertBox = $("#custom-alert-box");

    // Element select
    const firstname = $('#firstname');
    const mobile = $('#mobile');
    const email = $('#email');
    const gender = $('#gender');
    const dateofbirth = $('#dateofbirth');
    const division = $('#division');
    const district = $('#district');
    const upazila = $('#upazila');
    const password = $('#password');
    const conpassword = $('#conpassword');

    const userphoto = $('#userphoto');
    const certificatehsc = $('#certificatehsc');
    const certificatessc = $('#certificatessc');
    const certificatebachelor = $('#certificatebachelor');
    const institutebachelor = $('#institutebachelor');
    const institutehsc = $('#institutehsc');
    const institutessc = $('#institutessc');
    const yearssc = $('#yearssc');
    const yearhsc = $('#yearhsc');
    const yearbachelor = $('#yearbachelor');
    const groupssc = $('#groupssc');
    const grouphsc = $('#grouphsc');
    const subjectbachelor = $('#subjectbachelor');


    


    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;
    
    setProgressBar(current);
    
    $(".next").click(function(){
       if(current == 1){
        if(!(userphoto.val())){
            //-------------
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Photograph Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
         else if(!(firstname.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 First Name Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(mobile.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Mobile Number Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }
          else if((mobile.val().length<11)){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Invalid Moile number!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }
          else if(!(email.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Email Field Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }
        
          else if(!(gender.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Gender Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }
          else if(!(dateofbirth.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Date of birth Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }
          else if(!(division.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Division Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }
          else if(!(district.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 district Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }
          else if(!(upazila.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Upazila Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }

          else if(!(password.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Password Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }
          else if(!(conpassword.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 Confirm Password Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`) 
           return false
          }
        
          else{
              customAlertBox.html('');
             
          }
       }
       if(current == 2){
         if(!(institutessc.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                SSC Institute Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(groupssc.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                SSC Group Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(yearssc.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                SSC Passing year Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(certificatessc.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                SSC Certificate Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(institutehsc.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                HSC Institute Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(grouphsc.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
               HSC group Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(yearhsc.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                HSC Passsing year  Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(certificatehsc.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                HSC Certificate Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(institutebachelor.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Bachelor Institute Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else if(!(subjectbachelor.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Bachelor Subject Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
      
         else if(!(certificatebachelor.val())){
            customAlertBox.html( `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                bachelor Certificate/ID Card Required!!!
                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                     <span aria-hidden="true">&times;</span>
                 </button>
           </div>`)
           return false
          }
          else{
              customAlertBox.html("");
          }

       }

    // customvalidation-start
    // if(!firstname.val() || !mobile.val() || !email.val() || !gender.val() || !dateofbirth.val() || !division || !district.val() || ! upazila.val() || !password.val() || !conpassword.val() ){
    //     window.alert("Field is required!!");
    //     return false;
    // }    
    
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    
    //Add Class Active
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    
    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
    step: function(now) {
    // for making fielset appear animation
    opacity = 1 - now;
    
    current_fs.css({
    'display': 'none',
    'position': 'relative'
    });
    next_fs.css({'opacity': opacity});
    },
    duration: 500
    });
    setProgressBar(++current);
    });
    
    $(".previous").click(function(){
    
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();
    
    //Remove class active
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    
    //show the previous fieldset
    previous_fs.show();
    
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
    step: function(now) {
    // for making fielset appear animation
    opacity = 1 - now;
    
    current_fs.css({
    'display': 'none',
    'position': 'relative'
    });
    previous_fs.css({'opacity': opacity});
    },
    duration: 500
    });
    setProgressBar(--current);
    });
    
    function setProgressBar(curStep){
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar")
    .css("width",percent+"%")
    }
    
    $(".submit").click(function(){
    return false;
    })
    
    });