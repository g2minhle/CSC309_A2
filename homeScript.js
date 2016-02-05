var homePage = {
    selectedLevel: 1,
    savedHighScore: {},

    btn_startGameButton: document.getElementById('btn-startGame'),
    btn_levelButtons: document.getElementsByClassName('btn-level'),
    h1_highScore: document.getElementById('h1-highScore'),

    _onLevelButtonClicked: function (e) {
        console.log('User clicked button ' + this.id);
        myLib.forEach(homePage.btn_levelButtons,
            function (aLevelButton) {
                console.log('Remove active class from a level button');
                myLib.removeClass(aLevelButton, 'active');
                myLib.addClass(aLevelButton, 'fade');
            });
        myLib.addClass(this, 'active');
        myLib.removeClass(this, 'fade');
        homePage.selectedLevel = this.value;
        homePage.h1_highScore.innerHTML = homePage.savedHighScore[this.value];
    },

    _onStartGameClicked: function (e) {
        console.log('Start game button clicked');
        myLib.hide(tapTapBug.div_homePage);
        gamePage.startGame(homePage.selectedLevel);
    },

    init: function () {
        console.log('Start init game');


        homePage.savedHighScore = localStorage.getItem("ttb_homePage_savedHighScore");
        if (!(homePage.savedHighScore)) {
            homePage.savedHighScore = {
                1: 0,
                2: 0
            }
        }
        homePage.h1_highScore.innerHTML = homePage.savedHighScore["1"];

        homePage.btn_startGameButton.addEventListener('click', homePage._onStartGameClicked);

        myLib.forEach(homePage.btn_levelButtons,
            function (currentLevelButton) {
                currentLevelButton.addEventListener(
                    'click',
                    homePage._onLevelButtonClicked);
            });
    },
}

homePage.init();