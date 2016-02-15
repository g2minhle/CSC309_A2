var foodManager = {
    FOOD_WIDTH: 40,
    FOOD_HEIGHT: 40,
    FOOD_COUNT: 5,
    FOOD_IMG_URL: './Birthday_Cupcake_Drawing.png',

    allFood: [],
    foodImage: null,
    
    /* Creates food.
     */
    _createFood: function () {
        return {
            id: foodManager.allFood.length,
            width: foodManager.FOOD_WIDTH,
            height: foodManager.FOOD_HEIGHT,
            opacity: 1,
            available: true,
            format: 'rectangle',
            x: myLib.getRandomNumber(
                foodManager.FOOD_WIDTH,
                gameEngine.GAME_WIDTH - foodManager.FOOD_WIDTH),
            y: myLib.getRandomNumber(
                gameEngine.GAME_HEIGHT * 0.2,
                gameEngine.GAME_HEIGHT - foodManager.FOOD_HEIGHT),
        };
    },
    /* Checks if there is any overlap in food.
     */
    _hasFoodOverlap: function (newFood) {
        for (var i = 0; i < foodManager.allFood.length; i++) {
            if (myPhysicLib.hasCollision(newFood, foodManager.allFood[i])) {
                return true;
            }
        }
        return false;
    },
    /* Generates food and uses image.
     */
    generateFood: function () {
        foodManager.foodImage = new Image();
        foodManager.foodImage.src = foodManager.FOOD_IMG_URL;
        foodManager.allFood = [];
        for (var i = 0; i < foodManager.FOOD_COUNT; i++) {
            var newFood;
            do {
                newFood = foodManager._createFood();
            } while (foodManager._hasFoodOverlap(newFood));

            foodManager.allFood.push(newFood);
        }
    },
    /* Draws out food on the gameCanvas
     */
    drawFood: function (gameCanvas) {
        //console.log("drawFood");
        for (var i = foodManager.allFood.length - 1; i > -1; i--) {
            var food = foodManager.allFood[i];
            if (!food.available) {
                //console.log("Fade food");   
                foodManager.allFood[i].opacity -= 0.02;
                if (foodManager.allFood[i].opacity <= 0) {
                    myLib.removeAt(foodManager.allFood, i);
                    continue;
                }
            }
            gameCanvas.globalAlpha = foodManager.allFood[i].opacity;
            //gameCanvas.rect(food.x, food.y, foodManager.FOOD_WIDTH, foodManager.FOOD_HEIGHT);
            //gameCanvas.stroke();

            gameCanvas.drawImage(
                foodManager.foodImage,
                food.x, food.y,
                foodManager.FOOD_WIDTH, foodManager.FOOD_HEIGHT);
            gameCanvas.globalAlpha = 1;
        };
    },
    /* Checks if food is eaten.
     */
    updateFoodCondition: function (bugs) {
        var i, j = 0;
        for (i = 0; i < foodManager.allFood.length; i++) {
            if (!foodManager.allFood[i].available) continue;
            for (j = 0; j < bugs.length; j++) {
                //console.log("Test food and bug");
                if (myPhysicLib.hasCollision(foodManager.allFood[i], bugs[j])) {
                    console.log("Lost food" + i);
                    foodManager.allFood[i].available = false;
                }
            }
        }
    }
}
