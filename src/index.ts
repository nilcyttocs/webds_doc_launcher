import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { Widget } from '@lumino/widgets';

import { WebDSDocLauncher } from './launcher';

import { 
  documentationIcon,
  webdsIcon
} from './icons';

/**
 * Initialization data for the @webds/doc_launcher extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@webds/doc_launcher:plugin',
  autoStart: true,
  requires: [ILauncher, ILayoutRestorer],
  activate: (app: JupyterFrontEnd, launcher: ILauncher, restorer: ILayoutRestorer) => {
    console.log('JupyterLab extension @webds/doc_launcher is activated!');

    let widget: MainAreaWidget;
    const { commands, shell } = app;
    const command: string = 'webds_doc_launcher:open';
    commands.addCommand(command, {
      label: 'Documentation',
      caption: 'Documentation',
      icon: (args: { [x: string]: any }) => (args['isLauncher'] ? documentationIcon : undefined),
      execute: () => {
        if (!widget || widget.isDisposed) {
          const callback = (item: Widget): void => {
            shell.add(item, 'main');
          };
          const docLauncher = new WebDSDocLauncher(commands, launcher.items(), callback);
          widget = new MainAreaWidget({ content: docLauncher });
          widget.id = 'webds_doc_launcher_widget';
          widget.title.label = 'WebDS - Documentation';
          widget.title.icon = webdsIcon;
          widget.title.closable = true;
        }

        if (!tracker.has(widget))
          tracker.add(widget);

        if (!widget.isAttached)
          shell.add(widget, 'main');

        shell.activateById(widget.id);
      },
    });

    launcher.add({ command, args: { isLauncher: true }, category: 'WebDS', rank: 1 });

    let tracker = new WidgetTracker<MainAreaWidget>({ namespace: 'webds_doc_launcher' });
    restorer.restore(tracker, { command, name: () => 'webds_doc_launcher' });
  }
};

export default plugin;
