#!/usr/bin/gjs

const Emeus = imports.gi.Emeus;
const Gtk = imports.gi.Gtk;

Gtk.init(null);

let layout = new Emeus.ConstraintLayout({ expand: true });
let button1 = new Gtk.Button({ label: "Button1" });
let button2 = new Gtk.Button({ label: "Button2" });

layout.add(button1);
layout.add(button2);

let constraints = Emeus.create_constraints_from_description([
        'H:|[button1(==button2)][button2]|',
        'V:|[button1]|',
        'V:|[button2]|',
    ], 8, 8, {
        button1: button1,
        button2: button2,
    }, { });
constraints.forEach(constraint => layout.add_constraint(constraint));

let win = new Gtk.Window({ title: 'Emeu VFL' });
win.connect("delete-event", Gtk.main_quit);

win.add(layout);
win.show_all();

Gtk.main();
