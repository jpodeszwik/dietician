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

function createEmptyDiet() {
    var diet = new Diet();
    var dayCollection = new DayCollection();
    diet.set('days', dayCollection);

    var mealListModel = new MealList();
    var firstMeal = new Meal();
    firstMeal.set('name', "Meal 1");
    mealListModel.add(firstMeal);

    dayCollection.add(new Day({name: "Monday", meals: mealListModel, active: true}));
    dayCollection.add(new Day({name: "Tuesday", meals: new MealList()}));
    dayCollection.add(new Day({name: "Wednesday", meals: new MealList()}));
    dayCollection.add(new Day({name: "Thursday", meals: new MealList()}));
    dayCollection.add(new Day({name: "Friday", meals: new MealList()}));

    diet.set('caloricIntake', new CaloricIntakeModel());

    return diet;
}

var setupApp = function () {
    var dietId = url('?id');

    App.daysPanelView = undefined;

    if (dietId != null) {
        Search.Load(dietId, function (diet) {
            App.diet = diet;
            App.daysPanelView = prepareView(diet.get('days'))
        });
    } else {
        App.diet = createEmptyDiet();
        App.daysPanelView = prepareView(App.diet.get('days'))
    }

    var caloricIntakeView = new CaloricIntakeView();

    function prepareView(daysCollection) {
        var daysPanelView = new DaysPanelView({model: daysCollection});
        daysPanelView.render();

        return daysPanelView;
    }

    function saveDiet() {
        Search.Save(App.diet, function onSuccess(data) {
            var dietUrl = window.location.href.split('?')[0] + '?id=' + data['_id'];
            window.location = dietUrl;
        });
    }

    $('#save_diet').click(saveDiet);

};
