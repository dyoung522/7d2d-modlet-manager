const template = commands => [
  {
    label: "File",
    submenu: [
      {
        label: "Choose Game Folder",
        accelerator: "CmdOrCtrl+Shift+G",
        click: commands.chooseGameFolder
      },
      {
        label: "Choose Modlet Folder",
        accelerator: "CmdOrCtrl+Shift+M",
        click: commands.chooseModletFolder
      },
      {
        label: "Toggle Mode",
        accelerator: "CmdOrCtrl+Shift+T",
        click: commands.toggleMode
      },
      { type: "separator" },
      { role: "quit" }
    ]
  },
  { role: "editMenu" },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  { role: "windowMenu" },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://github.com/dyoung522/7d2d-modlet-manager/wiki");
        }
      }
    ]
  }
];

export default template;
