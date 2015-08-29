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

var Meal = Backbone.Model.extend({
    defaults: {
        name: 'MealX'
    }
});

var MealList = Backbone.Collection.extend({
    model: Meal
});

$(function () {
    var MealView = Backbone.View.extend({
        tagName: 'div',
        className: 'panel panel-default',

        events: {
            'click button.delete': 'remove',
            'click button.add_product': 'add_product'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'unrender', 'remove');

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
            this.model.bind('add_product', this.add_product)
        },

        render: function () {
            $(this.el).append('<div class="panel-heading"><div class="row"><div class="col-md-4">' + this.model.get('name') + '</div><div class="row"><div class="col-md-4"><button type="button" class="btn btn-success add_product">Add Product</button></div><div class="col-md-3"><button type="button" class="btn btn-danger delete">Remove Meal</button></div></div></div>');
            $(this.el).append('<div class="panel-body"></div>');
            return this;
        },

        unrender: function () {
            $(this.el).remove();
        },

        remove: function () {
            this.model.destroy();
        },

        add_product: function () {
            var selectedText = $('.selectpicker').find("option:selected").text();
            var selectedProduct = products.getProduct(selectedText);
            alert(JSON.stringify(selectedProduct));
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
            $(this.el).append('<div class="panel-group meal_list"><h2>Meals</h2><button id="add_meal" type="button" class="btn btn-success">Add Meal</button></div>');
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
            $('div.meal_list', this.el).append(mealView.render().el);
        }
    });
    var mealListView = new MealListView();

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
