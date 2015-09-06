function Search() {
}

Search.Save = function (mealListModel, onSuccess) {
    var document = {'mealList': mealListModel.toJSON()};
    $.post('http://zbiki.ddns.net/diets/diet', JSON.stringify(document), onSuccess);
};

Search.Load = function (dietId, mealListModel) {
    $.get('http://zbiki.ddns.net/diets/diet/' + dietId + '/_source', function onSuccess(data) {
        var mealList = data['mealList'];

        //somehow MealList model didn't want to load the whole json
        mealList.forEach(function (meal) {
            var mealModel = new Meal({
                name: meal['name'],
                productList: new ProductList(meal['productList'])
            });
            mealListModel.add(mealModel);
        });
        onSuccess(mealListModel);
    });
};