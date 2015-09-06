var CaloricIntakeFormView = Marionette.ItemView.extend({
    template: 'caloric-intake/CaloricIntakeFormView.html',
    ui: {
        control: ".form-control",
        select: "select",
        form: "form"
    },

    events: {
        'change @ui.control': 'formChanged'
    },

    initialize: function () {
        this.render();
    },

    onRender: function () {
        var self = this;
        this.ui.select.each(function (idx, select) {
            var name = $(select).attr('name');
            var value = self.model.get(name);
            $(select).find('option[value="' + value + '"]').attr('selected', 'true');
        })
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