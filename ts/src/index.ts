/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  CommandRegistry
} from '@phosphor/commands';

import {
  // BoxPanel, DockPanel,  SplitPanel, StackedPanel, CommandPalette, ContextMenu, MenuBar, Widget, DockLayout, Menu
  TabPanel, BoxPanel, DockPanel,  SplitPanel, CommandPalette, ContextMenu, MenuBar, Widget, Menu
} from '@phosphor/widgets';

import '../ts/style/index.css';
import "@jpmorganchase/perspective-viewer";
import "@jpmorganchase/perspective-viewer-hypergrid";
import "@jpmorganchase/perspective-viewer-highcharts";


class Header extends Widget {
    static createNode(): HTMLElement {
        let node = document.createElement('div');
        node.classList.add('header');
        let h = document.createElement('img');
        h.src = "data:image/png;base64,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";
        node.appendChild(h);
        return node;
    }

    constructor(){
        super({ node: Header.createNode() });
        this.setFlag(Widget.Flag.DisallowLayout);
        this.title.closable = false;
        this.node.id = 'header';
    }
}

const commands = new CommandRegistry();

function addCommands(palette:CommandPalette){
  palette.addItem({
    command: 'save-dock-layout',
    category: 'Dock Layout',
    rank: 0
  });
}


function main(): void {
  
  /* Home "Menu" */
  let menu = new Menu({ commands });
  menu.title.label = 'Layout';
  menu.title.mnemonic = 0;

  menu.addItem({ command: 'save-dock-layout'});
  menu.addItem({ type: 'separator'});
  menu.addItem({ command: 'restore-dock-layout', args: {index: 0}});


  /* about menu */
  let menu2 = new Menu({ commands });
  menu2.title.label = 'About';
  menu2.title.mnemonic = 0;
  menu2.addItem({ command: 'controls:open' });
  menu2.addItem({ type: 'separator'});

  /* Title bar */
  let header = new Header();

  /* File bar */
  let bar = new MenuBar();
  bar.addMenu(menu);
  bar.addMenu(menu2);
  bar.id = 'menuBar';

  /* context menu */
  let contextMenu = new ContextMenu({ commands });

  document.addEventListener('contextmenu', (event: MouseEvent) => {
    if (contextMenu.open(event)) {
      event.preventDefault();
    }
  });

  contextMenu.addItem({ command: 'controls:open', selector: '.content' });
  contextMenu.addItem({ type: 'separator', selector: '.p-CommandPalette-input' });
  contextMenu.addItem({ command: 'save-dock-layout', selector: '.content' });
  contextMenu.addItem({ command: 'restore-dock-layout', selector: '.content' });

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    commands.processKeydownEvent(event);
  });


  let dock = new DockPanel();
  dock.id = 'dock';
  dock.title.label = 'Dock';

  /* Reference Data Tab */
  let refdata_panel = new SplitPanel();
  refdata_panel.title.label = 'Test';

  /* Markets Info */
  dock.addWidget(refdata_panel);
  // dock.addWidget(refdata_panel, {mode: 'tab-after', ref: market_data_panel});

  /* save/restore layouts */
  let savedLayouts: DockPanel.ILayoutConfig[] = [];

  /* command palette */
  let palette = new CommandPalette({ commands });
  palette.id = 'palette';
  addCommands(palette);

  // /* command registry */
  commands.addCommand('save-dock-layout', {
    label: 'Save Layout',
    caption: 'Save the current dock layout',
    execute: () => {
      savedLayouts.push(dock.saveLayout());
      palette.addItem({
        command: 'restore-dock-layout',
        category: 'Dock Layout',
        args: { index: savedLayouts.length - 1 }
      });
      menu2.addItem({ command: 'restore-dock-layout', args: {index: savedLayouts.length - 1}});
    }
  });

  commands.addCommand('restore-dock-layout', {
    label: args => {
      return `Restore Layout ${args.index as number}`;
    },
    execute: args => {
      dock.restoreLayout(savedLayouts[args.index as number]);
    }
  });

  // commands.addCommand('controls:open', {
  //   label: 'Controls',
  //   mnemonic: 1,
  //   iconClass: 'fa fa-plus',
  //   execute: () => {
  //     dock.restoreLayout(savedLayouts[0]);
  //   }
  // });

  /* hack for custom sizing */
  // var layout = dock.saveLayout();
  // var sizes: number[] = (layout.main as DockLayout.ISplitAreaConfig).sizes;
  // sizes[0] = 0.6;
  // sizes[1] = 0.4;
  // dock.restoreLayout(layout);
  savedLayouts.push(dock.saveLayout());
  // palette.addItem({
  //   command: 'restore-dock-layout',
  //   category: 'Dock Layout',
  //   args: { index: 0}
  // });

  /* main area setup */
  BoxPanel.setStretch(dock, 1);

  let home = new SplitPanel();
  home.title.label = "Home";

  let overview = new BoxPanel({ direction: 'top-to-bottom', spacing: 0 });
  overview.title.label = "Overview"
  home.addWidget(overview);

  let tmp = new SplitPanel();
  tmp.title.label = 'Test2';
  home.addWidget(tmp);

  home.setRelativeSizes([.3, .7]);

  let main = new TabPanel();
  main.id = 'main';
  main.addWidget(home);
  main.addWidget(dock);

  window.onresize = () => { main.update(); };

  Widget.attach(header, document.body);
  Widget.attach(bar, document.body);
  Widget.attach(main, document.body);
}


window.onload = main;
