var MealPrintView = Marionette.ItemView.extend({
    template: 'meal/MealPrintView.html',
    tagName: 'div',
    className: 'panel panel-default',

    onRender: function() {
        var ingredientListPrintView = new IngredientListPrintView({
            model: this.model.get('ingredientList')
        });
        this.$('div.panel-body').append(ingredientListPrintView.render().$el)
    },

    serializeData: function() {
        return {
            name: this.model.get('name')
        }
    }
});

var MealListPrintView = Marionette.ItemView.extend({
    template: 'meal/MealListPrintView.html',

    serializeData: function () {
        return {
            proteinsSum: this.summaryValue("proteins"),
            carbohydratesSum: this.summaryValue("carbohydrates"),
            fatsSum: this.summaryValue("fats"),
            nutritionValueSum: this.summaryValue("nutritionValue")
        }
    },

    initialize: function (mealList) {
        _.bindAll(this, 'appendMeal');
        this.model = mealList;
    },

    onRender: function () {
        var self = this;
        _(this.model.models).each(function (meal) {
            self.appendMeal(meal);
        });
    },

    appendMeal: function (meal) {
        var mealPrintView = new MealPrintView({
            model: meal
        });
        $('div.meal-list', this.el).append(mealPrintView.render().$el);
    },

    summaryValue: function (name) {
        return this.model.summaryValue(name).toFixed(2);
    }
});