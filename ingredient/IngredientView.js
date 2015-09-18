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


$(function () {
    $.get('http://zbiki.ddns.net/products/_search?size=1000', function onSuccess(data) {
        var hits = data["hits"]["hits"];

        hits.forEach(function (hit) {
            var product = hit["_source"];
            products.addProduct(product);
        });
    });
});

var IngredientView = Marionette.ItemView.extend({
    template: 'ingredient/IngredientView.html',
    tagName: 'tr',

    events: {
        "change input.ingredient-weight": "inputChanged",
        'click button.delete-ingredient': 'remove'
    },

    initialize: function () {
        _.bindAll(this, 'render', 'ingredientChanged', 'inputChanged', 'effectiveValue', 'unrender', 'remove');
        this.model.bind('change', this.render);
        this.model.bind('remove', this.unrender);
    },

    serializeData: function () {
        return {
            weight: this.model.get('weight'), proteins: this.effectiveValue('proteins'),
            carbohydrates: this.effectiveValue('carbohydrates'),
            fats: this.effectiveValue('fats'),
            nutritionValue: this.effectiveValue('nutritionValue')
        }
    },

    onRender: function () {
        var title;
        if (this.model.get('ingredientName') != '') {
            title = this.model.get('ingredientName');
        } else {
            title = 'Search for ingredient...';
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
                    var hits = data["hits"]["hits"];

                    var foundIngredients = [];
                    hits.forEach(function (hit) {
                        var ingredientName = hit["_source"]["product_name"];
                        foundIngredients.push(
                            {
                                'value': ingredientName,
                                'text': ingredientName,
                                'disable': false
                            }
                        );
                    });

                    return foundIngredients;
                },
                preserveSelected: false
            });

        $('.selectpicker', this.el).change(this.ingredientChanged);

        return this;
    },

    ingredientChanged: function () {
        var selectedText = $('.selectpicker', this.el).find("option:selected").text();

        var selectedIngredient = products.getProduct(selectedText);
        selectedIngredient["ingredientName"] = selectedIngredient["product_name"];
        selectedIngredient["nutritionValue"] = selectedIngredient["nutritive_value"];

        if (selectedIngredient != null) {
            this.model.set(selectedIngredient);
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

    effectiveValue: function (paramName) {
        return this.model.effectiveValue(paramName).toFixed(2);
    }
});

var ProductListView = Marionette.ItemView.extend({
    template: 'ingredient/ProductListView.html',
    tagName: 'table',
    className: 'table',

    initialize: function () {
        _.bindAll(this, 'render', 'appendProduct', 'appendNewProduct', 'summaryValue', 'updateSum');
        this.model.bind('add', this.appendNewProduct);
        this.model.bind('change', this.updateSum);
        this.model.bind('remove', this.updateSum);
    },

    serializeData: function () {
        return {
            proteinsSum: this.summaryValue("proteins"),
            carbohydratesSum: this.summaryValue("carbohydrates"),
            fatsSum: this.summaryValue("fats"),
            nutritiveValueSum: this.summaryValue("nutritionValue")
        }
    },

    onRender: function () {
        var self = this;
        _(this.model.models).each(function (product) {
            self.appendProduct(product);
        });

        return this;
    },
    appendProduct: function (product) {
        var productView = new IngredientView({
            model: product
        });

        var $productRow = productView.render().$el;
        this.$('tbody').append($productRow);
        return $productRow;
    },
    appendNewProduct: function (product) {
        var $productRow = this.appendProduct(product);
        setTimeout(function () {
            $productRow.find('.product-select button').click();
        }, 100);
    },
    updateSum: function () {
        $("td.proteins_sum", this.el).text(this.summaryValue("proteins"));
        $("td.carbohydrates_sum", this.el).text(this.summaryValue("carbohydrates"));
        $("td.fats_sum", this.el).text(this.summaryValue("fats"));
        $("td.nutritive_value_sum", this.el).text(this.summaryValue("nutritionValue"));
    },

    summaryValue: function (param_name) {
        return this.model.summaryValue(param_name).toFixed(2);
    }
});
