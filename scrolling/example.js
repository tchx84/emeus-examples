#!/usr/bin/gjs

const Lang = imports.lang;
const Emeus = imports.gi.Emeus;
const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const GdkPixbuf = imports.gi.GdkPixbuf;
const Gdk = imports.gi.Gdk;

Gtk.init(null);

const MIN_WIDTH = 40;

const Card = new Lang.Class({
    Name: 'Card',
    Extends: Gtk.Widget,

    Properties: {
        'image-uri': GObject.ParamSpec.string('image-uri', 'image-uri', 'image-uri',
            GObject.ParamFlags.READWRITE, ''),
    },

    _init: function (props) {
        this.parent(props);
        this._pixbuf = GdkPixbuf.Pixbuf.new_from_file(this.image_uri);
        this.set_has_window(false);
    },

    vfunc_get_request_mode: function () {
        return Gtk.SizeRequestMode.HEIGHT_FOR_WIDTH;
    },

    vfunc_get_preferred_width: function () {
        return [MIN_WIDTH, MIN_WIDTH];
    },

    vfunc_get_preferred_height_for_width: function (width) {
        let scale = width / this._pixbuf.get_width();
        let height = this._pixbuf.get_height() * scale;
        return [height, height];
    },

    vfunc_draw: function (cr) {
        let alloc = this.get_allocation();
        let scale = alloc.width / this._pixbuf.get_width();
        cr.scale(scale, scale);
        Gdk.cairo_set_source_pixbuf(cr, this._pixbuf, 0, 0);
        cr.paint();
    },
});

const Arrangement = new Lang.Class({
    Name: 'Arrangement',
    Extends: Emeus.ConstraintLayout,

    Properties: {
        'columns': GObject.ParamSpec.int('columns', 'columns', 'columns',
            GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT_ONLY,
            0, GLib.MAXINT32, 1),
    },

    _init: function (props) {
        this.parent(props);
        this._cards = [];
    },

    add_card: function (card) {
        let top_card = this;
        let top_prop = Emeus.ConstraintAttribute.TOP;
        if (this._cards.length >= this.columns) {
            top_card = this._cards[this._cards.length - this.columns];
            top_prop = Emeus.ConstraintAttribute.BOTTOM;
        }

        let left_card = this;
        let left_prop = Emeus.ConstraintAttribute.LEFT;
        if (this._cards.length % this.columns !== 0) {
             left_card = this._cards[this._cards.length - 1];
             left_prop = Emeus.ConstraintAttribute.RIGHT;
        }

        this.add(card);
        this._cards.push(card);

        let constraints = [
            {
                target_object: card,
                target_attribute: Emeus.ConstraintAttribute.TOP,
                source_object: top_card,
                source_attribute: top_prop,
                multiplier: 1.0,
                constant: 1.0,
            },
            {
                target_object: card,
                target_attribute: Emeus.ConstraintAttribute.LEFT,
                source_object: left_card,
                source_attribute: left_prop,
                multiplier: 1.0,
                constant: 1.0,
            },
            {
                target_object: card,
                target_attribute: Emeus.ConstraintAttribute.WIDTH,
                source_object: this,
                source_attribute: Emeus.ConstraintAttribute.WIDTH,
                multiplier: 1.0 / this.columns,
                constant: 1.0,
            },
        ];
        constraints.forEach(props => this.add_constraint(new Emeus.Constraint(props)));
    },


    vfunc_get_request_mode: function () {
        return Gtk.SizeRequestMode.HEIGHT_FOR_WIDTH;
    },

    vfunc_get_preferred_width: function () {
        let card_width = MIN_WIDTH;
        let cards = this.get_children();
        if (cards.length > 0)
            card_width = cards[0].get_preferred_width()[0];
        return [this.columns * card_width, this.columns * card_width];
    },

    vfunc_get_preferred_height_for_width: function (width) {
        let height = 0;
        let heights = [];
        this._cards.forEach((card, index) => {
              let column = index % this.columns;
              if (!heights[column])
                  heights[column] = 0;

              let card_width = width / this.columns;
              let card_height = card.get_preferred_height_for_width(card_width)[0];
              heights[column] += card_height;

              if (heights[column] > height)
                  height = heights[column];
        });
        return [height, height];
    },
});

let arrangement = new Arrangement({ expand: true, columns: 8 });
let arrangement_box = new Gtk.Box();
arrangement_box.get_style_context().add_class('ArrangementBox');
arrangement_box.add(arrangement);

let scroll = new Gtk.ScrolledWindow();
scroll.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
scroll.add_with_viewport(arrangement_box);

let box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
let button = new Gtk.Button({ label: 'Add Card' });

let provider = new Gtk.CssProvider();
provider.load_from_path('./example.css');
Gtk.StyleContext.add_provider_for_screen(Gdk.Screen.get_default(),
            provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);

let images = [
    './images/01.JPG',
    './images/02.JPG',
    './images/03.JPG',
    './images/04.JPG',
];

let callback = function () {
    let card_box = new Gtk.Box();
    card_box.get_style_context().add_class('CardBox');
    let card = new Card({ image_uri: images[Math.round(Math.random() * (images.length - 1))], expand: true });
    card_box.add(card)
    card_box.show_all();
    arrangement.add_card(card_box);
}

button.connect('clicked', callback);
box.add(button);
box.add(scroll);

let win = new Gtk.Window({ title: 'Emeus Scrolling' });
win.set_default_size(720, 480);
win.connect("delete-event", Gtk.main_quit);

win.add(box);
win.show_all();

Gtk.main();
