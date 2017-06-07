(function() {
    var ratings = document.getElementById('ratings'),
        forms = document.forms,
        submit = document.getElementById('submit'),
        addRating = document.getElementById('add-rating');

    submit.addEventListener('click', function() {
        handleSubmit(forms);
    });

    addRating.addEventListener('click', function() {
        handleAddRating(ratings);
    });
})();

function handleSubmit(forms) {
    // alert(forms.length);
    var postData = {},
        i,
        xmlHttp;

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

    postData = JSON.parse(JSON.stringify(postData));

    // console.log(postData);
    xmlHttp =  new XMLHttpRequest();
    xmlHttp.open('POST', 'http://119.29.132.18:3030/api/add_movie');
    xmlHttp.setRequestHeader('Content-Type', 'application/json');

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            json = JSON.parse(xmlHttp.responseText);
            if (json.result) {
                window.location.href = '/admin/admin.html';
            } else {
                alert(json.message);
            }
        }
    };
    xmlHttp.send(JSON.stringify(postData));
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
        buttons[i].addEventListener('click', function(event) {
            event = event ? event : wondow.event;
            var target = event.target ? event.target : event.srcElement;
            target.parentNode.style.display = 'none';
        });
    }
}