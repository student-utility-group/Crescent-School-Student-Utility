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
    var buildNumber = '[20422]';
    $('.build-indicator').text(buildNumber);

    // Attach the FastClick library to the .click event
    // FastClick.js
    // https://github.com/ftlabs/fastclick
    $(function () {
        FastClick.attach(document.body);
    });

    // Put the username and password into the form fields
    var rememberedUsername = $.jStorage.get('username');
    var rememberedPassword = $.jStorage.get('password');
    if (rememberedUsername && rememberedPassword) {
        $('#login-username-input').attr('value', rememberedUsername);
        $('#login-password-input').attr('value', rememberedPassword);
    }

    // Run the clock function every second
    clock();
    setInterval(function () {
        clock();
    }, 1000);

    // Online detection and action-taking
    var online = isOnline(apiStatusURL);
    //  console.log(online.status); // For some reason you can't access this #WTF

    // General button event handlers
    $('#login-button').click(function () {

        hideMenu();
        var auth = initAuth(function (response) {
            console.log(response);
            if (response.auth == 'success') {
                $('.login-page').slideUp();
                $('.main-page').slideDown();

                // Get rid of the error messages, if any
                $('#password-failure-message').remove();
                $('.form-group').removeClass('has-error');

                // Remember the username and password
                var username = $('#login-username-input').val();
                var password = $('#login-password-input').val();
                $.jStorage.set('username', username);
                $.jStorage.set('password', password);
                $.jStorage.setTTL('password', 1209600000); // Password expires in 2 weeks (milliseconds)

                // Proceed to get the schedule and marks, perhaps show a progress bar?
                var sched = getSched(function (schedResponse) {
                    console.log(schedResponse);
                    if (schedResponse.status == 'success') {
                        // Got the schedule

                        to = '<h3>'; // Tag open
                        tc = '</h3>'; // Tag close

                        $('#class-1-code').html(to + schedResponse[1] + tc);
                        $('#class-2-code').html(to + schedResponse[2] + tc);
                        $('#class-3-code').html(to + schedResponse[3] + tc);
                        $('#class-4-code').html(to + schedResponse[5] + tc);

                        // Get the marks
                        var marks = getMarks(function (markResponse) {
                            console.log(markResponse);
                            if (markResponse.status == 'success') {

                                // Separate course codes from sections
                                var classIndex_1_array = schedResponse[1].split('-');
                                var classIndex_2_array = schedResponse[2].split('-');
                                var classIndex_3_array = schedResponse[3].split('-');
                                var classIndex_4_array = schedResponse[5].split('-');

                                // Indexes for the response array
                                var classIndex_1 = classIndex_1_array[0];
                                var classIndex_2 = classIndex_2_array[0];
                                var classIndex_3 = classIndex_3_array[0];
                                var classIndex_4 = classIndex_4_array[0];
                                
                                // Write 'em out
                                $('#class-1-mark').text(markResponse['grades'][classIndex_1] + '%');
                                $('#class-2-mark').text(markResponse['grades'][classIndex_2] + '%');
                                $('#class-3-mark').text(markResponse['grades'][classIndex_3] + '%');
                                $('#class-4-mark').text(markResponse['grades'][classIndex_4] + '%');
                            
                            } else {
                                // Didn't get the marks
                                // Throw some wicked error
                            }
                        }); // End of the getMarks callback

                    } else {
                        // Didn't get the schedule
                        // Show some wicked error
                    }
                }); // End of the getSched callback

            } else {
                // Throw login error
                $('.form-group').addClass('has-error');
                $('.form-group').prepend('<label id="password-failure-message" class="control-label" for="login-username-input">Username or password incorrect. <button id="show-login-help" class="btn btn-xs btn-info" data-toggle="modal" data-target=".show-login-help-modal"><span class="glyphicon glyphicon-info-sign"></span> More info</button></label>');
            }
        }); // End of the initAuth callback

        return false; // So that there's no page refresh when the login button is pressed
    });

    $('.logout').click(function () {

        $('.main-page').slideUp();
        $('.login-page').slideDown();
        hideMenu();
    });

    $('.refresh').click(function () {
        $('.refresh').toggleClass('refreshing');
        // Show a progress bar for aesthetic effect?
    });

    $('.menu-toggle').click(function () {
        // ANIMATE ALL OF THIS!!!
        //$('.menu-toggle').fadeToggle();
        toggleMenu();
    });

});