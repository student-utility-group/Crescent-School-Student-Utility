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
    var buildNumber = '[' + '20424' + ']';
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
        var username = rememberedUsername;
        var password = rememberedPassword;
    } else {
        var username = $('#login-username-input').val();
        var password = $('#login-password-input').val();
    }


    // Run the clock function every second
    clock();
    setInterval(function () {
        clock();
    }, 1000);

    // Online detection
    // Run once at launch and every 15 seconds after that
    isOnline();
    setInterval(function () {
        isOnline();
    }, 15000);

    // General button event handlers

    // The login button event handler
    $('#login-button').click(function () {
        isOnline(); // Make sure we're online before we try anything else

        console.log('User [' + username + '] attempting login');

        // Show the progress bar
        $('.login-progress-modal').modal('show');
        hideMenu();
        var auth = initAuth(function (response) {

            console.log(response);
            if (response.auth == 'success') {
                console.log('Authenticated successfully');

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

                // Proceed to get the schedule and marks
                var sched = getSched(function (schedResponse) {
                    console.log(schedResponse);
                    if (schedResponse.status == 'success') {
                        // Got the schedule

                        to = '<h3>'; // Tag open
                        tc = '</h3>'; // Tag close


                        if (schedResponse['class'] == 'no class') {

                            // No class today
                            window.areThereClassesToday = false;
                            showAveragesPage();
                            hideSchedulePage();
                            $('.schedule-button-no-class-indicator').removeClass('hidden');
                            $('.schedule-button').removeClass('list-pressable').addClass('list-pressable-disabled');
                        } else {

                            // This is dirty but it works
                            if (schedResponse[1] == undefined) {
                                schedResponse[1] = 'Spare!';
                            }
                            if (schedResponse[2] == undefined) {
                                schedResponse[2] = 'Spare!';
                            }
                            if (schedResponse[3] == undefined) {
                                schedResponse[3] = 'Spare!';
                            }
                            if (schedResponse[5] == undefined) {
                                schedResponse[5] = 'Spare!';
                            }


                            $('#class-1-code').html(to + schedResponse[1] + tc);
                            $('#class-2-code').html(to + schedResponse[2] + tc);
                            $('#class-3-code').html(to + schedResponse[3] + tc);
                            $('#class-4-code').html(to + schedResponse[5] + tc);


                        } // End of the else (no classes today)
                    } else {
                        // Didn't get the schedule
                        // Show some wicked error
                    }
                    // Get the marks
                    var marks = getMarks(function (markResponse) {
                        console.log(markResponse);
                        if (markResponse.status == 'success') {
                            // Got the marks

                            // If there *is* class today
                            if (schedResponse['class'] != 'no class') {
                                window.areThereClassesToday = true;
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

                                // Don't show the percentage indicators if there is no mark to be shown
                                // This is dirty but it works
                                if (markResponse['grades'][classIndex_1] == undefined) {
                                    $('#class-1-mark').hide();
                                } else {
                                    $('#class-1-mark').show();
                                }
                                if (markResponse['grades'][classIndex_2] == undefined) {
                                    $('#class-2-mark').hide();
                                } else {
                                    $('#class-2-mark').show();
                                }
                                if (markResponse['grades'][classIndex_3] == undefined) {
                                    $('#class-3-mark').hide();
                                } else {
                                    $('#class-3-mark').show();
                                }
                                if (markResponse['grades'][classIndex_4] == undefined) {
                                    $('#class-4-mark').hide();
                                } else {
                                    $('#class-4-mark').show();
                                }
                            } // End of the if there *is* class today
                            getMarksTable(markResponse['grades']);

                        } else {
                            // Didn't get the marks
                            // Throw some wicked error
                        }
                    }); // End of the getMarks callback

                    // Putting this here does a nice job of fading into the homepage just
                    // as all of the DOM operations are finishing
                    $('.login-progress-modal').modal('hide');

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
        $('.class-mark').hide();
    });

    $('.refresh').click(function () {
        $('.refresh').toggleClass('refreshing');
        $('.logout').trigger('click');
        $('#login-button').trigger('click');
        // Show a progress bar for aesthetic effect?
    });

    $('.menu-toggle').click(function () {
        // Animate?
        toggleMenu();
    });

    // Marks page
    $('.averages-button').click(function () {
        showAveragesPage();
        hideMenu();
    });

    // Schedule (home) page
    $('.schedule-button').click(function () {
        if (window.areThereClassesToday == true) {
            hideAveragesPage();
            showSchedulePage();
            hideMenu();
        }
    });

});