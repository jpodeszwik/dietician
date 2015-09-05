var CaloricIntakeFormView = Marionette.ItemView.extend({
    template: 'caloric-intake/CaloricIntakeFormView.html',
    ui: {
        sex: "#form-sex"
    },
    events: {
        'change @ui.sex': 'sexChanged'
    },
    initialize: function () {
        _.bindAll(this, 'render');
        this.render();
    },
    sexChanged: function () {
        alert(this.ui.sex.val())
    }
});