var MealView = Marionette.ItemView.extend({
    template: 'meal/MealView.html',
    tagName: 'div',
    className: 'panel panel-default',

    events: {
        'click button.delete_meal': 'remove',
        'click button.add-ingredient': 'addIngredient'
    },

    initialize: function () {
        _.bindAll(this, 'render', 'unrender', 'remove', 'addIngredient');

        this.model.bind('remove', this.unrender);
        this.model.bind('addIngredient', this.addIngredient);
        this.ingredientListView = new IngredientListView({
            model: this.model.get('ingredientList')
        });
    },

    onRender: function () {
        this.$('.meal-name').editable({
            success: _.bind(function (response, newValue) {
                this.model.set('name', newValue);
            }, this)
        }, this);
        $('div.panel-body', this.el).append(this.ingredientListView.render().el);
        return this;
    },

    unrender: function () {
        $(this.el).remove();
    },

    remove: function () {
        this.model.destroy();
    },

    addIngredient: function () {
        this.model.get('ingredientList').add(new Ingredient());
    }

});

var MealListView = Marionette.ItemView.extend({
    template: 'meal/MealListView.html',

    events: {
        'click button#add_meal': 'addMeal'
    },

    serializeData: function () {
        return {
            proteinsSum: this.summaryValue("proteins"),
            carbohydratesSum: this.summaryValue("carbohydrates"),
            fatsSum: this.summaryValue("fats"),
            nutritionValueSum: this.summaryValue("nutritionValue")
        }
    },

    initialize: function (mealList) {
        _.bindAll(this, 'render', 'addMeal', 'appendMeal', 'updateSummaries', 'summaryValue');
        this.model = mealList;
        this.model.bind('add', this.appendMeal);
        this.model.bind('change', this.updateSummaries);
        this.model.bind('remove', this.updateSummaries);
    },

    onRender: function () {
        var self = this;
        _(this.model.models).each(function (meal) {
            self.appendMeal(meal);
        });
    },

    addMeal: function () {
        var meal = new Meal();
        meal.set('name', "Meal " + (this.model.length + 1));
        this.model.add(meal);
    },

    appendMeal: function (meal) {
        var mealView = new MealView({
            model: meal
        });
        $('div.meal_list', this.el).append(mealView.render().el);
    },

    updateSummaries: function () {
        $("td.proteins-sum", "div.meals-summary", this.el).text(this.summaryValue("proteins"));
        $("td.carbohydrates-sum", "div.meals-summary", this.el).text(this.summaryValue("carbohydrates"));
        $("td.fats-sum", "div.meals-summary", this.el).text(this.summaryValue("fats"));
        $("td.nutrition-value-sum", "div.meals-summary", this.el).text(this.summaryValue("nutritionValue"));
    },

    summaryValue: function (name) {
        return this.model.summaryValue(name).toFixed(2);
    }
});