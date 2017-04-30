function Search() {
}

Search.Save = function (diet, onSuccess) {
    var document = diet.toJSON();
    $.ajax({
      url:'api/diets',
      type:"POST",
      data: JSON.stringify(document),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: onSuccess
    });
};

Search.Load = function (dietId, onDone) {
    $.get(`api/diets/${dietId}`, function onSuccess(data) {
        var diet = new Diet();
        var daysCollection = new DayCollection();
        diet.set('days', daysCollection);
        diet.set('caloricIntake', new CaloricIntakeModel(data.caloricIntake));

        var daysList = data.days;
        _.each(daysList, function (day) {
            var mealsCollection = new MealList();
            _.each(day.meals, function (meal) {
                var mealModel = new Meal({
                    name: meal.name,
                    ingredientList: new IngredientList(meal.ingredientList)
                });
                mealsCollection.add(mealModel);
            });
            var dayModel = new Day({
                name: day.name,
                meals: mealsCollection,
                active: day.active
            });
            daysCollection.add(dayModel);
        });

        onDone(diet);
    });
};