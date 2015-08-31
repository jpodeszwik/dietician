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

    effectiveValue: function (name) {
        return this.get(name) * this.get('weight') / 100;
    }
});

var ProductList = Backbone.Collection.extend({
    model: Product,

    summaryValue: function (name) {
        var mapped = _.map(this.models, function (product) {
            return product.effectiveValue(name)
        });
        return _.reduce(mapped, function (memo, num) {
            return memo + num;
        }, 0.0);
    }
});

var Meal = Backbone.Model.extend({
    defaults: {
        name: 'MealX',
        productList: new ProductList()
    },

    initialize: function () {
        var productList = new ProductList();
        this.set('productList', productList);
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
        var productList = new ProductList();
        this.set('productList', productList);
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

$(function () {
    var ProductView = Backbone.View.extend({
        tagName: 'tr',

        events: {
            "change input": "inputChanged",
            'click button.delete_product': 'remove'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'inputChanged', 'effectiveValue', 'unrender', 'remove');
            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        render: function () {
            $(this.el).html('<td><input type="text" class="form-control" value="' + this.model.get('weight') + '"></input></td><td>' + this.model.get('product_name') + '</td><td>' + this.effectiveValue('proteins') + '</td><td>' + this.effectiveValue('carbohydrates') + '</td><td>' + this.effectiveValue('fats') + '</td><td>' + this.effectiveValue('nutritive_value') + '</td><td><button type="button" class="btn btn-danger delete_product">Remove Product</button></td>');
            return this;
        },

        unrender: function () {
            $(this.el).remove();
        },

        remove: function () {
            this.model.destroy();
        },

        inputChanged: function (evt) {
            var value = $(evt.currentTarget).val();
            this.model.set('weight', value);
        },

        effectiveValue: function (param_name) {
            return this.model.effectiveValue(param_name).toFixed(2);
        }
    });

    var ProductListView = Backbone.View.extend({
        tagName: 'table',
        className: 'table',

        initialize: function () {
            _.bindAll(this, 'render', 'appendProduct', 'summaryValue', 'updateSum');
            this.model.bind('add', this.appendProduct);
            this.model.bind('change', this.updateSum);
            this.model.bind('remove', this.updateSum);
        },

        render: function () {
            $(this.el).html('<thead><th>Product weight</th><th>Product Name</th><th>Proteins</th><th>Carbohydrates</th><th>Fats</th><th>Nutritive value</th></thead>');
            $(this.el).append('<tbody></tbody>');
            $(this.el).append('<tfoot><tr><td colspan="2">Summary</td><td class="proteins_sum"></td><td class="carbohydrates_sum"></td><td class="fats_sum"></td><td class="nutritive_value_sum"></td></tr></tfoot>');

            var self = this;
            _(this.model.models).each(function (product) {
                self.appendProduct(product);
            });

            this.updateSum();

            return this;
        },

        appendProduct: function (product) {
            var productView = new ProductView({
                model: product
            });
            $('tbody', this.el).append(productView.render().el);
        },

        updateSum: function () {
            $("td.proteins_sum", this.el).text(this.summaryValue("proteins"));
            $("td.carbohydrates_sum", this.el).text(this.summaryValue("carbohydrates"));
            $("td.fats_sum", this.el).text(this.summaryValue("fats"));
            $("td.nutritive_value_sum", this.el).text(this.summaryValue("nutritive_value"));
        },

        summaryValue: function (param_name) {
            return this.model.summaryValue(param_name).toFixed(2);
        }
    });

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
            $(this.el).html('<div class="panel-heading"><div class="row"><div class="col-md-4">' + this.model.get('name') + '</div><div class="row"><div class="col-md-4"><button type="button" class="btn btn-success add_product">Add Product</button></div><div class="col-md-3"><button type="button" class="btn btn-danger delete_meal">Remove Meal</button></div></div></div><div class="panel-body"></div>');

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
            _.bindAll(this, 'render', 'addMeal', 'appendMeal', 'updateSummaries', 'summaryValue');
            this.mealList = new MealList();
            this.mealList.bind('add', this.appendMeal);
            this.mealList.bind('change', this.updateSummaries);
            this.mealList.bind('remove', this.updateSummaries);
            this.counter = 0;
            this.render();
        },

        render: function () {
            $(this.el).html('<div class="panel panel-default meals_panel"></div>');
            $('div.meals_panel', this.el).append('<div class="panel-heading"><h2>Meals</h2><button id="add_meal" type="button" class="btn btn-success">Add Meal</button></div>');
            $('div.meals_panel', this.el).append('<div class="panel-body"><div class="panel-group meal_list"></div></div>');
            $('div.meals_panel', this.el).append('<div class="panel-footer meals_summary"><table></div>');
            $('div.meals_summary', this.el).append('<table class="table"><caption>Summary</caption><thead><tr><th>Proteins</th><th>Carbohydrates</th><th>Fats</th><th>Nutritive value</th></tr></thead><tbody><tr><td class="proteins_sum"></td><td class="carbohydrates_sum"></td><td class="fats_sum"></td><td class="nutritive_value_sum"></td></tr></tbody></table>');

            this.updateSummaries();
        },

        addMeal: function () {
            this.counter++;
            var meal = new Meal();
            meal.set({
                name: 'Meal ' + this.counter
            });
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
        },

        summaryValue: function (name) {
            return this.mealList.summaryValue(name).toFixed(2);
        }
    });
    var mealListView = new MealListView();

    $.get('http://zbiki.ddns.net/products/_search?size=1000', function onSuccess(data) {
        var hits = data["hits"]["hits"];

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
    });
});
