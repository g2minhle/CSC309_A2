var bugManager = {
    BUG_WIDTH: 10,
    BUG_HEIGHT: 40,

    bugs: [],
    selectedLevel: 1,
    bugCreationPID: 0,

    _createBug: function () {
        console.log("Bug created");
        var newBug = {
            x: myLib.getRandomNumber(10, 380)
        };
        bugManager.bugs.push(newBug);
        bugManager.resumeBugCreation();
    },

    pauseBugCreation: function () {
        clearInterval(bugManager.bugCreationPID);
    },

    resumeBugCreation: function () {
        bugManager.bugCreationPID = setTimeout(
            bugManager._createBug,
            myLib.getRandomNumber(1000, 3000));
    },

    initBugManager: function (selectedLevel) {
        var i;
        bugManager.bugs = [];
        bugManager.selectedLevel = selectedLevel;
        bugManager.resumeBugCreation();
    },

    drawBug: function (gameContext) {

    }
}