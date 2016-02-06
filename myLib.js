var myLib = {
    addClass: function (object, newClassName) {
        if (object.className.indexOf(newClassName) == -1) {
            object.className += ' ' + newClassName;
        }
    },

    removeClass: function (object, className) {
        var currentClassName = object.className;
        while (currentClassName.indexOf(className) != -1) {
            currentClassName = currentClassName.replace(className, '');
        }
        while (currentClassName.indexOf('  ') != -1) {
            currentClassName = currentClassName.replace('  ', ' ');
        }
        object.className = currentClassName.trim();
    },

    show: function (object) {
        myLib.removeClass(object, 'hide');
    },

    hide: function (object) {
        myLib.addClass(object, 'hide');
    },

    forEach: function (array, myFunction) {
        for (var i = 0; i < array.length; i++) {
            myFunction(array[i]);
        }
    },

    getRandomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    removeAt: function (array, index) {
        array.splice(index, 1);
    },
}

var myPhysicLib = {
    hasCollision: function (obj1, obj2) {
        return (obj1.format === 'rectangle'
            && obj2.format === 'rectangle'
            && obj1.x < obj2.x + obj2.width
            && obj1.x + obj1.width > obj2.x
            && obj1.y < obj2.y + obj2.height
            && obj1.height + obj1.y > obj2.y);
    },

    distanceBetween: function (obj1, obj2) {
        var v1 = Math.pow((obj1.x - obj2.x), 2);
        var v2 = Math.pow((obj1.y - obj2.y), 2);
        return Math.sqrt(v1 + v2, 2);
    }
}

function Timer(fn, countdown, repeat) {
    function _time_diff(date1, date2) {
        return date2 - date1;
    }

    function cancel() {
        clearTimeout(ident);
    }

    function pause() {
        clearTimeout(ident);
        total_time_run = _time_diff(start_time, new Date().getTime());
    }

    function work() {
        fn();
        if (repeat) {
            start_time = new Date().getTime(),
            ident = setTimeout(fn, countdown);
        }
    }

    function resume() {
        ident = setTimeout(work, countdown - total_time_run);
    }

    var start_time = new Date().getTime(),
        ident = setTimeout(fn, countdown);

    return { cancel: cancel, pause: pause, resume: resume };
}

var tapTapBug = {
    div_gamePage: document.getElementById('div-gamePage'),
    div_homePage: document.getElementById('div-homePage'),
};