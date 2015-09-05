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
        $(this.el).html('<thead><th>Product Name</th><th>Product weight</th><th>Proteins</th><th>Carbohydrates</th><th>Fats</th><th>Nutritive value</th><th></th></thead>');
        $(this.el).append('<tbody></tbody>');
        $(this.el).append('<tfoot><tr><td colspan="7"><button type="button" class="btn btn-success add_product">Add Product</button></td></tr>');
        $(this.el).append('<tr><td colspan="2">Summary</td><td class="proteins_sum"></td><td class="carbohydrates_sum"></td><td class="fats_sum"></td><td class="nutritive_value_sum"></td></tr></tfoot>');

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
