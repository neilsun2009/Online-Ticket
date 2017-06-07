(function() {
    var buttons = document.getElementsByTagName('input');
    var unReg = /^[a-zA-Z0-9_]{3,16}$/,
        pwReg = /^[a-zA-Z\d_]{6,}$/,
        json = {
            'username': '',
            'password': ''
        },
        error = '';

    buttons[buttons.length - 1].addEventListener('click', handleSubmit, false);

    function handleSubmit(event) {
        event = event ? event : window.event;
        var target = event.target ? event.target : event.srcElement;

        error = '';

        if (!unReg.test(buttons[0].value)) {
            error += '用户名格式不正确！！！';
        }
        if (!pwReg.test(buttons[1].value)) {
            error += '\n' + '密码格式不正确！！！';
        }
        if (buttons[1].value !== buttons[2].value) {
            error += '\n' + '密码不一致！！！';
        }

        if (error !== '') {
            alert(error);
            return;
        }

        json.username = buttons[0].value;
        json.password = buttons[1].value;
        json = JSON.stringify(json);
        // console.log(json);
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", 'http://119.29.132.18:3030/api/signup');
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
                var responseText = JSON.parse(xmlHttp.responseText);
                if (responseText.result) {
                    alert(responseText.message);
                    window.location.href = '/';
                } else {
                    alert('该账户已被注册！！！');
                }
            }
        };
        xmlHttp.send(json);
    }
})();