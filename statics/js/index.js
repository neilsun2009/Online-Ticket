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
            } else {
                alert(json.message);
            }
        }
    }
    xmlHttp.send(json);
})();

function insertHTML(json, container) {
    var html = '', i;
    for (i = 0; i < json.count; i++) {
        html += '<div class="movie">' +
            '<a href="' + '/detail.html?movieid=' + json.data[i]._id +
            '"><img class="fl movie-img" src="' + json.data[i].poster + '" alt="' + json.data[i].title + '"></a>' +
            '<div class="fl info">' +
            '<a href="' + '/detail.html?movieid=' + json.data[i]._id + '"><p class="title">' + json.data[i].title + '</p></a>' +
            '<p>时长:' + json.data[i].length + '分钟' + '</p>' +
            '</div>' +
            '</div>';
    }
    container.innerHTML = container.innerHTML + html;
}