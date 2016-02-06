var bugManager = {
    BUG_WIDTH: 10,
    BUG_HEIGHT: 40,

    BUG_TYPE: [
        {
            color: 'black',
            score: 5,
            speed: {
                1: 1,
                2: 2,
            }
        },
        {
            color: 'red',
            score: 3,
            speed: {
                1: 1,
                2: 2,
            }
        },
        {
            color: 'orange',
            score: 1,
            speed: {
                1: 1,
                2: 2,
            }
        },
    ],

    bugs: [],
    selectedLevel: 1,
    bugCreationPID: 0,

    _randomBugType: function () {
        var randomNumber = myLib.getRandomNumber(1, 10);
        if (1 <= randomNumber && randomNumber <= 3) {
            return 0;
        } else if (3 < randomNumber && randomNumber <= 6) {
            return 1;
        } else {
            return 2;
        }
    },

    _createBug: function () {
        console.log("Bug created");
        var bugType = bugManager._randomBugType(),
            newBug = {
                width: bugManager.BUG_WIDTH,
                height: bugManager.BUG_HEIGHT,
                x: myLib.getRandomNumber(10, 380),
                y: -bugManager.BUG_HEIGHT,
                opacity: 1,
                alive: true,
                format: 'rectangle',
                bugType: bugType
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
        var i = 0;
        for (i = bugManager.bugs.length - 1; i > -1; i--) {
            var bug = bugManager.bugs[i];
            if (!bug.alive) {
                bug.opacity -= 2;
                if (bug.opacity == 0) {
                    myLib.removeAt(bugManager.bugs, i);
                    continue;
                }
            }

            gameContext.globalAlpha = bug.opacity;
            // TODO Draw the bug
            gameContext.rect(bug.x, bug.y, bug.width, bug.height);
            gameContext.stroke();
            gameContext.globalAlpha = 1.0;
        }
    },

    /*
    *  Return the nearest food based on x and y position
    */
    _getNearestFoodFromBug: function (bug, allFood) {
        if (allFood.length == 0) return null;
        var nearestFood = null;
        var nearestDistance = Number.MAX_VALUE;
        allFood.forEach(function (food) {
            if (!food.available) return;
            var distance = myPhysicLib.distanceBetween(bug, food);
            if (distance < nearestDistance && food.available === true) {
                nearestFood = food;
                nearestDistance = distance;
            }
        });
        return nearestFood;
    },

    updateBugLocation: function (allFood) {
        var i = 0;
        for (i = 0; i < bugManager.bugs.length; i++) {
            var bug = bugManager.bugs[i];
            if (!bug.alive) continue;
            var nearestFood = bugManager._getNearestFoodFromBug(bug, allFood);
            if (nearestFood == null) return;
            if (nearestFood.x - bug.x > 0) {
                bug.x += 1;
            } else if (nearestFood.x - bug.x < 0) {
                bug.x -= 1;
            }

            if (nearestFood.y - bug.y > 0) {
                bug.y += 1;
            } else if (nearestFood.y - bug.y < 0) {
                bug.y -= 1;
            }
        }
    }
}