var IngredientPrintView = Marionette.ItemView.extend({
    template: 'ingredient/IngredientPrintView.html',
    tagName: 'tr',

    initialize: function () {
        _.bindAll(this, 'effectiveValue');
    },

    serializeData: function () {
        return {
            ingredientName: this.model.get('ingredientName'),
            weight: this.model.get('weight'),
            proteins: this.effectiveValue('proteins'),
            carbohydrates: this.effectiveValue('carbohydrates'),
            fats: this.effectiveValue('fats'),
            nutritionValue: this.effectiveValue('nutritionValue')
        }
    },

    effectiveValue: function (paramName) {
        return this.model.effectiveValue(paramName).toFixed(2);
    }
});

var IngredientListPrintView = Marionette.ItemView.extend({
    template: 'ingredient/IngredientListPrintView.html',
    tagName: 'table',
    className: 'table',

    initialize: function () {
        _.bindAll(this, 'appendIngredient');
    },

    serializeData: function () {
        return {
            proteinsSum: this.summaryValue("proteins"),
            carbohydratesSum: this.summaryValue("carbohydrates"),
            fatsSum: this.summaryValue("fats"),
            nutritionValueSum: this.summaryValue("nutritionValue")
        }
    },

    onRender: function () {
        var self = this;
        _(this.model.models).each(function (ingredient) {
            self.appendIngredient(ingredient);
        });
    },

    appendIngredient: function (ingredient) {
        var ingredientPrintView = new IngredientPrintView({
            model: ingredient
        });
        this.$('tbody').append(ingredientPrintView.render().$el);
    },

    summaryValue: function (paramName) {
        return this.model.summaryValue(paramName).toFixed(2);
    }
});