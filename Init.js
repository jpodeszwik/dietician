$(function () {
    nunjucks.configure("", {web: {useCache: true}});

    $.fn.editable.defaults.mode = 'inline';
    $.fn.editable.defaults.showbuttons = false;
    $.fn.editable.defaults.showbuttons = false;
    $.fn.editable.defaults.onblur = 'submit';

    Backbone.Marionette.Renderer.render = function (template, data) {
        if (_.isFunction(template)) {
            return template(data);
        }
        return nunjucks.render(template, data);
    };

    var dietId = url('?id');

    var mealListModel = new MealList();
    var mealListView = new MealListView(mealListModel);

    if (dietId != null) {
        Search.Load(dietId, mealListModel);
    } else {
        var firstMeal = new Meal();
        firstMeal.set('name', "Meal 1");
        mealListModel.add(firstMeal);
    }

    var caloricIntakeView = new CaloricIntakeView();


    var days = new DayCollection();
    days.add(new Day({name: "Monday", meals: mealListModel  , active: true}));
    days.add(new Day({name: "Tuesday", meals: new MealList()}));
    days.add(new Day({name: "Wednesday", meals: new MealList()}));
    days.add(new Day({name: "Thursday", meals: new MealList()}));
    days.add(new Day({name: "Friday", meals: new MealList()}));
    var dayCollectionView = new DayCollectionView({collection: days});
    dayCollectionView.setElement($('.days-list'));
    dayCollectionView.render();

});
