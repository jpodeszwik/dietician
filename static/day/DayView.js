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
        return nunjucks.renderString('<a href="javascript:void(0)" >{{name}}</a>', {name: day.name})
    },
    tabChanged: function () {
        this.model.collection.switchTo(this.model);
    }
});

var DayCollectionView = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'nav nav-tabs',
    childView: DayView,

    ui: {
        "addDayButton": "button.add-day"
    },

    events: {
        'click @ui.addDayButton': 'addDay'
    },
    initialize: function () {
        this.collection.on('change', this.render, this);
    },

    addDay: function () {
        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var newDay = createNewDay(days[this.collection.size() % 7], false);
        this.collection.add(newDay);
        this.collection.switchTo(newDay);
    },

    onRender: function () {
        this.$el.find('li.add-day').remove();
        this.$el.prepend('<li class="add-day"><button type="button" class="btn btn-link add-day"><span class="glyphicon glyphicon-plus"></span>Add Day</button></li>');
    }
});

var DaysPanelView = Marionette.LayoutView.extend({
    el: $('.outerView'),
    template: function () {
    },
    regions: {
        days: ".days-list",
        meals: "#meals-container"
    },
    initialize: function () {
        this.model.on('change', this.displayActiveMeal, this);
    },

    displayActiveMeal: function () {
        if (this.model.getActive() !== undefined) {
            this.showChildView('meals', new MealListView(this.model.getActive().get('meals')));
        }
    },

    onRender: function () {
        this.showChildView('days', new DayCollectionView({collection: this.model}));
        this.displayActiveMeal();
    }
});