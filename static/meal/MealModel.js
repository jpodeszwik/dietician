var Meal = Backbone.Model.extend({
    defaults: {
        name: 'MealX',
        ingredientList: null
    },

    initialize: function () {
        if (this.get('ingredientList') == null) {
            this.set('ingredientList', new IngredientList());
        }

        var ingredientList = this.get('ingredientList');

        this.listenTo(ingredientList, 'change', function () {
            this.trigger('change', this);
        });

        this.listenTo(ingredientList, 'remove', function () {
            this.trigger('change', this);
        });
    },

    summaryValue: function (name) {
        return this.get('ingredientList').summaryValue(name);
    }
});

var MealList = Backbone.Collection.extend({
    model: Meal,

    initialize: function () {
        //somehow without this line other binds to change didn't work
        this.bind('change', function () {
        })
    },

    summaryValue: function (name) {
        var mapped = _.map(this.models, function (meal) {
            return meal.summaryValue(name);
        });

        return _.reduce(mapped, function (memo, num) {
            return memo + num;
        }, 0.0);
    }
});
