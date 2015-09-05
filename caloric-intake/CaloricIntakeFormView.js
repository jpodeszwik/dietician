var CaloricIntakeFormView = Backbone.View.extend({

    initialize: function () {
        _.bindAll(this, 'render');
        this.render();
    },

    render: function () {
        $(this.el).html(nunjucks.render('caloric-intake/CaloricIntakeFormView.html'));
    }
});