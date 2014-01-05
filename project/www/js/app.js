/************************************
 *              app.js               *
 *        The main logic file        *
 *      Jonathan Libby, 11/2013      *
 *                                   *
 ************************************/

var apiBaseURL = "http://wylienet.thelibbster.com/liv.php"; // No trailing slash
var apiStatusURL = apiBaseURL + "/status"; // Note the leading slash
var apiAuthURL = apiBaseURL + "/user/auth"; // NEED TO VERIFY THIS

$(document).ready(function () {

    // Hide the main page
    $('.main-page').hide();

    // Attach the FastClick library to the .click event
    // FastClick.js
    // https://github.com/ftlabs/fastclick
    $(function () {
        FastClick.attach(document.body);
    });


    // Online detection
    function isOnline() {
        var online;
        $.getJSON(apiStatusURL, function (response) {
            online = true;
        }).fail(function () {
            online = false;
        });
        if (online == true) {
            online = true;
        } else {
            online = false;   
        }
        return online;
    }

    function offlineProcedures() {
            // Shows the offline error message on the login screen
            $('#login-button').removeClass('btn-primary')
                .addClass('btn-danger')
                .html('Try again <small class="glyphicon glyphicon-refresh"></small>');
            $('.login-form .form-group').html('<div class="alert alert-danger"><b>Oops!</b><br>There was a problem connecting to the Student Utility servers.<br><br><button class="btn btn-sm btn-info show-connection-help">More info <span class="glyphicon glyphicon-info-sign"></span></button></div>');
            $('.show-connection-help').click(function () {
                //apprise('<div style="text-align: center;">What happened?<br>The Student Utility was unable to contact the servers it runs on. This issue could arise in two ways:<br><br><ul class="list-group"><li class="list-group-item"><span class="label label-success">Most likely</span><br>Your device isn\'t connected to the Internet</li><li class="list-group-item"><span class="label label-warning">Least likely</span><br>The Student Utility servers are down</li></ul></div>');
                // SHOW MODAL
                $('.mymodal').modal();
            });
            $('#login-button').click(function () {
                // Try again
                isOnline();
            });
    }

    function applyOfflineProcedures(online) {
        // Checks if the app is online, then applies the offline procedures accordingly
        if (online == false) {
            // App offline
            offlineProcedures();
        }
    }

    // Functions to get whether or not DST is in effect
    Date.prototype.stdTimezoneOffset = function () {
        var january = new Date(this.getFullYear(), 0, 1);
        var july = new Date(this.getFullYear(), 6, 1);
        return Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
    }

    Date.prototype.dst = function () {
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    }
/*
    function NTPSync() {
        var clientTimestamp = (new Date()).valueOf();
        $.getJSON('http://wylienet.thelibbster.com/liv.php/time/' + clientTimestamp, function (data) {
            var nowTimeStamp = (new Date()).valueOf();
            var serverClientRequestDiffTime = data.diff;
            var serverTimestamp = data.serverTimestamp;
            var serverClientResponseDiffTime = nowTimeStamp - serverTimestamp;
            var responseTime = (serverClientRequestDiffTime - nowTimeStamp + clientTimestamp - serverClientResponseDiffTime) / 2

            var syncedServerTime = new Date((new Date()).valueOf() + (serverClientResponseDiffTime - responseTime));
            alert(syncedServerTime);
        });
    }
*/
    // Gets the date and time
    function clock() {
        var now = new Date();
        var outHour = now.getHours();
        //var offset = (now.getTimezoneOffset() / 60);

        // When UTC is after midnight but the local time isn't
        //if (outHour < 12) {
        //    outHour += 12;
        //}
        // Check for daylight savings time. If it is in effect, subtract 1 hour from the time.
        if (now.dst()) {
            outHour -= 1;
        }
        //outHour = outHour - offset;
        var ampm;

        if (outHour >= 12) {
            ampm = "PM";
        }

        if (outHour > 12) {
            var newHour = outHour - 12;
            outHour = newHour;
        } else if (outHour < 12) {
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
    }
    clock();
    setInterval(function () {
        clock();
    }, 1000);

    // General button event handlers
    var online = isOnline();
    applyOfflineProcedures(online);

    $('#login-button').click(function () {
            $('.login-page').slideUp();
            $('.main-page').slideDown();
    });

    $('.logout').click(function () {
        $('.main-page').slideUp();
        $('.login-page').slideDown();
    });

    $('.refresh').click(function () {
        $('.refresh').html('<span class="glyphicon glyphicon-refresh"></span>')
    });

    $('.menu-toggle').click(function () {
        // ANIMATE ALL OF THIS!!!
        //$('.menu-toggle').fadeToggle();
        $('.main-page').toggleClass('main-page-toggled');
        $('.menu-toggle').toggleClass('menu-toggle-toggled');

    });

});