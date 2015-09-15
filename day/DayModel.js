var Day = Backbone.Model.extend({
    defaults: {
        name: undefined,
        meals: undefined,
        active: false
    }
});

var DayCollection = Backbone.Collection.extend({
    model: Day,
    switchTo: function (dayModel) {
        this.models.forEach(function (model) {
            model.set('active', false);
        });
        dayModel.set('active', true);
    },

    getActive: function () {
        return _.find(this.models, function (day) {
            return day.get('active');
        });
    }
});
