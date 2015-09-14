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

var ProductView = Marionette.ItemView.extend({
    template: 'product/ProductView.html',
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

    serializeData: function() {
        return {
            weight: this.model.get('weight'), proteins: this.effectiveValue('proteins'),
            carbohydrates: this.effectiveValue('carbohydrates'),
            fats: this.effectiveValue('fats'),
            nutritive_value: this.effectiveValue('nutritive_value')
        }
    },

    onRender: function () {
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
                    var hits = data["hits"]["hits"];

                    var foundProducts = [];
                    hits.forEach(function (hit) {
                        var productName = hit["_source"]["product_name"];
                        foundProducts.push(
                            {
                                'value': productName,
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
            this.model.set(selectedProduct);
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

var ProductListView = Marionette.ItemView.extend({
    template: 'product/ProductListView.html',
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
            nutritiveValueSum: this.summaryValue("nutritive_value")
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
        var productView = new ProductView({
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
        $("td.nutritive_value_sum", this.el).text(this.summaryValue("nutritive_value"));
    },

    summaryValue: function (param_name) {
        return this.model.summaryValue(param_name).toFixed(2);
    }
});
