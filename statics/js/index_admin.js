(function() {
    var container = document.getElementById('container');

    var json;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://119.29.132.18:3030/api/movies');
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            json = JSON.parse(xmlHttp.responseText);
            if (json.result) {
                insertHTML(json, container);
                bindEventListener(json, container);
            } else {
                alert(json.message);
            }
        }
    };
    xmlHttp.send(json);
})();

function insertHTML(json, container) {
    var html = '', i;
    for (i = 0; i < json.count; i++) {
        html += '<div class="movie">' +
            '<a href="' + './movie.html?movieid=' + json.data[i]._id +
            '"><img class="fl movie-img" src="' + json.data[i].poster + '" alt="' + json.data[i].title + '"></a>' +
            '<div class="fl info">' +
            '<a href="' + './movie.html?movieid=' + json.data[i]._id + '"><p class="title">' + json.data[i].title + '</p></a>' +
            '<p>时长:' + json.data[i].length + '分钟' + '</p>' +
            '</div>' +
            '<div class="fr">' +
            '<input type="button" value="删除">' +
            '<a href="./movie.html?movieid=' + json.data[i]._id + '">更新</a>' +
            '</div>' +
            '</div>';
    }
    container.innerHTML = container.innerHTML + html;
}

function bindEventListener(json, container) {
    var buttons = document.getElementsByTagName('input');
    var i;

    for (i = 0; i < buttons.length; i++) {
        (function(j) {
            buttons[j].addEventListener('click', function() {
                deletePost(j, json.data[j]._id);
            });
        })(i);
    }
}

function deletePost(index, movieid) {
    var postData = {
        'movieid': movieid
    };

    postData = JSON.parse(JSON.stringify(postData));

    var xml = new XMLHttpRequest();
    xml.open("POST", "http://119.29.132.18:3030/api/delete_movie");
    xml.onreadystatechange = function() {
        if (xml.readyState == 4 && (xml.status === 200 || xml.status === 304)) {
            // var json = JSON.parse(xml.responseText);
            if (xml.responseText.result) {
                window.location.reload();
            } else {
                alert(xml.responseText);
            }
        }
    };
    xml.send(postData);
}