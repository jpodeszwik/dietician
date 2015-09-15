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
        var caloricIntakeClone = App.diet.get('caloricIntake').clone();
        var caloricIntakeFormView = new CaloricIntakeFormView({model: caloricIntakeClone});

        BootstrapDialog.show({
            title: 'Caloric intake calculator',
            type: BootstrapDialog.TYPE_INFO,
            message: caloricIntakeFormView.$el,
            nl2br: false,
            buttons: [
                {
                    label: 'Apply',
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        App.diet.get('caloricIntake').set(caloricIntakeClone.attributes);
                        dialog.close();
                    }
                },
                {
                    label: 'Cancel',
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
        });
    }
});