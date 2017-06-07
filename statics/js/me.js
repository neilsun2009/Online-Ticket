(function() {
    var container = document.getElementById('container');

    var json;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://119.29.132.18:3030/api/movie?movieid=' + movieid[1]);
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            json = JSON.parse(xmlHttp.responseText);
            if (json.result) {
                insertHTML(json, container);
            } else {
                alert(json.message);
            }
        }
    }
    xmlHttp.send();
})();

function insertHTML(json, container) {
    var html = '',
        i;

    for (i = 0; i < json.scenes.length; i++) {
        html += '<div class="movie-info clear-f">' +
            '<div class="fl info">' +
            '<p>' + json.scenes[i].movietitle + '</p>' +
            '<p>' + json.data.scenes[i].num + '</p>'
            '</div>'
            '<span class="time">12:45</span>'
        '</div>'
    }

    container.innerHTML += html;
}