'use strict';
var app = require('app');
var BrowserWindow = require('browser-window');
var dialog = require('dialog');
var ipc = require('ipc');
var fs = require('fs');
var Menu = require("menu");

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
var mainWindow;
var plistTemplate;


function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	var win = new BrowserWindow({
		width: 600,
		height: 600
	});

	win.loadUrl(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', function() {
	app.quit();
});

app.on('activate-with-no-open-windows', function() {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', function() {
	mainWindow = createMainWindow();
	var template = [{
        label: "iOS plist Generator",
        submenu: [
            { label: "About iOS plist Generator", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "Command+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+Command+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "Command+X", selector: "cut:" },
            { label: "Copy", accelerator: "Command+C", selector: "copy:" },
            { label: "Paste", accelerator: "Command+V", selector: "paste:" },
            { label: "Select All", accelerator: "Command+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});

ipc.on('generate-plist', function (event, arg) {
    dialog.showSaveDialog({ filters: [{ name: 'app-name', extensions: ['plist'] }]}, function (fileName) {
    if (fileName === undefined) return;
		fs.writeFile(fileName, arg, function (err) {
			console.log(err);
    });
	});
});
