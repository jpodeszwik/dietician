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

var Product = Backbone.Model.extend({
    defaults: {
        product_name: '',
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
        nutritive_value: 0
    }
});

var ProductList = Backbone.Collection.extend({model: Product});

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
            'click button.add_product': 'addProduct'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'unrender', 'remove', 'addProduct', 'appendProduct');

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
            this.model.bind('addProduct', this.addProduct);
            this.model.get('productList').bind('add', this.appendProduct);

        },

        render: function () {
            $(this.el).append('<div class="panel-heading"><div class="row"><div class="col-md-4">' + this.model.get('name') + '</div><div class="row"><div class="col-md-4"><button type="button" class="btn btn-success add_product">Add Product</button></div><div class="col-md-3"><button type="button" class="btn btn-danger delete">Remove Meal</button></div></div></div>');
            $(this.el).append('<div class="panel-body"><table class="table"><th>Product Name</th><th>Proteins</th><th>Carbohydrates</th><th>Fats</th><th>Nutritive value</th></table></div>');
            return this;
        },

        unrender: function () {
            $(this.el).remove();
        },

        remove: function () {
            this.model.destroy();
        },

        addProduct: function () {
            var selectedText = $('.selectpicker').find("option:selected").text();
            var selectedProduct = products.getProduct(selectedText);
            var product = new Product();
            product.set({
                product_name: selectedProduct["product_name"],
                proteins: selectedProduct["proteins"],
                carbohydrates: selectedProduct["carbohydrates"],
                fats: selectedProduct["fats"],
                nutritive_value: selectedProduct["nutritive_value"]
            });
            this.model.get('productList').add(product);
        },

        appendProduct: function(product) {
            $('table', this.el).append('<tr><td>' + product.get('product_name') + '</td><td>' + product.get('proteins') + '</td><td>' + product.get('carbohydrates') + '</td><td>' + product.get('fats') + '</td><td>' + product.get('nutritive_value') + '</td></tr>');
        }

    });

    var MealListView = Backbone.View.extend({

        el: $('#meals_container'),

        events: {
            'click button#add_meal': 'addMeal'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'addMeal', 'appendMeal');
            this.mealList = new MealList();
            this.mealList.bind('add', this.appendMeal);

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
                name: 'Meal ' + this.counter,
                productList: new ProductList()
            });
            this.mealList.add(meal);
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
