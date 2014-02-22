// funcs.js
// The main functions file
// Jonathan Libby, 1/4/2014

var apiBaseURL = "https://wylienet.thelibbster.com/liv.php"; // No trailing slash
var apiStatusURL = apiBaseURL + "/status"; // Note the leading slash
var apiPingURL = apiBaseURL + '/ping';
var apiAuthURL = apiBaseURL + "/user/auth";
var apiSchedURL = apiBaseURL + "/user/schedule";
var apiMarkURL = apiBaseURL + "/user/marks";
// Online detection functions
function isOnline(online) {
    $.ajax({
        type: "GET",
        url: apiPingURL,
    }).success(function () {
        // Do nothing
        if ($('#login-button').attr('data-online') == 'false') {
            location.reload();
        }
        console.log('Got status page');
    }).error(function () {
        console.log('Couldn\'t get status page');
        offlineProcedures();
    });
}

function offlineProcedures() {
    // Shows the offline error message on the login screen
    $('#login-button').removeClass('btn-primary')
        .addClass('btn-danger')
        .attr('data-online', 'false')
        .html('Try again <small class="glyphicon glyphicon-refresh"></small>');
    $('.login-form .form-group').hide();
    $('#offline-message').removeClass('hidden');
    $('.show-connection-help').click(function () {
        // Show modal
        $('.show-connection-help-modal').modal();
    });
}

function onlineProcedures() {
    $('#login-button').addClass('btn-primary');
    $('#offline-message').addClass('hidden');
    $('.login-form .form-group').show();
    //  .html('<input type="text" class="form-control" id="login-username-input" placeholder="Username"><br><input type="password" class="form-control" id="login-password-input" placeholder="Password">');
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

    var dow = now.getDay(); // DoW, 0 - 6
    var dom = now.getDate(); // DoM, 0 - 31 (depends on # of days in month)
    var month = now.getMonth(); // Month, 0 - 11
    var year = now.getFullYear(); // Year, xxxx

    // Convert DoW (numbered, starting at 0) to human DoW
    switch (dow) {
    case 0:
        dow = 'Sunday';
        break;
    case 1:
        dow = 'Monday';
        break;
    case 2:
        dow = 'Tuesday';
        break;
    case 3:
        dow = 'Wednesday';
        break;
    case 4:
        dow = 'Thursday';
        break;
    case 5:
        dow = 'Friday';
        break;
    case 6:
        dow = 'Saturday';
        break;
    }

    // Convert MoY (numbered, starting at 0) to human MoY
    switch (month) {
    case 0:
        month = 'January';
        break;
    case 1:
        month = 'February';
        break;
    case 2:
        month = 'March';
        break;
    case 3:
        month = 'April';
        break;
    case 4:
        month = 'May';
        break;
    case 5:
        month = 'June';
        break;
    case 6:
        month = 'July';
        break;
    case 7:
        month = 'August';
        break;
    case 8:
        month = 'September';
        break;
    case 9:
        month = 'October';
        break;
    case 10:
        month = 'November';
        break;
    case 11:
        month = 'December';
        break;
    }

    $('.clock-date').text(dow + ', ' + dom + ' ' + month + ' ' + year);
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
    $('.schedule-page').show();
}

function hideSchedulePage() {
    $('.schedule-page').hide();
}

function showAveragesPage() {
    hideSchedulePage();
    $('.marks-page').removeClass('hidden');
}

function hideAveragesPage() {
    $('.marks-page').addClass('hidden');
}

function getMarksTable(marks) {
    // Make sure we clear out the table each time
    $('.marks-table-tbody').html('');
    $.each(marks, function (index, value) {
        $('.marks-table-tbody').append('<tr><td>' + index + '</td><td>' + value + '%</td></tr>');
    });
}