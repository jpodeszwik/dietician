var Ingredient = Backbone.Model.extend({
    defaults: {
        ingredientName: '',
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
        nutritionValue: 0,
        weight: 0
    },

    effectiveValue: function (name) {
        return this.get(name) * this.get('weight') / 100;
    }
});

var ProductList = Backbone.Collection.extend({
    model: Ingredient,

    summaryValue: function (name) {
        var mapped = _.map(this.models, function (product) {
            return product.effectiveValue(name)
        });
        return _.reduce(mapped, function (memo, num) {
            return memo + num;
        }, 0.0);
    }
});