(function() {
    var container = document.getElementById('container');

    var json;

    var movieid = window.location.search;
    movieid = movieid.slice(1);
    movieid = movieid.split('=');

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://119.29.132.18:3030/api/movie?movieid=' + movieid[1]);
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            json = JSON.parse(xmlHttp.responseText);
            if (json.result) {
                insertHTML(json, container);
                postHandle(json);
            } else {
                alert(json.message);
            }
        }
    }
    xmlHttp.send();
})();

function insertHTML(json, container) {
    var html = '', i;
    html += '<div class="movie">' +
        '<img class="fl movie-img" src="' + json.data.poster + '" alt="' + json.data.title + '">' +
        '<div class="fl info">' +
        '<p class="title">' + json.data.title + '</p>' +
        '<p>时长:' + json.data.length + '分钟' + '</p>' +
        '</div>' +
        '</div>';

    html += '<ul class="score-list clear-f">';
    for (i = 0; i < json.data.ratings.length; i++) {
        html += '<li class="fl">' +
                '<p>' + json.data.ratings[i].source + '</p>' +
                '<p>' + json.data.ratings[i].rating + '</p>' +
                '</li>';
    }
    html += '</ul>';

    html += '<div class="time-list">';       
    for (i = 0; i < json.scenes.length; i++) {
        html += '<div class="time">' +
                '<span class="fl">' + json.scenes[i].time + '</span>' +
                '<span class="fl">￥' + json.scenes[i].price + '</span>' +
                '<span class="fl">剩余座位：' + json.scenes[i].remain + '</span>' +
                '<input class="fr" type="radio" name="scene">' +
                '</div>';
    }
    html += '</div>';

    html += '<div class="fr buy-container">' +
            '购买 <input id="count" maxlength="2" size="2" type="text" pattern="[0-9]+"> 张' +
            '<br>' +
            '<br>' +
            '<input class="fr" id="buy" type="button" value="购买">' +
            '<br>' +
            '<br>' +
            '<br>' +
            '<br>' +
            '</div>';

    container.innerHTML = container.innerHTML + html;
}

function postHandle(json) {
    var radios = document.querySelectorAll('input[type="radio"]'),
        buy = document.getElementById('buy'),
        count = document.getElementById('count'),
        i;

    buy.addEventListener('click', function() {
        var num;

        for (i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                break;
            }
        }
        if (i >= radios.length) {
            alert('请选择场次！');
            return;
        }

        if (count.value === '') {
            alert('请选择购买票数！');
            return;
        }
        num = parseInt(count.value);

        var postData = {
            'sceneid': json.scenes[i]._id,
            'num': num
        };

        postData = JSON.parse(JSON.stringify(postData));
        var xml = new XMLHttpRequest();
        xml.open("POST", 'http://119.29.132.18:3030/api/buy_ticket');
        xml.setRequestHeader('Content-Type', 'application/json');
        xml.onreadystatechange = function() {
            if (xml.readyState == 4 && (xml.status === 200 || xml.status === 304)) {
                var responseText = JSON.parse(xml.responseText);
                if (responseText.result) {
                    alert(responseText.message);
                } else if (responseText.message === 'no user logged in') {
                    window.location.href = '/login';
                }
            }
        }
        xml.send(postData);
    });
}