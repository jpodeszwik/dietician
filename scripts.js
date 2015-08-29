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

    alert(JSON.stringify(products.getProduct(selectedText)));
}

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