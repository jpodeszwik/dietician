function Search() {
}

Search.Save = function (daysModel, onSuccess) {
    var document = {'daysCollection': daysModel.toJSON()};
    $.post('http://zbiki.ddns.net/diets/diet', JSON.stringify(document), onSuccess);
};

Search.Load = function (dietId, daysCollection, onDone) {
    $.get('http://zbiki.ddns.net/diets/diet/' + dietId + '/_source', function onSuccess(data) {
        var daysList = data.daysCollection;

        _.each(daysList, function (day) {
            var mealsCollection = new MealList();
            _.each(day.meals, function (meal) {
                var mealModel = new Meal({
                    name: meal.name,
                    productList: new ProductList(meal.productList)
                });
                mealsCollection.add(mealModel);
            });
            var day = new Day({
                name: day.name,
                meals: mealsCollection,
                active: day.active
            });
            daysCollection.add(day);
        });

        onDone();
    });
};