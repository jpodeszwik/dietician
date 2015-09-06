$(function () {
    configureLibs();
    setupApp();
});

function configureLibs() {
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
}

var setupApp = function () {
    var dietId = url('?id');

    var days = new DayCollection();
    var mealListModel = new MealList();

    if (dietId != null) {
        Search.Load(dietId, mealListModel);
    } else {
        var firstMeal = new Meal();
        firstMeal.set('name', "Meal 1");
        mealListModel.add(firstMeal);

        days.add(new Day({name: "Monday", meals: mealListModel, active: true}));
        days.add(new Day({name: "Tuesday", meals: new MealList()}));
        days.add(new Day({name: "Wednesday", meals: new MealList()}));
        days.add(new Day({name: "Thursday", meals: new MealList()}));
        days.add(new Day({name: "Friday", meals: new MealList()}));
    }

    var caloricIntakeView = new CaloricIntakeView();
    var mealListView = new MealListView(mealListModel);
    var dayCollectionView = new DayCollectionView({collection: days});
    dayCollectionView.setElement($('.days-list'));
    dayCollectionView.render();
};