/************************************
 *              app.js               *
 *        The main logic file        *
 *      Jonathan Libby, 11/2013      *
 *                                   *
 ************************************/

$(document).ready(function () {

    // Hide the main page
    $('.main-page').hide();

    // Show build number
    var buildNumber = '[20419]';
    $('.build-indicator').text(buildNumber);

    // Attach the FastClick library to the .click event
    // FastClick.js
    // https://github.com/ftlabs/fastclick
    $(function () {
        FastClick.attach(document.body);
    });

    // Run the clock function every second
    clock();
    setInterval(function () {
        clock();
    }, 1000);

    // Online detection and action-taking
    var online = isOnline(apiStatusURL);
    applyOfflineProcedures(online);


    // General button event handlers
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