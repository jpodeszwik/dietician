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

function createNewDay(name, active) {
    var mealListModel = new MealList();
    var firstMeal = new Meal({name: 'Meal 1'});
    mealListModel.add(firstMeal);
    return new Day({name: name, meals: mealListModel, active: active})
}

function createEmptyDiet() {
    var dayCollection = new DayCollection();
    dayCollection.add(createNewDay("Monday", true));
    dayCollection.add(createNewDay("Tuesday", false));
    dayCollection.add(createNewDay("Wednesday", false));
    dayCollection.add(createNewDay("Thursday", false));
    dayCollection.add(createNewDay("Friday", false));

    return new Diet({days: dayCollection, caloricIntake: new CaloricIntakeModel()});
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
