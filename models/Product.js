var keystone = require('keystone');
var Types = keystone.Field.Types;

var Product = new keystone.List('Product', {
    map: { name: 'title' },
    singular: 'Product',
    plural: 'Products',
    autokey: { path: 'slug', from: 'title', unique: true }
});

Product.add({
    title: { type: String, required: true },
    price: { type: Number },
    qty: { type: Number },
    content: { type: Types.Html, wysiwyg: true, height: 300 },
    image: { type: Types.CloudinaryImage },
    publishedDate: { type: Date, default: Date.now },
    categories: { type: Types.Relationship, ref: 'ProductCategory', many: true },
});

Product.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Product.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Product.register();