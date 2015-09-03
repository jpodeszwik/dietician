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
    }
};

var products = new Products();

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
        productList: null
    },

    initialize: function ()  {
        if(this.get('productList') == null) {
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
            "change input.product_weight": "inputChanged",
            'click button.delete_product': 'remove'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'productChanged', 'inputChanged', 'effectiveValue', 'unrender', 'remove');
            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        render: function () {
            $(this.el).html('<td><select class="selectpicker"></select></td><td><input type="text" class="form-control product_weight" value="' + this.model.get('weight') + '"></input></td><td>' + this.effectiveValue('proteins') + '</td><td>' + this.effectiveValue('carbohydrates') + '</td><td>' + this.effectiveValue('fats') + '</td><td>' + this.effectiveValue('nutritive_value') + '</td><td><button type="button" class="btn btn-danger delete_product">Remove Product</button></td>');

            var title;
            if (this.model.get('product_name') != '') {
                title = this.model.get('product_name');
            } else {
                title = 'Search for product...';
            }

            $('.selectpicker', this.el)
                .selectpicker({
                    liveSearch: true
                })
                .ajaxSelectPicker({
                    ajax: {
                        url: 'http://zbiki.ddns.net/products/_search',
                        dataType: 'json',
                        data: function () {
                            return {
                                "query": {
                                    "match": {
                                        "product_name": "{{{q}}}"
                                    }
                                }
                            };
                        }
                    },
                    locale: {
                        emptyTitle: title
                    },
                    preprocessData: function (data) {

                        var ctr = 0;
                        var hits = data["hits"]["hits"];

                        var foundProducts = [];
                        hits.forEach(function (hit) {
                            ctr++;
                            var productName = hit["_source"]["product_name"];
                            foundProducts.push(
                                {
                                    'value': ctr,
                                    'text': productName,
                                    'disable': false
                                }
                            );
                        });

                        return foundProducts;
                    },
                    preserveSelected: false
                });

            $('.selectpicker', this.el).change(this.productChanged);

            return this;
        },

        productChanged: function () {
            var selectedText = $('.selectpicker', this.el).find("option:selected").text();
            var selectedProduct = products.getProduct(selectedText);
            if (selectedProduct != null) {
                this.model.set('product_name', selectedProduct['product_name']);
                this.model.set('proteins', selectedProduct['proteins']);
                this.model.set('carbohydrates', selectedProduct['carbohydrates']);
                this.model.set('fats', selectedProduct['fats']);
                this.model.set('nutritive_value', selectedProduct['nutritive_value']);
                if (this.model.get('weight') == 0) {
                    this.model.set('weight', 100);
                }
            }
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
            $(this.el).html('<thead><th>Product Name</th><th>Product weight</th><th>Proteins</th><th>Carbohydrates</th><th>Fats</th><th>Nutritive value</th></thead>');
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
            $(this.el).html('<div class="panel-heading"><div class="row"><div class="col-md-4"><h4>' + this.model.get('name') + '</h4></div><<div class="col-md-6"><button type="button" class="btn btn-success add_product">Add Product</button></div><div class="col-md-1"><button type="button" class="btn btn-danger delete_meal">Remove Meal</button></div></div></div>');
            $(this.el).append('<div class="panel-body"></div>');

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

        el: $('#meals_container'),

        events: {
            'click button#add_meal': 'addMeal',
            'click button#save_diet': 'saveDiet'
        },

        initialize: function (mealList) {
            _.bindAll(this, 'render', 'addMeal', 'appendMeal', 'updateSummaries', 'summaryValue', 'saveDiet');
            this.mealList = mealList;
            this.mealList.bind('add', this.appendMeal);
            this.mealList.bind('change', this.updateSummaries);
            this.mealList.bind('remove', this.updateSummaries);
            this.counter = 0;
            this.addMeal();
            this.render();
        },

        render: function () {
            $(this.el).html('<div class="panel panel-default meals_panel"></div>');
            $('div.meals_panel', this.el).append('<div class="panel-heading"><div class="col-md-4"><h4>Meals</h4></div><div class="row"><<div class="col-md-6"><button id="add_meal" type="button" class="btn btn-success">Add Meal</button></div><div class="col-md-1"><button id="save_diet" type="button" class="btn btn-info">Save diet</button></div></div></div>');
            $('div.meals_panel', this.el).append('<div class="panel-body"><div class="panel-group meal_list"></div></div>');
            $('div.meals_panel', this.el).append('<div class="panel-footer meals_summary"><table></div>');
            $('div.meals_summary', this.el).append('<table class="table"><caption>Summary</caption><thead><tr><th>Proteins</th><th>Carbohydrates</th><th>Fats</th><th>Nutritive value</th></tr></thead><tbody><tr><td class="proteins_sum"></td><td class="carbohydrates_sum"></td><td class="fats_sum"></td><td class="nutritive_value_sum"></td></tr></tbody></table>');

            var self = this;
            _(this.mealList.models).each(function (meal) {
                self.appendMeal(meal);
            });

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
        },

        saveDiet: function () {
            var document = {'mealList': this.mealList.toJSON()};
            $.post('http://zbiki.ddns.net/diets/diet', JSON.stringify(document), function onSuccess(data) {
                var dietUrl = url('hostname') + ':' + url('port') + url('path') + '?id=' + data['_id'];
                //TODO: improve this
                alert(dietUrl);
            });
        }
    });

    var dietId = url('?id');
    if (dietId != null) {
        $.get('http://zbiki.ddns.net/diets/diet/' + dietId + '/_source', function onSuccess(data) {
            var mealList = data['mealList'];
            var mealListModel = new MealList();

            //somehow MealList model didn't want to load the whole json
            mealList.forEach(function (meal) {
                var mealModel = new Meal({
                    name: meal['name'],
                    productList: new ProductList(meal['productList'])
                });
                mealListModel.add(mealModel);
            });

            var mealListView = new MealListView(mealListModel);
        });
    } else {
        var mealListView = new MealListView(new MealList());
    }

    $.get('http://zbiki.ddns.net/products/_search?size=1000', function onSuccess(data) {
        var hits = data["hits"]["hits"];

        hits.forEach(function (hit) {
            var product = hit["_source"];
            products.addProduct(product);
        });
    });
});
