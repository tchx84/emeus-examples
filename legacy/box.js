#!/usr/bin/gjs

const Gtk = imports.gi.Gtk;

Gtk.init(null);

let layout = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 0 });
let button1 = new Gtk.Button({ label: "Button1" });
let button2 = new Gtk.Button({ label: "Button2" });

layout.pack_start(button1, true, true, 0);
layout.pack_start(button2, true, true, 0);

let win = new Gtk.Window({ title: 'Box' });
win.connect("delete-event", Gtk.main_quit);

win.add(layout);
win.show_all();

Gtk.main();
