/* eslint-disable no-undef */
$(function () {
    // toggle
    var flag = true;
    $('.switch-btn').on('click', function (e) {
        e.preventDefault();

        $('input').val('');

        if (flag) {
            flag = false;
            $('.register').show('slow');
            $('.login').hide();
        } else {
            flag = true;
            $('.login').show('slow');
            $('.register').hide();
        }
    });

    // clear
    $('.btn').on('click', function () {
        $('div.alert').remove();
    });
    $('input').on('focus', function() {
        $('div.alert').remove();
        $('input').removeClass('is-invalid');
    });


    $('.register-btn').on('click', function (e) {
        e.preventDefault();

        var data = {
            login: $('#register-login').val(),
            password: $('#register-password').val(),
            passwordConfirm: $('#register-password-confirm').val()
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/auth/register'
        }).done(function (data) {
            if (!data.ok) {
                $('.register h5').after('<div class="alert alert-danger" role="alert">' + data.error + '</div>');
                if (data.fields) {
                    data.fields.forEach(function(item) {
                        $('input[name=' + item + ']').addClass('is-invalid');
                    });
                }
            } else {
                $('.register h5').after('<div class="alert alert-success" role="alert">Вы зарегестрированны!</div>');
            }
        })
    });
});

/* eslint-enable no-undef */