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
        nutritive_value: 0,
        weight: 0
    },

    effective_value: function (name) {
        return this.get(name) * this.get('weight') / 100;
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
    var ProductView = Backbone.View.extend({
        tagName: 'tr',

        events: {
            "change input": "inputChanged"
        },

        initialize: function () {
            _.bindAll(this, 'render', 'inputChanged', 'effective_value');
            this.model.bind('change', this.render, this);
        },

        render: function () {
            $('td', this.el).remove();
            $(this.el).append('<td><input type="text" class="form-control" value="' + this.model.get('weight') + '"></input></td><td>' + this.model.get('product_name') + '</td><td>' + this.effective_value('proteins') + '</td><td>' + this.effective_value('carbohydrates') + '</td><td>' + this.effective_value('fats') + '</td><td>' + this.effective_value('nutritive_value') + '</td>');
            return this;
        },

        inputChanged: function (evt) {
            var value = $(evt.currentTarget).val();
            this.model.set('weight', value);
        },

        effective_value: function (param_name) {
            return this.model.effective_value(param_name).toFixed(2);
        }
    });

    var ProductListView = Backbone.View.extend({
        tagName: 'table',
        className: 'table',

        initialize: function () {
            _.bindAll(this, 'render', 'appendProduct');
            this.model.bind('add', this.appendProduct);
        },

        render: function () {
            $(this.el).append('<thead><th>Product weight</th><th>Product Name</th><th>Proteins</th><th>Carbohydrates</th><th>Fats</th><th>Nutritive value</th></thead>');
            $(this.el).append('<tbody></tbody>');
            return this;
        },

        appendProduct: function (product) {
            var productView = new ProductView({
                model: product
            });
            $('tbody', this.el).append(productView.render().el);
        }
    });

    var MealView = Backbone.View.extend({
        tagName: 'div',
        className: 'panel panel-default',

        events: {
            'click button.delete': 'remove',
            'click button.add_product': 'addProduct'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'unrender', 'remove', 'addProduct');

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
            this.model.bind('addProduct', this.addProduct);
        },

        render: function () {
            $(this.el).append('<div class="panel-heading"><div class="row"><div class="col-md-4">' + this.model.get('name') + '</div><div class="row"><div class="col-md-4"><button type="button" class="btn btn-success add_product">Add Product</button></div><div class="col-md-3"><button type="button" class="btn btn-danger delete">Remove Meal</button></div></div></div>');
            $(this.el).append('<div class="panel-body"></div>');
            var productListView = new ProductListView({
                model: this.model.get('productList')
            });
            $('div.panel-body', this.el).append(productListView.render().el);
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
