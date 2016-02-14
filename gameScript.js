var gameEngine = {
    GAME_WIDTH: 400,
    GAME_HEIGHT: 600,
    GAME_TIME: 60,
    GAME_FPS: 600,
    GAME_BACKGROUND: '255, 245, 157',

    selectedLevel: 1,
    gameScore: 0,
    gameLoopPID: 0,
    gameTimerPID: 0,
    timeLeft: 0,
    GAME_PAUSED: false,

    gameContext: document.getElementById('game-canvas').getContext('2d'),

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
            // TODO: done game 
        }
    },

    _gameTimer: function () {
        gameEngine.timeLeft--;
        gamePage.setClock(gameEngine.timeLeft);
        if (gameEngine.timeLeft == 0) {
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
        document.addEventListener("click",bugManager.killBug); //kill bugs on click
    },

    pauseGame: function () {
        clearInterval(gameEngine.gameLoopPID);
        clearInterval(gameEngine.gameTimerPID);
        bugManager.pauseBugCreation();
        GAME_PAUSED = true;
    },


    resumeGame: function () {
        gamePage.setClock(gameEngine.timeLeft);
        gameEngine.gameLoopPID = setInterval(gameEngine._gameLoop, 1000 / gameEngine.GAME_FPS);
        gameEngine.gameTimerPID = setInterval(gameEngine._gameTimer, 1000);
    },

    startGame: function (selectedLevel) {
        foodManager.generateFood();
        bugManager.initBugManager(selectedLevel);
        gameEngine.selectedLevel = selectedLevel;
        gameEngine.timeLeft = gameEngine.GAME_TIME;
        gameEngine.resumeGame();
    }
}

var gamePage = {
    STARTING_COUNT_DOWN: 0,

    selectedLevel: 1,
    startingCountDown: 0,

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
    pausebutton: document.getElementById("div-pausebutton"),
    continuebutton: document.getElementById("btn-continue"),
    quitbutton: document.getElementById("btn-quit"),
    h1_endGame: document.getElementById('h1-pauseGame'),
    div_pauseGame: document.getElementById('div-pauseGame'),

    game_canvas: document.getElementById('game-canvas'),

    _onGameCommandClicked: function () {
        // TODO:
        // pause gameEngine
        // display quit or resume 
    },
    
    // TODO: add resume clicked
    // TODO: add quit to home page 

    _startGameLoop: function () {
        gameEngine.startGame(gamePage.selectedLevel);
    },

    _startCountDown: function (selectedLevel) {
        myLib.show(gamePage.div_countDown);
        myLib.show(gamePage.div_levelStarting);
        gamePage.h1_levelStating.innerHTML = 'LEVEL ' + selectedLevel;
        gamePage.startingCountDown = gamePage.STARTING_COUNT_DOWN;
        gamePage.h1_countDown.innerHTML = '' + gamePage.startingCountDown;
        var countDownPID = setInterval(function () {
            gamePage.startingCountDown--;
            gamePage.h1_countDown.innerHTML = '' + gamePage.startingCountDown;
            if (gamePage.startingCountDown == -1) {
                clearInterval(countDownPID);
                myLib.hide(gamePage.div_countDown);
                myLib.hide(gamePage.div_levelStarting);
                gamePage._startGameLoop(selectedLevel);
                myLib.show(gamePage.game_canvas);
            }
        }, 1000);
    },

    setClock: function (time) {
        gamePage.span_timerContent.innerHTML = time;
    },

    gameOver: function () {
        if (gamePage.selectedLevel == 1){
            myLib.show(gamePage.h1_endGame);
            myLib.show(gamePage.div_levelStarting);
            myLib.show(gamePage.div_endGameButton);
            myLib.hide(gamePage.game_canvas);
            myLib.hide(gamePage.div_pauseGame);
        }
        else{
            myLib.show(gamePage.h1_endGame);
            myLib.show(gamePage.div_levelStarting);
            myLib.show(gamePage.div_endGameButton);
            myLib.hide(gamePage.btn_endGameButtonRetry);
            myLib.hide(gamePage.game_canvas);
            myLib.hide(gamePage.div_pauseGame);
        }
    },

    _onGoBackToHomePageClicked: function () {
        myLib.hide(tapTapBug.div_gamePage);
        homePage.init();
    },

    _onRetryClicked: function () {
        gamePage.startGame(gamePage.selectedLevel);
    },

    _init: function () {
        myLib.hide(gamePage.h1_endGame);
        myLib.hide(gamePage.div_endGameButton);
        myLib.hide(gamePage.game_canvas);
        myLib.hide(tapTapBug.div_gamePage);
        gamePage.btn_endGameBackToMenu.addEventListener(
            'click',
            gamePage._onGoBackToHomePageClicked);
        gamePage.btn_gameCommand.addEventListener(
            'click',
            gamePage._onGameCommandClicked);
        gamePage.btn_endGameButtonRetry.addEventListener(
            'click',
            gamePage._onRetryClicked);

    },

    startGame: function (selectedLevel) {
        gamePage._init();
        myLib.show(tapTapBug.div_gamePage);
        gamePage.selectedLevel = selectedLevel;
        gamePage._startCountDown(selectedLevel);

    }
}

