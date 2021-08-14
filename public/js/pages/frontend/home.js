// cart-dropdown-------------------------------
        /* When the user clicks on the button, 
          toggle between hiding and showing the dropdown content */
          function dropdownCart() {
            document.getElementById("cart-box-home").classList.add("show");
            // Close the dropdown if the user clicks outside of it
            window.onclick = function(event){
              if (document.getElementsByClassName('dropbtn')[0].contains(event.target)){
                 // inside

               } else{

                 // outside
                 
                 document.getElementById("cart-box-home").classList.remove("show");
               }
             };
          
          }

          


        