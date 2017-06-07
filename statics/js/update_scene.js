(function() {
    var addSceneButton = document.getElementById('add-scene'),
        scenesContainer = document.getElementById('scenes'),
        addSceneForm = document.getElementById('add-scene-form'),
        add = document.getElementById('add'),
        cancel = document.getElementById('cancel');

    var json;
    var xmlHttp;
     
    var movieid = window.location.search;
    movieid = movieid.slice(1);
    movieid = movieid.split('=');

    addSceneButton.addEventListener('click', function() {
        handleAddScene(addSceneForm);
    });

    cancel.addEventListener('click', function() {
        handleCancel(addSceneForm);
    });

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://119.29.132.18:3030/api/movie?movieid=' + movieid[1]);
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            json = JSON.parse(xmlHttp.responseText);
            add.addEventListener('click', function() {
                handleSubmit(addSceneForm, movieid[1], json.data.title, cancel);
            });
            if (json.result) {
                insertHTML(json, scenesContainer);
                bindUpdateEventListener(json);
                bindDeleteEventListener(json);
            } else {
                alert(json.message);
            }
        }
    }
    xmlHttp.send();
})();

function insertHTML(json, scenesContainer) {
    var html = '',
        i;

    for (i = 0; i < json.scenes.length; i++) {
        html += '<form class="form clear-f">' +
                '时间：<input class="fr" type="text" name="time" value="' + json.scenes[i].time + '">' +
                '<br>' +
                '<br>' +
                '价格：<input class="fr" type="text" name="price" value="' + json.scenes[i].price + '">' +
                '<br>' +
                '<br>' +
                '座位：<input class="fr" type="text" name="seat" value="' + json.scenes[i].seat + '">' +
                '<br>' +
                '<br>' +
                '剩余座位：<input class="fr" type="text" name="remain" value="' + json.scenes[i].remain + '">' +
                '<input class="fr update" type="button" value="更新">' +
                '<input class="fr delete" type="button" value="删除">' +
                '</form>';
    }

    scenesContainer.innerHTML += html;
}

function handleAddScene(addSceneForm) {
    addSceneForm.style.display = 'block';
}

function handleSubmit(addSceneForm, id, title, cancel) {
    var postData = {},
        json = {};

    postData.time = addSceneForm.time.value;
    postData.price = addSceneForm.price.value;
    postData.seat = addSceneForm.seat.value;
    postData.movieid = id;
    postData.movietitle = title;
    postData = JSON.stringify(postData);

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', 'http://119.29.132.18:3030/api/add_scene');
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            json = JSON.parse(xmlHttp.responseText);
            if (json.result) {
                // cancel.click();
                window.location.reload();
            } else {
                alert(json.message);
            }
        }
    };
    xmlHttp.send(postData);
}

function handleCancel(addSceneForm) {
    addSceneForm.time.value = '';
    addSceneForm.price.value = '';
    addSceneForm.seat.value = '';

    addSceneForm.style.display = 'none';
}

function bindUpdateEventListener(json) {
    var buttons = document.getElementsByClassName('update'),
        i;

    for (i = 0; i < buttons.length; i++) {
        (function(j) {
            buttons[j].onclick = function(event) {
                event = event ? event : window.event;
                var target = event.target ? event.target : event.srcElement;
                handleUpdate(j, json, target.parentNode);
            };
        })(i);
    }
}

function bindDeleteEventListener(json) {
    var buttons = document.getElementsByClassName('delete'),
        i;

    for (i = 0; i < buttons.length; i++) {
        (function(j) {
            buttons[j].onclick = function(event) {
                event = event ? event : window.event;
                var target = event.target ? event.target : event.srcElement;
                handleDelete(json.scenes[j]._id, target.parentNode);
            };
        })(i);
    }
}

function handleUpdate(index, json, form) {
    var postData = {};
    var resData = {};

    postData.movieid = json.data._id;
    postData.movietitle = json.data.title;
    postData.sceneid = json.scenes[index]._id;
    postData.time = form.time.value;
    postData.price = form.price.value;
    postData.seat = form.seat.value;
    postData.remain = form.remain.value;

    postData = JSON.stringify(postData);

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', 'http://119.29.132.18:3030/api/update_scene');
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            resData = JSON.parse(xmlHttp.responseText);
            if (resData.result) {
                alert(resData.message);
                // form.style.display = 'none';
                window.location.reload();
            } else {
                alert(resData.message);
            }
        }
    };
    xmlHttp.send(postData);
}

function handleDelete(id, form) {
    var postData = {
        'sceneid': id
    };

    postData = JSON.stringify(postData);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', 'http://119.29.132.18:3030/api/delete_scene');
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && (xmlHttp.status === 200 || xmlHttp.status === 304)) {
            resData = JSON.parse(xmlHttp.responseText);
            if (resData.result) {
                alert(resData.message);
                // form.style.display = 'none';
                window.location.reload();
            } else {
                alert(resData.message);
            }
        }
    };
    xmlHttp.send(postData);
}