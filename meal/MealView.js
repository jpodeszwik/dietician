var MealView = Backbone.View.extend({
    tagName: 'div',
    className: 'panel panel-default',

    events: {
        'click button.delete_meal': 'remove',
        'click button.add_product': 'addProduct'
    },

    initialize: function () {
        _.bindAll(this, 'render', 'unrender', 'remove', 'addProduct');

        this.model.bind('change', this.render);
        this.model.bind('remove', this.unrender);
        this.model.bind('addProduct', this.addProduct);
        this.productListView = new ProductListView({
            model: this.model.get('productList')
        });
    },

    render: function () {
        $(this.el).html(nunjucks.render('meal/MealView.html', {name: this.model.get('name')}));
        $.fn.editable.defaults.mode = 'inline';
        $.fn.editable.defaults.showbuttons = false;
        $.fn.editable.defaults.showbuttons = false;
        $.fn.editable.defaults.onblur = 'submit';
            this.$('.meal-name').editable({
            success: _.bind(function (response, newValue) {
                this.model.set('name', newValue);
            }, this)
        }, this);
        $('div.panel-body', this.el).append(this.productListView.render().el);
        return this;
    },

    unrender: function () {
        $(this.el).remove();
    },

    remove: function () {
        this.model.destroy();
    },

    addProduct: function () {
        this.model.get('productList').add(new Product());
    }

});

var MealListView = Backbone.View.extend({

    events: {
        'click button#add_meal': 'addMeal',
        'click button#save_diet': 'saveDiet'
    },

    initialize: function (mealList) {
        _.bindAll(this, 'render', 'addMeal', 'appendMeal', 'updateSummaries', 'summaryValue', 'saveDiet', 'displayChart');
        this.setElement($('#meals_container'));
        this.mealList = mealList;
        this.mealList.bind('add', this.appendMeal);
        this.mealList.bind('change', this.updateSummaries);
        this.mealList.bind('remove', this.updateSummaries);
        this.render();
    },

    render: function () {
        $(this.el).html(nunjucks.render('meal/MealListView.html'));

        var self = this;
        _(this.mealList.models).each(function (meal) {
            self.appendMeal(meal);
        });

        this.updateSummaries();
    },

    addMeal: function () {
        var meal = new Meal();
        meal.set('name', "Meal " + (this.mealList.length + 1));
        this.mealList.add(meal);
    },

    appendMeal: function (meal) {
        var mealView = new MealView({
            model: meal
        });
        $('div.meal_list', this.el).append(mealView.render().el);
    },

    updateSummaries: function () {
        $("td.proteins_sum", "div.meals_summary", this.el).text(this.summaryValue("proteins"));
        $("td.carbohydrates_sum", "div.meals_summary", this.el).text(this.summaryValue("carbohydrates"));
        $("td.fats_sum", "div.meals_summary", this.el).text(this.summaryValue("fats"));
        $("td.nutritive_value_sum", "div.meals_summary", this.el).text(this.summaryValue("nutritive_value"));

        this.displayChart();
    },

    summaryValue: function (name) {
        return this.mealList.summaryValue(name).toFixed(2);
    },

    saveDiet: function () {
        var document = {'mealList': this.mealList.toJSON()};
        $.post('http://zbiki.ddns.net/diets/diet', JSON.stringify(document), function onSuccess(data) {
            var dietUrl = window.location.href.split('?')[0] + '?id=' + data['_id'];
            var dialog = new BootstrapDialog({
                title: 'Dialog',
                type: BootstrapDialog.TYPE_SUCCESS,
                message: 'Your diet was successfully saved. Here is the <a href="' + dietUrl + '">link</a>  to your diet.',
                buttons: [{
                    label: 'Close',
                    action: function (dialogRef) {
                        dialogRef.close();
                    }
                }]
            });
            dialog.open();
        });
    },

    displayChart: function () {
        var proteinsCalories = this.summaryValue('proteins') * 4;
        var carbohydratesCalories = this.summaryValue('carbohydrates') * 4;
        var fatsCalories = this.summaryValue('fats') * 9;

        var chartData = {
            labels: ["Proteins", "Carbohydrates", "Fats"],
            datasets: [
                {
                    label: "Calories from sources",
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: [proteinsCalories, carbohydratesCalories, fatsCalories]
                }
            ]
        };

        var ctx = $("#myChart").get(0).getContext("2d");
        var myBarChart = new Chart(ctx).Bar(chartData);
    }
});