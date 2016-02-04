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
    
    forEach: function(array, myFunction){
        for (var i = 0; i < array.length; i++) {
            myFunction(array[i]);
        }
    },
}