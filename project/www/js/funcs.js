// funcs.js
// The main functions file
// Jonathan Libby, 1/4/2014

var apiBaseURL = "https://wylienet.thelibbster.com/liv.php"; // No trailing slash
var apiStatusURL = apiBaseURL + "/status"; // Note the leading slash
var apiAuthURL = apiBaseURL + "/user/auth";
var apiSchedURL = apiBaseURL + "/user/schedule";
var apiMarkURL = apiBaseURL + "/user/marks";
// Online detection functions
function isOnline(apiStatusURL) {
    var response = $.getJSON(apiStatusURL, function (response) {});
    return response;
}

isOnline(apiStatusURL).done(function (response) {
    if (response.status == "success") {
        var online = true;
    } else {
        var online = false;
    }
    return online;
}).fail(function () {
    var online = false;
    return online;
});

function offlineProcedures() {
    // Shows the offline error message on the login screen
    $('#login-button').removeClass('btn-primary')
        .addClass('btn-danger')
        .html('Try again <small class="glyphicon glyphicon-refresh"></small>');
    $('.login-form .form-group').html('<div class="alert alert-danger"><b>Oops!</b><br>There was a problem connecting to the Student Utility servers.<br><br><button class="btn btn-sm btn-info show-connection-help">More info <span class="glyphicon glyphicon-info-sign"></span></button></div>');
    $('.show-connection-help').click(function () {
        //apprise('<div style="text-align: center;">What happened?<br>The Student Utility was unable to contact the servers it runs on. This issue could arise in two ways:<br><br><ul class="list-group"><li class="list-group-item"><span class="label label-success">Most likely</span><br>Your device isn\'t connected to the Internet</li><li class="list-group-item"><span class="label label-warning">Least likely</span><br>The Student Utility servers are down</li></ul></div>');
        // SHOW MODAL
        $('.show-connection-help-modal').modal();
    });
    $('#login-button').click(function () {
        // Try again
        isOnline();
    });
}

function onlineProcedures() {
    $('#login-button').addClass('btn-primary')
        .html('<input type="text" class="form-control" id="login-username-input" placeholder="Username"><br><input type="password" class="form-control" id="login-password-input" placeholder="Password">');
}

function applyOfflineProcedures(online) {
    // Checks if the app is online, then runs the offline procedures accordingly
    if (online.statusText == "error") {
        // App offline, run procedures
        offlineProcedures();
    } else if (online.status == 200 || online.status == 304) {
        onlineProcedures();
    }
}

// Time functions

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
    $('.time-hour').text(outHour);

    var outMin = now.getMinutes();

    if (outMin < 10) {
        $('.time-min').text("0" + outMin); // leading 0
    } else {
        $('.time-min').text(outMin);
    }
}

function getTestSched() {
    var response = $.getJSON("http://wylienet.thelibbster.com/liv.php/getUserSchedTest", function (response) {
        $('#class-1-code').html('<h3>' + response.class_1 + '</h3>');
        $('#class-2-code').html('<h3>' + response.class_2 + '</h3>');
        $('#class-3-code').html('<h3>' + response.class_3 + '</h3>');
        $('#class-4-code').html('<h3>' + response.class_4 + '</h3>');
    });
}

// DO SOMETHING WITH THESE FUNCTIONS WHEN THE CONNECTIONS FAIL!!!!

function initAuth(response) {
    var username = $('#login-username-input').val();
    var password = $('#login-password-input').val();
    $.ajax({
        type: "POST",
        url: apiAuthURL,
        data: {
            username: username,
            password: password
        },
        success: response
    });
}

function getSched(response) {
    var username = $('#login-username-input').val();
    var password = $('#login-password-input').val();
    $.ajax({
        type: "POST",
        url: apiSchedURL,
        data: {
            username: username,
            password: password
        },
        success: response
    });
}

function getMarks(response) {
    var username = $('#login-username-input').val();
    var password = $('#login-password-input').val();
    $.ajax({
        type: "POST",
        url: apiMarkURL,
        data: {
            username: username,
            password: password
        },
        success: response
    });
}

function toggleMenu() {
    $('.main-page').toggleClass('main-page-toggled');
    $('.menu-toggle').toggleClass('menu-toggle-toggled');
}

function hideMenu() {
    $('.main-page').removeClass('main-page-toggled');
    $('.menu-toggle').removeClass('menu-toggle-toggled');
}

function showSchedulePage() {
    $('.class-1').show();
}

function hideSchedulePage() {
    $('.class-1').hide();
}

function showAveragesPage() {
    hideSchedulePage();
    $('#marks-container').removeClass('hidden');
}

function hideAveragesPage() {
    $('#marks-container').addClass('hidden');
}

function getMarksTable(marks) {
    // Make sure we clear out the table each time
    $('.marks-table-tbody').html('');
    $.each(marks, function (index, value) {
        $('.marks-table-tbody').append('<tr><td>' + index + '</td><td>' + value + '%</td></tr>');
    });
}