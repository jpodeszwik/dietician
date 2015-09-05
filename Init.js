$(function () {
    nunjucks.configure("", {web: {useCache: true}});

    $.fn.editable.defaults.mode = 'inline';
    $.fn.editable.defaults.showbuttons = false;
    $.fn.editable.defaults.showbuttons = false;
    $.fn.editable.defaults.onblur = 'submit';

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
        var mealList = new MealList();
        var firstMeal = new Meal();
        firstMeal.set('name', "Meal 1");
        mealList.add(firstMeal);
        var mealListView = new MealListView(mealList);
    }

    var caloricIntakeView = new CaloricIntakeView();

    $.get('http://zbiki.ddns.net/products/_search?size=1000', function onSuccess(data) {
        var hits = data["hits"]["hits"];

        hits.forEach(function (hit) {
            var product = hit["_source"];
            products.addProduct(product);
        });
    });

    var days = new DayCollection();
    days.add(new Day({name: "Monday", meals: [], active: true}));
    days.add(new Day({name: "Tuesday", meals: []}));
    days.add(new Day({name: "Wednesday", meals: []}));
    days.add(new Day({name: "Thursday", meals: []}));
    days.add(new Day({name: "Friday", meals: []}));
    var dayCollectionView = new DayCollectionView({collection: days});
    dayCollectionView.setElement($('.days-list'));
    dayCollectionView.render();

});
