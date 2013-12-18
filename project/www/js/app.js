$(document).ready(function(){
        // Attach the FastClick library to the .click event
        // FastClick.js
        // https://github.com/ftlabs/fastclick
        $(function () {
            FastClick.attach(document.body);
        });

         
        
        // Main login-page event handling for the login form submission
//        $('#login-button').click(function () {
//            $('.login-page').slideUp();
//            $('.main-page').slideDown();
//        });
        
            $('.main-page').hide();
        
        $(function () {
            FastClick.attach(document.body);
        });
        
        $('#login-button').click(function () {
            $('.login-page').slideUp();
            $('.main-page').slideDown();
        });
        
        $('.footer-build').click(function () {
            $('.main-page').slideUp();
            $('.login-page').slideDown();
        });
    
        function myDate(){
            
            var now = new Date();
            var outHour = now.getHours();
            
            if(outHour >12) {
                var ampm = "PM";
                newHour = outHour-12;
                outHour = newHour;
            } else {
                var ampm = "AM";   
            }
            $('.ampm-indicator').text(ampm);
            
            if(outHour<10) {
                $('.time-hour').text("0" + outHour); // leading 0
            } else {
                $('.time-hour').text(outHour);
            }
            
            var outMin = now.getMinutes();
            if(outMin<10) {
                $('.time-min').text("0"+outMin); // leading 0
            } else {
                $('.time-min').text(outMin);
            }
            
            //  var outSec = now.getSeconds();
            //  if(outSec<10) {
                 // document.getElementById('SecDiv').innerHTML="0"+outSec;
            //  } else {
                //  document.getElementById('SecDiv').innerHTML=outSec;
            //  }
              }
    
          myDate();
          setInterval(function() {
              myDate();
          }, 1000);
        });