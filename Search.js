function Search() {
}

Search.Save = function (mealListModel, onSuccess) {
    var document = {'mealList': mealListModel.toJSON()};
    $.post('http://zbiki.ddns.net/diets/diet', JSON.stringify(document), onSuccess);
};

Search.Load = function (dietId, mealListModel) {
    $.get('http://zbiki.ddns.net/diets/diet/' + dietId + '/_source', function onSuccess(data) {
        var mealList = data['mealList'];

        _.each(mealList, function (meal) {
            var mealModel = new Meal({
                name: meal.name,
                productList: new ProductList(meal.productList)
            });
            mealListModel.add(mealModel);
        });
    });
};