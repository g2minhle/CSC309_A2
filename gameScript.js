var gameEngine = {
    GAME_WIDTH: 400,
    GAME_HEIGHT: 600,
    GAME_TIME: 60,
    GAME_FPS: 60,
    GAME_BACKGROUND: '255, 245, 157',

    selectedLevel: 1,
    gameScore: 0,
    gameLoopPID: 0,
    gameTimerPID: 0,
    timeLeft: 0,
    gamePaused: false,

    score_content: document.getElementById('score-content'),
    gameContext: document.getElementById('game-canvas').getContext('2d'),

    addScore: function (score) {
        gameEngine.gameScore += score;
        gameEngine.score_content.innerHTML = '' + gameEngine.gameScore;
    },

    _gameLost: function () {
        gameEngine.pauseGame();
        gamePage.gameOver();
        homePage.saveHighScore(gameEngine.selectedLevel, gameEngine.gameScore);
    },

    _gameWon: function () {
        gameEngine.pauseGame();
        homePage.saveHighScore(gameEngine.selectedLevel, gameEngine.gameScore);
        if (gameEngine.selectedLevel == 1) {
            gamePage.startGame(gamePage.selectedLevel + 1);
        } else {
            gamePage.gameWon();
        }
    },

    _gameTimer: function () {
        gameEngine.timeLeft--;
        gamePage.setClock(gameEngine.timeLeft);
        if (gameEngine.timeLeft <= 0) {
            gameEngine._gameWon();
        }
    },

    _gameLoop: function () {
        gameEngine.gameContext.canvas.width = gameEngine.GAME_WIDTH;
        gameEngine.gameContext.canvas.height = gameEngine.GAME_HEIGHT;


        gameEngine.gameContext.clearRect(0, 0, gameEngine.GAME_WIDTH, gameEngine.GAME_HEIGHT);
        gameEngine.gameContext.fillStyle = "rgb(" + gameEngine.GAME_BACKGROUND + ")";
        gameEngine.gameContext.fillRect(0, 0, gameEngine.GAME_WIDTH, gameEngine.GAME_HEIGHT);
        
        // update new location
        bugManager.updateBugLocation(foodManager.allFood);
        // update collision
        foodManager.updateFoodCondition(bugManager.bugs);
        
        // check winlose
        if (foodManager.allFood.length == 0) {
            // lose, issue something
            console.log("game over");
            gameEngine._gameLost();
        }

        bugManager.drawBug(gameEngine.gameContext);
        foodManager.drawFood(gameEngine.gameContext);
        bugManager.slowDownBug();
    },

    pauseGame: function () {
        clearInterval(gameEngine.gameLoopPID);
        clearInterval(gameEngine.gameTimerPID);
        bugManager.pauseBugCreation();
        gameEngine.gamePaused = true;
    },


    resumeGame: function () {
        gamePage.setClock(gameEngine.timeLeft);
        gameEngine.gameLoopPID = setInterval(gameEngine._gameLoop, 1000 / gameEngine.GAME_FPS);
        gameEngine.gameTimerPID = setInterval(gameEngine._gameTimer, 1000);
        bugManager.resumeBugCreation();
        gameEngine.gamePaused = false;
    },

    startGame: function (selectedLevel) {
        foodManager.generateFood();
        gameEngine.gameScore = 0;
        gameEngine.addScore(0);
        bugManager.initBugManager(selectedLevel);
        gameEngine.selectedLevel = selectedLevel;
        gameEngine.timeLeft = gameEngine.GAME_TIME;
        gameEngine.resumeGame();
    }
}

