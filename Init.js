$(function () {
    nunjucks.configure("", {web: {useCache: true}});

    var dietId = url('?id');
    if (dietId != null) {
        $.get('http://zbiki.ddns.net/diets/diet/' + dietId + '/_source', function onSuccess(data) {
            var mealList = data['mealList'];
            var mealListModel = new MealList();

            //somehow MealList model didn't want to load the whole json
            mealList.forEach(function (meal) {
                var mealModel = new Meal({
                    name: meal['name'],
                    productList: new ProductList(meal['productList'])
                });
                mealListModel.add(mealModel);
            });

            var mealListView = new MealListView(mealListModel);
        });
    } else {
        var mealListView = new MealListView(new MealList());
    }

    $.get('http://zbiki.ddns.net/products/_search?size=1000', function onSuccess(data) {
        var hits = data["hits"]["hits"];

        hits.forEach(function (hit) {
            var product = hit["_source"];
            products.addProduct(product);
        });
    });
});
