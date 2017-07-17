#!/usr/bin/gjs

const Gtk = imports.gi.Gtk;

Gtk.init(null);

let layout = new Gtk.Fixed();
let button1 = new Gtk.Button({ label: "Button1" });
let button2 = new Gtk.Button({ label: "Button2" });

button1.set_size_request(85, -1);
layout.put(button1, 0, 0);
button2.set_size_request(85, -1);
layout.put(button2, 85, 0);

let win = new Gtk.Window({ title: 'Fixed' });
win.connect("delete-event", Gtk.main_quit);

win.add(layout);
win.show_all();

Gtk.main();
