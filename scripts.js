function Products() {
    this.products = {};
}

Products.prototype = {
    constructor: Products,

    addProduct: function (productToAdd) {
        var productName = productToAdd["product_name"];
        this.products[productName] = productToAdd;
    },

    getProduct: function (productName) {
        return this.products[productName];
    },

    getProductNames: function () {
        return Object.keys(this.products);
    }
};

var products = new Products();


function productSelectionChanged() {
    var selectedText = $('.selectpicker').find("option:selected").text();
    var selectedProduct = products.getProduct(selectedText);
    $('#product_name_value').text(selectedProduct['product_name']);
    $('#proteins_value').text(selectedProduct['proteins']);
    $('#carbohydrates_value').text(selectedProduct['carbohydrates']);
    $('#fats_value').text(selectedProduct['fats']);
    $('#nutritive_value_value').text(selectedProduct['nutritive_value']);
}

$(function () {

    var Meal = Backbone.Model.extend({
        defaults: {
            name: 'MealX'
        }
    });

    var MealList = Backbone.Collection.extend({
        model: Meal
    });

    var MealView = Backbone.View.extend({
        tagName: 'div',

        events: {
            'click button.delete': 'remove'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'unrender', 'remove');

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        render: function () {
            $(this.el).html('<div class="panel panel-default"><div class="panel-heading"><div class="row"><div class="col-md-8">' + this.model.get('name') + '</div><div class="col-md-4"><button type="button" class="btn btn-danger delete">Remove Meal</button></div></div></div></div>');
            return this;
        },

        unrender: function () {
            $(this.el).remove();
        },

        remove: function () {
            this.model.destroy();
        }

    });

    var MealListView = Backbone.View.extend({

        el: $('#meals_container'),

        events: {
            'click button#add_meal': 'addMeal'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'addMeal', 'appendMeal');
            this.collection = new MealList();
            this.collection.bind('add', this.appendMeal);

            this.counter = 0;
            this.render();
        },

        render: function () {
            $(this.el).append('<div id="meal_list" class="panel-group"><h2>Meals</h2><button id="add_meal" type="button" class="btn btn-default">Add Meal</button></div>');
        },

        addMeal: function () {
            this.counter++;
            var meal = new Meal();
            meal.set({
                name: 'Meal ' + this.counter
            });
            this.collection.add(meal);
        },

        appendMeal: function (meal) {
            var mealView = new MealView({
                model: meal
            });
            $('#meal_list').append(mealView.render().el);
        }
    });
    var mealListView = new MealListView();

});

$(document).ready(function () {

    var xmlhttp = new XMLHttpRequest();
    var url = "http://192.168.0.14:9201/products/_search?size=1000";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            var hits = myArr["hits"]["hits"];

            hits.forEach(function (hit) {
                var product = hit["_source"];
                products.addProduct(product);
            });

            products.getProductNames().forEach(function (productName) {
                var product_selector = document.getElementById("product_selector");
                var option = document.createElement("option");
                option.text = productName;
                product_selector.add(option);
            });

            $('.selectpicker').change(productSelectionChanged);

            $('.selectpicker').selectpicker('refresh');
            productSelectionChanged();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();


});
