$(document).ready(function () {
    // Hide the main page
    $('.main-page').hide();
    // Attach the FastClick library to the .click event
    // FastClick.js
    // https://github.com/ftlabs/fastclick
    $(function () {
        FastClick.attach(document.body);
    });

    $('#login-button').click(function () {
        $('.login-page').slideUp();
        $('.main-page').slideDown();
    });

    $('.logout').click(function () {
        $('.main-page').slideUp();
        $('.login-page').slideDown();
    });

    function myDate() {

        var now = new Date();
        var outHour = now.getHours();
        var ampm;

        if (outHour >= 12) {
            ampm = "PM";
            var newHour = outHour - 12;
            outHour = newHour;
        } else {
            ampm = "AM";
        }
        $('.ampm-indicator').text(ampm);

        if (outHour < 10) {
            $('.time-hour').text("0" + outHour); // leading 0
        } else {
            $('.time-hour').text(outHour);
        }

        var outMin = now.getMinutes();
        if (outMin < 10) {
            $('.time-min').text("0" + outMin); // leading 0
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
    setInterval(function () {
        myDate();
    }, 1000);
    
    $('.refresh').click(function () {
        $('.refresh').html('<span class="glyphicon glyphicon-refresh"></span>')
    });
});