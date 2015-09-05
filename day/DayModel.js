var Day = Backbone.Model.extend({
    defaults: {
        name: undefined,
        meals: undefined,
        active: false
    }
});

var DayCollection = Backbone.Collection.extend({
    model: Day
});
