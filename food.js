var foodManager = {
    FOOD_WIDTH: 40,
    FOOD_HEIGHT: 40,
    FOOD_COUNT: 5,
    FOOD_IMG_URL: './Birthday_Cupcake_Drawing.png',

    allFood: [],
    foodImage: null,

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

    _hasFoodOverlap: function (newFood) {
        for (var i = 0; i < foodManager.allFood.length; i++) {
            if (myPhysicLib.hasCollision(newFood, foodManager.allFood[i])) {
                return true;
            }
        }
        return false;
    },

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

    drawFood: function (gameCanvas) {
        console.log("drawFood");
        for (var i = foodManager.allFood.length - 1; i > -1; i--) {
            var food = foodManager.allFood[i];
            if (!food.available) {
                food.opacity -= 2;
                if (food.opacity == 0) {
                    myLib.removeAt(foodManager.allFood, i);
                    continue;
                }
            }
            gameCanvas.globalAlpha = food.opacity;
            gameCanvas.drawImage(
                foodManager.foodImage,
                food.x, food.y,
                foodManager.FOOD_WIDTH, foodManager.FOOD_HEIGHT);
            gameCanvas.globalAlpha = 1.0;
        };
    }
}