var gamePage = {
    STARTING_COUNT_DOWN: 3,

    selectedLevel: 1,
    startingCountDown: 0,
    countDownPID: 0,

    span_timerContent: document.getElementById('span-timerContent'),
    btn_gameCommand: document.getElementById('btn-gameCommand'),

    div_levelStarting: document.getElementById('div-levelStarting'),
    h1_levelStating: document.getElementById('h1-levelStating'),

    div_countDown: document.getElementById('div-countDown'),
    h1_countDown: document.getElementById('h1-countDown'),

    h1_endGame: document.getElementById('h1-endGame'),
    div_endGameButton: document.getElementById('div-endGameButton'),
    btn_endGameBackToMenu: document.getElementById('btn-endGameBackToMenu'),
    btn_endGameButtonRetry: document.getElementById('btn-endGameButtonRetry'),

    h1_pauseGame: document.getElementById('h1-pauseGame'),
    div_pauseGame: document.getElementById('div-pauseGame'),
    btn_pauseGameContinue: document.getElementById('btn-pauseGameContinue'),
    btn_pauseGameExit: document.getElementById('btn-pauseGameExit'),

    game_canvas: document.getElementById('game-canvas'),

    _onGameCommandClicked: function () {
        if (gameEngine.gamePaused) {
            gameEngine.gamePaused = false;
            gamePage.btn_gameCommand.innerHTML = "&#10074;&#10074;";

            if (gamePage.countDownPID != -1) {
                gamePage.countDownPID = setInterval(gamePage._countDown, 1000);
                myLib.show(gamePage.div_countDown);
            } else {
                gameEngine.resumeGame();
                myLib.show(gamePage.game_canvas);
                myLib.hide(gamePage.div_levelStarting);
            }
            myLib.hide(gamePage.div_pauseGame);
        } else {
            gameEngine.gamePaused = true;
            gamePage.btn_gameCommand.innerHTML = "&#9654;";

            myLib.show(gamePage.div_pauseGame);
            myLib.show(gamePage.div_levelStarting);
            myLib.hide(gamePage.game_canvas);

            if (gamePage.countDownPID != -1) {
                clearInterval(gamePage.countDownPID);
                myLib.hide(gamePage.div_countDown);
            } else {
                gameEngine.pauseGame();
            }
        }
    },

    _startGameLoop: function () {
        gameEngine.startGame(gamePage.selectedLevel);
    },

    _countDown: function () {
        gamePage.startingCountDown--;
        gamePage.h1_countDown.innerHTML = '' + gamePage.startingCountDown;
        if (gamePage.startingCountDown == -1) {
            clearInterval(gamePage.countDownPID);
            gamePage.countDownPID = -1;
            myLib.hide(gamePage.div_countDown);
            myLib.hide(gamePage.div_levelStarting);
            gamePage._startGameLoop(gamePage.selectedLevel);
            myLib.show(gamePage.game_canvas);
        }
    },

    _startCountDown: function (selectedLevel) {
        myLib.show(gamePage.div_countDown);
        myLib.show(gamePage.div_levelStarting);
        gamePage.h1_levelStating.innerHTML = 'LEVEL ' + selectedLevel;
        gamePage.startingCountDown = gamePage.STARTING_COUNT_DOWN;
        gamePage.h1_countDown.innerHTML = '' + gamePage.startingCountDown;
        gamePage.countDownPID = setInterval(gamePage._countDown, 1000);
    },

    setClock: function (time) {
        gamePage.span_timerContent.innerHTML = time;
    },

    gameOver: function () {
        myLib.show(gamePage.h1_endGame);
        myLib.hide(gamePage.game_canvas);
        myLib.hide(gamePage.div_pauseGame);
        myLib.show(gamePage.div_endGameButton);
        myLib.show(gamePage.div_levelStarting);
        myLib.show(gamePage.btn_endGameButtonRetry);
    },

    gameWon: function () {
        gamePage.gameOver();
        //myLib.hide(gamePage.btn_endGameButtonRetry);
    },

    _onGoBackToHomePageClicked: function () {
        myLib.hide(tapTapBug.div_gamePage);
        homePage.init();
    },

    _onRetryClicked: function () {
        gamePage.startGame(gamePage.selectedLevel);
    },

    _init: function () {
        gameEngine.gamePaused = false;
        myLib.hide(tapTapBug.div_gamePage);
        myLib.hide(gamePage.div_pauseGame);
        myLib.hide(gamePage.div_endGameButton);
        myLib.hide(gamePage.h1_endGame);
        myLib.hide(gamePage.game_canvas);
        gamePage.btn_gameCommand.innerHTML = "&#10074;&#10074;";
        gamePage.btn_endGameBackToMenu.addEventListener(
            'click',
            gamePage._onGoBackToHomePageClicked);
        gamePage.btn_gameCommand.addEventListener(
            'click',
            gamePage._onGameCommandClicked);
        gamePage.btn_endGameButtonRetry.addEventListener(
            'click',
            gamePage._onRetryClicked);

        gamePage.btn_pauseGameContinue.addEventListener(
            'click',
            gamePage._onGameCommandClicked);

        gamePage.btn_pauseGameExit.addEventListener(
            'click',
            gamePage._onGoBackToHomePageClicked);
        gamePage.game_canvas.addEventListener(
            'click',
            bugManager.killBug); //kill bugs on click
    },

    startGame: function (selectedLevel) {
        gamePage._init();
        myLib.show(tapTapBug.div_gamePage);
        gamePage.selectedLevel = selectedLevel;
        gamePage._startCountDown(selectedLevel);
    }
}

