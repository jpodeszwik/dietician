var CaloricIntakeFormView = Marionette.ItemView.extend({
    template: 'caloric-intake/CaloricIntakeFormView.html',
    ui: {
        control: ".form-control",
        form: "form"
    },

    events: {
        'change @ui.control': 'formChanged'
    },

    initialize: function () {
        this.render();
    },

    formChanged: function () {
        var formArr = this.ui.form.serializeArray();
        var formData = _.reduce(formArr, function (ret, val) {
            ret[val.name] = val.value;
            return ret;
        }, {});
        this.model.set(formData);
    }
});