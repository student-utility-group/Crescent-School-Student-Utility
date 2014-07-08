/************************************
 *              app.js               *
 *        The main logic file        *
 *      Jonathan Libby, 11/2013      *
 *                                   *
 ************************************/

$(document).ready(function () {

    // THIS STUFF IS FOR OFFLINE DEV ONLY
    // clock();
    // setInterval(function () {
    //     clock();
    // }, 1000);
    // $('.login-page').slideUp();
    // $('.main-page').removeClass('hidden').slideDown();
    // END STUFF FOR OFFLINE DEV ONLY

    // Build number
    var buildNumber = '[' + 20602 + ']';
    var debug = true;

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
    }
    // Online detection
    // Run once at launch and every 15 seconds after that
    isOnline();
    var getStatusPageInterval = setInterval(function () {
        isOnline();
    }, 15000);

    // Show build number
    $('.build-indicator').text(buildNumber);

    // Get the lunch menu
    var lunch = getLunch(function (lunchResponse) {
        console.log(lunchResponse);
        
        // During US exam weeks, post the upper school exam schedules
        // to the lunch menu page. Lunch isn't served that week, so there's
        // nothing to be lost!
        if (lunchResponse.status == 'exams') {
            $('.lunch-menu-text').text('Exam Schedule');
            $('.lunch-menu-note').text('Note: This is an Upper School final exam schedule. Please double-check your exam schedule in more than one place to ensure accuracy.');
        }
        
        // Write out the response object elements to the page
        $('#lunch-monday').html(lunchResponse.monday);
        $('#lunch-tuesday').html(lunchResponse.tuesday);
        $('#lunch-wednesday').html(lunchResponse.wednesday);
        $('#lunch-thursday').html(lunchResponse.thursday);
        $('#lunch-friday').html(lunchResponse.friday);
    });

    // General button event handlers

    // The login button event handler

    $('#login-button').click(function () {
        isOnline(); // Make sure we're online before we try anything else
        
        // Get the username and password
        username = $('#login-username-input').val();
        password = $('#login-password-input').val();

        // Just for debugging
        console.log('User [' + username + '] attempting login');

        // Only show the home page build number if it's one of us
        if (username == 'jonathanlibby' || username == 'matthewcheung') {
            $('.build-indicator-developer').show().text(buildNumber);
        } else {
            $('.build-indicator-developer').hide();
        }

        // Stop getting the status pages to reduce bandwidth
        clearInterval(getStatusPageInterval);

        // Run the clock function every second
        clock();
        setInterval(function () {
            clock();
        }, 1000);

        // Show the progress bar
        $('.login-progress-modal').modal('show');
        hideMenu();
        var auth = initAuth(function (response) {

            console.log(response);
            if (response.auth == 'success') {
                console.log('Authenticated successfully');

                // Hides the keyboard if the enter key was used
                // to submit the form
                $('#login-username-input').blur();
                $('#login-password-input').blur();

                // Hide the login page and show the main page,
                // obviously
                $('.login-page').slideUp();
                $('.main-page').removeClass('hidden').slideDown();

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

                        var to = '<h3>'; // Tag open
                        var tc = '</h3>'; // Tag close


                        if (schedResponse.class == 'no class') {

                            // No class today
                            window.areThereClassesToday = false;
                            showAveragesPage();
                            hideSchedulePage();
                            $('.schedule-button-no-class-indicator').removeClass('hidden');
                            $('.schedule-button').removeClass('list-pressable').addClass('list-pressable-disabled');
                        } else {

                            // This is dirty but it works
                            if (schedResponse[1] === undefined) {
                                schedResponse[1] = 'Spare!';
                            }
                            if (schedResponse[2] === undefined) {
                                schedResponse[2] = 'Spare!';
                            }
                            if (schedResponse[3] === undefined) {
                                schedResponse[3] = 'Spare!';
                            }
                            if (schedResponse[5] === undefined) {
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
                        apprise("The Student Utility encountered a wicked error while trying to fetch your schedule. We're terribly sorry for the inconvenience. Please e-mail jonathanlibby@crescentschool.org to notify him of this issue.");
                    }
                    // Get the marks
                    var marks = getMarks(function (markResponse) {
                        console.log(markResponse);
                        if (markResponse.status == 'success') {
                            // Got the marks

                            // If there *is* class today
                            if (schedResponse.class != 'no class') {
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
                                if (markResponse.grades[classIndex_1] === undefined) {
                                   $('#class-1-mark').show();
                                } else {
                                   $('#class-1-mark').show();
                                }
                                if (markResponse.grades[classIndex_2] === undefined) {
                                   $('#class-2-mark').hide();
                                } else {
                                   $('#class-2-mark').show();
                                }
                                if (markResponse.grades[classIndex_3] === undefined) {
                                   $('#class-3-mark').hide();
                                } else {
                                   $('#class-3-mark').show();
                                }
                                if (markResponse.grades[classIndex_4] === undefined) {
                                   $('#class-4-mark').hide();
                                } else {
                                    $('#class-4-mark').show();
                                }

                                // .class-mark elements are hidden in the .logout element click
                                // event handler. Show them again when logging back in.
                                $('.class-mark').show();

                            } // End of the if there *is* class today

                            getMarksTable(markResponse['grades']);
                        } else if (markResponse.status == 'exams') {
                            $('#marks-container').removeClass('hero-block'); // Essentially, hide the background
                            $('#marks-container').html('<div class="marks-page-note note"><p>Note: For administrative purposes beyond our control, marks are disabled during exam periods. We apologize for the inconvenience.</p></div>');
                        } else {
                            // Didn't get the marks
                            // Throw some wicked error
                            apprise("The Student Utility encountered a wicked error while trying to fetch your marks. We're terribly sorry for the inconvenience. Please e-mail jonathanlibby@crescentschool.org to notify him of this issue.");
                        }
                    }); // End of the getMarks callback

                    // Putting this here does a nice job of fading into the homepage just
                    // as all of the DOM operations are finishing
                    hideLoginModal();

                }); // End of the getSched callback
            } else {
                // Throw login error
                $('.form-group').addClass('has-error');
                $('.form-group').prepend('<label id="password-failure-message" class="control-label" for="login-username-input">Username or password incorrect. <button id="show-login-help" class="btn btn-xs btn-info" data-toggle="modal" data-target=".show-login-help-modal"><span class="glyphicon glyphicon-info-sign"></span> More info</button></label>');
                hideLoginModal();
            }
        }); // End of the initAuth callback

        return false; // So that there's no page refresh when the login button is pressed
    });

    $('.logout').click(function () {
        $('.main-page').slideUp();
        $('.login-page').slideDown();
        hideMenu();
        $('.class-mark').fadeOut(100);
    });

    $('.refresh').click(function () {
        $('.refresh').toggleClass('refreshing');
        $('.logout').trigger('click');
        $('#login-button').trigger('click');
        hideLunchPage();
    });

    $('.menu-toggle').click(function () {
        // Animate!
        toggleMenu();
    });

    // Marks page
    $('.averages-button').click(function () {
        hideLunchPage();
        hideSchedulePage();
        hideSettingsPage();
        showAveragesPage();
        hideMenu();
    });

    // Schedule (home) page
    $('.schedule-button').click(function () {
        if (window.areThereClassesToday == true) {
            hideAveragesPage();
            hideLunchPage();
            hideSettingsPage();
            showSchedulePage();
            hideMenu();
        }
    });

    $('.lunch-button').click(function () {
        hideAveragesPage();
        hideSchedulePage();
        hideSettingsPage();
        showLunchPage();
        hideMenu();
    });

    // About page
    $('.about-button').click(function () {
        hideMenu();
        $('.about-page-modal').modal();
    });

    // Settings page
//    $('.settings-button').click(function(){
//        hideMenu();
//        hideSchedulePage();
//        hideAveragesPage();
//        hideLunchPage();
//        showSettingsPage();
//    });

    $('#date-format-input').val($.jStorage.get('date_format'));

});