var CaloricIntakeView = Backbone.View.extend({
    events: {
        'click button.caloric-intake': 'calculateCaloricIntake'
    },

    initialize: function () {
        _.bindAll(this, 'render', 'calculateCaloricIntake');
        this.setElement($('#caloric-intake-calculator'));
        this.render();
    },

    render: function () {
        $(this.el).html(nunjucks.render('caloric-intake/CaloricIntakeView.html'));
    },

    calculateCaloricIntake: function () {
        var caloricIntakeFormView = new CaloricIntakeFormView({model: new CaloricIntakeModel()});

        BootstrapDialog.show({
            title: 'Caloric intake calculator',
            type: BootstrapDialog.TYPE_INFO,
            message: caloricIntakeFormView.$el,
            nl2br: false,
            buttons: [
                {
                    label: 'Save',
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        dialog.close();
                    }
                },
                {
                    label: 'Close',
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
        });
    }
});