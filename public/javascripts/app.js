var Restaurant = Backbone.Model.extend({
	searchCompare: function(string) {
		string = string.toLowerCase();
		console.log(this.searchCategories(string));
		if(this.searchName(string)) {
			return true;
		}
		else if(this.searchCategories(string)) {
			return true;
		} else {
			return false;
		}
	},

	searchName: function(string) {
		name = this.get('name').toLowerCase();
		if(name.search(string) !== -1) {
			return true;
		} else {
			return false;
		}
	},

	searchCategories: function(string) {
		categories = this.get('categories');
		return _.some(categories, function(category) {
			if(category[0].toLowerCase().search(string) !== -1) {
				console.log(category[0]);
				return true;
			} else {
				return false;
			}
		}, this);
	}
});

var Restaurants = Backbone.Collection.extend({
	url: '/yelp',

	model: Restaurant,

	parse: function(response) {
		console.log(response.businesses)
		return response.businesses;
	}
});

var restaurants = new Restaurants({});

var AppView = Backbone.View.extend({
	el: '#app',

	events: {
		'keyup input': 'search'
	},

	initialize: function() {
		this.childView = new RestaurantsView({collection: restaurants});
	},

	print: function(model) {
		console.log('test');
	},

	search: function(e) {
		console.log(e.target.value);
		this.childView.trigger('search', e.target.value);
	}
});

var RestaurantsView = Backbone.View.extend({
	el: '#restaurants-list',

	initialize: function() {
		this.listenTo(this.collection, 'reset', this.addAll);
		this.listenTo(this, 'search', this.search);
		var self = this;
		$.get("http://ipinfo.io", function(response) {
	    	self.collection.fetch({
	    		data: {
	    			location: response.postal,
	    			limit: 40
	    		},

	    		reset: true
	    	});
		}, "jsonp");
	},

	filterOne: function(item) {
		item.trigger('search');
	},

	search: function(string) {
		this.collection.each(function(item) {
			if(item.searchCompare(string)) {
				item.trigger('show');
			} else {
				item.trigger('hide');
			}
		}, this);
	},

	addOne: function(model) {
		var view = new RestaurantView({model: model});
		this.$el.append(view.render().el);
	},

	addAll: function() {
		this.$el.html('');
		this.collection.each(this.addOne, this);
	}
});

var RestaurantView = Backbone.View.extend({
	tagName: 'div',

	initialize: function() {
		this.listenTo(this.model, 'show', this.show);
		this.listenTo(this.model, 'hide', this.hide)
	},

	template: _.template("<li class='restaurant'><img src='<%= image_url %>'><a href='<%= url %>'><h2><%= name %></h2></a><p><%= location.address[0] %>, <%= location.city %>, <%= location.state_code %> <%= location.postal_code %></p></li>"),

	render: function() {
		this.$el.html( this.template(this.model.attributes) );
		return this
	},

	show: function() {
		this.$el.show();
	},

	hide: function() {
		this.$el.hide();
	}

}); 

new AppView();