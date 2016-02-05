var gamePage = {
    startGame: function (selectedLevel) {
        myLib.addClass(tapTapBug.div_homePage,'hide');
        myLib.removeClass(tapTapBug.div_gamePage,'hide');
        alert(selectedLevel);
    }
}

