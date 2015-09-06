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

var App = {};

var setupApp = function () {
    var dietId = url('?id');

    App.days = new DayCollection();
    var daysCollection = App.days;
    var mealListModel = new MealList();

    App.daysPanelView = undefined;

    if (dietId != null) {
        Search.Load(dietId, daysCollection, function () {
            App.daysPanelView = prepareView(daysCollection)
        });
    } else {
        var firstMeal = new Meal();
        firstMeal.set('name', "Meal 1");
        mealListModel.add(firstMeal);

        daysCollection.add(new Day({name: "Monday", meals: mealListModel, active: true}));
        daysCollection.add(new Day({name: "Tuesday", meals: new MealList()}));
        daysCollection.add(new Day({name: "Wednesday", meals: new MealList()}));
        daysCollection.add(new Day({name: "Thursday", meals: new MealList()}));
        daysCollection.add(new Day({name: "Friday", meals: new MealList()}));
        App.daysPanelView = prepareView(daysCollection)
    }

    var caloricIntakeView = new CaloricIntakeView();

    function prepareView(daysCollection) {
        var mealListView = new MealListView(daysCollection.models[0].get('meals'));
        var dayCollectionView = new DayCollectionView({collection: daysCollection});
        var daysPanelView = new DaysPanelView({model: daysCollection});
        daysPanelView.render();
        daysPanelView.showChildView('days', dayCollectionView);
        daysPanelView.showChildView('meals', mealListView);
        return daysPanelView;
    }

};
