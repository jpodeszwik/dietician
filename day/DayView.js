var DayView = Marionette.ItemView.extend({
    tagName: 'li',
    attributes: {role: 'presentation'},
    className: function() {
        if (this.model.get('active')) {
            return 'active';
        }
    },
    template: function (day) {
        return nunjucks.renderString('<a href="#" >{{name}}</a>', {name: day.name})
    }
});

var DayCollectionView = Marionette.CollectionView.extend({
    childView: DayView
});