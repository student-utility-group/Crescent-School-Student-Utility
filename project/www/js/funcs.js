// funcs.js
// The main functions file
// Jonathan Libby, 1/4/2014

var apiBaseURL = "https://wylienet.thelibbster.com/lib.php"; // No trailing slash
var apiStatusURL = apiBaseURL + "/status"; // Note the leading slash
var apiPingURL = apiBaseURL + '/ping';
var apiAuthURL = apiBaseURL + "/user/auth";
var apiSchedURL = apiBaseURL + "/user/schedule";
var apiMarkURL = apiBaseURL + "/user/marks";
var apiLunchURL = apiBaseURL + "/lunch";
// Online detection functions
function isOnline(online) {
    $.ajax({
        type: "GET",
        url: apiPingURL,
    }).success(function () {
        // Do nothing
        // if ($('#login-button').attr('data-online') == 'false') {
        //     location.reload();
        // }
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
        
		// Show the connection help modal
        $('.show-connection-help-modal').modal('show');
		
		// Prevent the button from refreshing the page, even
		// though it shouldn't because it's a button element
		// and not an anchor. Either way, it fixes a bug.
		return false;
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
    // DST check isn't actually necessary, the device clock handles that
    //outHour = outHour - offset;
    var ampm;

    if (outHour >= 12) {
        ampm = "PM";
    }

    if (outHour == 0) {
        outHour = 12;
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
    dateFormat = $.jStorage.get('date_format');
    if (!dateFormat) {
        dateFormat = 'dddd, d MMMM yyyy'; // Default date format
        $.jStorage.set('date_format', dateFormat);
    }
    $('.clock-date').text(Date.today().toString(dateFormat));
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

function getMarksTable(marks) {
    // Draw the table in the first place
    // This one-line html stuff is really awful, but it's the only way right now
    $('.marks-page-note').hide(); // In case the last user didn't get any marks

    // Essentially, put the background colour back. Resets what we do in the case of a note rather than marks
    $('#marks-container')
        .addClass('hero-block')
        .html('<br><div class="row col-xs-5"><table class="table table-condensed center"><thead><th>Class</th><th>Average</th></thead><tbody class="marks-table-tbody"></tbody></table></div>');

    // Make sure we clear out the table each time, because we'll be appending rows to it below
    $('.marks-table-tbody').html('');

    // All averages added together, to be used in average calculation
    var total = 0;

    // Number of courses a user is enrolled in
    var courseCount = Object.keys(marks).length;

    $.each(marks, function (index, value) {
        total += parseInt(value);
    });

    // Calculate an overall average and round to 2 decimal places
    var average = Math.round((total / courseCount) * 10) / 10.0;

    $.each(marks, function (index, value) {
        if (value > average) {
            classToAdd = 'success';
        } else if (value < average) {
            classToAdd = 'danger';
        } else {
            classToAdd = 'default';
        }
        $('.marks-table-tbody').append('<tr class="marks-row"><td>' + index + '</td><td id="mark"><span class="label label-' + classToAdd + '">' + value + '%</span></td></tr>');
    });
    $('.marks-table-tbody').append('<tr><td><span class="label label-info"><b>Overall</b></span></td><td><span class="label label-info"><b>' + average + '%</b></span></td></tr>');
}

function getLunch(response) {
    $.ajax({
        type: "GET",
        url: apiLunchURL,
        success: response
    });
}

function toggleMenu() {
    //$('.main-page').toggleClass('main-page-toggled');
    if ($('.animation-wrapper').position().left < 150) {
        $('.animation-wrapper').animate({
            left: "+=135",
        }, 80, function () {
            // Animation complete.
        });
    } else {
        $('.animation-wrapper').animate({
            left: "-=135",
        }, 80, function () {
            // Animation complete.
            console.log($('.animation-wrapper').position().left);
        });
    }
    $('.menu-toggle').toggleClass('menu-toggle-toggled');
    // Stops the user from being able to scroll around
    $('body').toggleClass('body-fixed-position');
}

function hideMenu() {
    $('.main-page').removeClass('main-page-toggled');
    $('.menu-toggle').removeClass('menu-toggle-toggled');
    // Lets the user scroll around again
    $('body').removeClass('body-fixed-position');
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

function showLunchPage() {
    $('.lunch-page').removeClass('hidden');
}

function hideLunchPage() {
    $('.lunch-page').addClass('hidden');
}

function hideLoginModal() {
    $('.login-progress-modal').modal('hide');
}

function showSettingsPage() {
    $('.settings-page').removeClass('hidden');
}

function hideSettingsPage() {
    $('.settings-page').addClass('hidden');
}