(function() {
    var info = document.getElementById('info'),
        oldRatings = document.getElementById('old-ratings'),
        newRatings = document.getElementById('new-ratings'),
        submit = document.getElementById('submit'),
        addRatings = document.getElementById('add'),
        updateScenes = document.getElementById('update-scenes'),
        forms = document.forms;

    var json;
    var xmlHttp;
     
    var movieid = window.location.search;
    movieid = movieid.slice(1);
    movieid = movieid.split('=');

    updateScenes.href = updateScenes.href + movieid[1];

    submit.addEventListener('click', function() {
        handleSubmit(forms, movieid[1]);
    });

    addRatings.addEventListener('click', function() {
        handleAddRating(newRatings);
    });

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://119.29.132.18:3030/api/movie?movieid=' + movieid[1]);
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            json = JSON.parse(xmlHttp.responseText);
            if (json.result) {
                insertHTML(json, info, oldRatings);
                bindEventListener();
            } else {
                alert(json.message);
            }
        }
    };
    xmlHttp.send();
})();

function insertHTML(json, info, oldRatings) {
    var infoHtml = '',
        ratingsHtml = '',
        i;

    infoHtml += '<form class="form">' +
                '电影名字：<input class="fr" type="text" name="title" value="' + json.data.title + '">' +
                '<br>' +
                '<br>' +
                '时长：<input class="fr" type="text" name="length" value="' + json.data.length + '">' +
                '<br>' +
                '<br>' +
                '海报URL：<input class="fr" type="text" name="poster" value="' + json.data.poster + '">' +
                '</form>'

    info.innerHTML += infoHtml;

    for (i = 0; i < json.data.ratings.length; i++) {
        ratingsHtml += '<form class="form clear-f">' +
                '来源：<input class="fr" type="text" name="source" value="' + json.data.ratings[i].source + '">' +
                '<br>' +
                '<br>' +
                '评分：<input class="fr" type="text" name="rating" value="' + json.data.ratings[i].rating + '">' +
                '<br>' +
                '<br>' +
                '<input class="fr delete-button" type="button" value="删除">' +
                '</form>';
    }

    oldRatings.innerHTML += ratingsHtml;
}

function handleSubmit(forms, id) {
    var postData = {},
        i,
        xmlHttp;

    postData.movieid = id;
    postData.title = forms[0].title.value;
    postData.length = forms[0].length.value;
    postData.poster = forms[0].poster.value;
    postData.ratings = [];

    if (forms.length > 1) {
        for (i = 1; i < forms.length; i++) {
            if (forms[i].style.display === 'none') {
                continue;
            }
            var scene = {};
            scene.source = forms[i].source.value;
            scene.rating = forms[i].rating.value;
            postData.ratings.push(scene);
        }
    }

    postData = JSON.stringify(postData);

    xmlHttp =  new XMLHttpRequest();
    xmlHttp.open('POST', 'http://119.29.132.18:3030/api/update_movie');
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            json = JSON.parse(xmlHttp.responseText);
            if (json.result) {
                // insertHTML(json, container);
                wondow.location.reload();
            } else {
                alert(json.message);
            }
        }
    };
    xmlHttp.send(postData);
}

function handleAddRating(ratings) {
    var html = '';

    html += '<form class="form clear-f">' +
            '来源：<input class="fr" type="text" name="source">' +
            '<br>' +
            '<br>' +
            '评分：<input class="fr" type="text" name="rating">' +
            '<br>' +
            '<br>' +
            '<input type="button" class="fr delete-button" name="delete" value="删除">'
            '</form>';

    ratings.innerHTML += html;

    bindEventListener();
}

function bindEventListener() {
    var buttons = document.getElementsByClassName('delete-button'),
        i;

    for (i = 0; i < buttons.length; i++) {
        if (!buttons[i].onclick) {
            buttons[i].onclick = function(event) {
                event = event ? event : wondow.event;
                var target = event.target ? event.target : event.srcElement;
                target.parentNode.style.display = 'none';
            };
        }
    }
}