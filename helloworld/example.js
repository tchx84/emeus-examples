#!/usr/bin/gjs

const Emeus = imports.gi.Emeus;
const Gtk = imports.gi.Gtk;

Gtk.init(null);

let layout = new Emeus.ConstraintLayout({ expand: true });
let button1 = new Gtk.Button({ label: "Button1" });
let button2 = new Gtk.Button({ label: "Button2" });

layout.add(button1);
layout.add(button2);

let constraints = [
    {
        target_object: button1,
        target_attribute: Emeus.ConstraintAttribute.LEFT,
        source_object: layout,
        source_attribute: Emeus.ConstraintAttribute.LEFT,
        multiplier: 1.0,
        constant: 1.0,
    },
    {
        target_object: button1,
        target_attribute: Emeus.ConstraintAttribute.TOP,
        source_object: layout,
        source_attribute: Emeus.ConstraintAttribute.TOP,
        multiplier: 1.0,
        constant: 1.0,
    },
    {
        target_object: button1,
        target_attribute: Emeus.ConstraintAttribute.BOTTOM,
        source_object: layout,
        source_attribute: Emeus.ConstraintAttribute.BOTTOM,
        multiplier: 1.0,
        constant: 1.0,
    },
    {
        target_object: button2,
        target_attribute: Emeus.ConstraintAttribute.LEFT,
        source_object: button1,
        source_attribute: Emeus.ConstraintAttribute.RIGHT,
        multiplier: 1.0,
        constant: 1.0,
    },
    {
        target_object: button2,
        target_attribute: Emeus.ConstraintAttribute.RIGHT,
        source_object: layout,
        source_attribute: Emeus.ConstraintAttribute.RIGHT,
        multiplier: 1.0,
        constant: 1.0,
    },
    {
        target_object: button2,
        target_attribute: Emeus.ConstraintAttribute.TOP,
        source_object: button1,
        source_attribute: Emeus.ConstraintAttribute.TOP,
        multiplier: 1.0,
        constant: 1.0,
    },
    {
        target_object: button2,
        target_attribute: Emeus.ConstraintAttribute.BOTTOM,
        source_object: button1,
        source_attribute: Emeus.ConstraintAttribute.BOTTOM,
        multiplier: 1.0,
        constant: 1.0,
    },
    {
        target_object: button2,
        target_attribute: Emeus.ConstraintAttribute.WIDTH,
        source_object: button1,
        source_attribute: Emeus.ConstraintAttribute.WIDTH,
        multiplier: 1.0,
        constant: 1.0,
    },
];
constraints.forEach(props => layout.add_constraint(new Emeus.Constraint(props)));

let win = new Gtk.Window({ title: 'Emeus' });
win.connect("delete-event", Gtk.main_quit);

win.add(layout);
win.show_all();

Gtk.main();
