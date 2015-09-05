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

    calculateCaloricIntake: function() {
        var dialog = new BootstrapDialog({
            title: 'Caloric intake calculator',
            type: BootstrapDialog.TYPE_INFO,
            message: nunjucks.render('caloric-intake/CaloricIntakeForm.html'),
            nl2br: false,
            buttons: [{
                label: 'Close',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
        });
        dialog.open();
    }
});