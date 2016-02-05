var gameEngine = {
    GAME_WIDTH: 400,
    GAME_HEIGHT: 600,
    GAME_TIME: 60,
    GAME_FPS: 60,
    GAME_BACKGROUND: '255, 245, 157',

    selectedLevel: 1,
    gameScore: 0,
    gameLoopPID: 0,

    gameContext: document.getElementById('game-canvas').getContext('2d'),

    _gameLoop: function () {
        gameEngine.gameContext.clearRect(0, 0, gameEngine.GAME_WIDTH, gameEngine.GAME_HEIGHT)
        gameEngine.gameContext.fillStyle = "rgb(" + gameEngine.GAME_BACKGROUND + ")";
        gameEngine.gameContext.fillRect(0, 0, gameEngine.GAME_WIDTH, gameEngine.GAME_HEIGHT);
        
        // update new location 
        // update collision
        
        // check winlose

        bugManager.drawBug(gameEngine.gameContext);
        foodManager.drawFood(gameEngine.gameContext);
    },

    pauseGame: function () {
        clearInterval(gameEngine.gameLoopPID);
        bugManager.pauseBugCreation();
    },
    
    resumeGame: function () {
        gameEngine.gameLoopPID = setInterval(gameEngine._gameLoop, 1000 / gameEngine.GAME_FPS);
    },

    startGame: function (selectedLevel) {
        foodManager.generateFood();
        bugManager.initBugManager(selectedLevel);
        gameEngine.selectedLevel = selectedLevel;

        gameEngine.gameContext.canvas.width = gameEngine.GAME_WIDTH;
        gameEngine.gameContext.canvas.height = gameEngine.GAME_HEIGHT;
        
        gameEngine.resumeGame();
    }
}

var gamePage = {
    STARTING_COUNT_DOWN: 0,

    selectedLevel: 1,
    startingCountDown: 0,

    div_countDown: document.getElementById('div-countDown'),
    div_levelStarting: document.getElementById('div-levelStarting'),
    h1_levelStating: document.getElementById('h1-levelStating'),
    h1_countDown: document.getElementById('h1-countDown'),
    btn_gameCommand: document.getElementById('btn-gameCommand'),

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
            }
        }, 1000);
    },

    startGame: function (selectedLevel) {
        myLib.show(tapTapBug.div_gamePage);
        gamePage.selectedLevel = selectedLevel;
        gamePage._startCountDown(selectedLevel);

        gamePage.btn_gameCommand.addEventListener('click', gamePage._onGameCommandClicked);
    }
}

