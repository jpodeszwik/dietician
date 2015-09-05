var DayView = Marionette.ItemView.extend({
    tagName: 'li',
    attributes: {role: 'presentation'},
    events: {
        'click': 'tabChanged'
    },
    className: function () {
        if (this.model.get('active')) {
            return 'active';
        }
    },
    template: function (day) {
        return nunjucks.renderString('<a href="#" >{{name}}</a>', {name: day.name})
    },
    tabChanged: function () {
        this.model.collection.switchTo(this.model);
    }
});

var DayCollectionView = Marionette.CollectionView.extend({
    childView: DayView,
    initialize: function () {
        this.collection.on('change', this.render, this);
    }
});