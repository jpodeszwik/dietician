var Meal = Backbone.Model.extend({
    defaults: {
        name: 'MealX',
        productList: null
    },

    initialize: function () {
        if (this.get('productList') == null) {
            this.set('productList', new ProductList());
        }

        var productList = this.get('productList');

        this.listenTo(productList, 'change', function () {
            this.trigger('change', this);
        });

        this.listenTo(productList, 'remove', function () {
            this.trigger('change', this);
        });
    },

    summaryValue: function (name) {
        return this.get('productList').summaryValue(name);
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
