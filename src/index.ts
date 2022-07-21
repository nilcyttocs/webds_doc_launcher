import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { WidgetTracker } from "@jupyterlab/apputils";

import { ILauncher } from "@jupyterlab/launcher";

import { Widget } from "@lumino/widgets";

import { WebDSWidget } from "@webds/service";

import { WebDSDocLauncher } from "./launcher";

import { documentationIcon } from "./icons";

namespace Attributes {
  export const command = "webds_doc_launcher:open";
  export const id = "webds_doc_launcher_widget";
  export const label = "Documentation";
  export const caption = "Documentation";
  export const category = "DSDK - Application";
  export const rank = 20;
}

/**
 * Initialization data for the @webds/doc_launcher extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: "@webds/doc_launcher:plugin",
  autoStart: true,
  requires: [ILauncher, ILayoutRestorer],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    restorer: ILayoutRestorer
  ) => {
    console.log("JupyterLab extension @webds/doc_launcher is activated!");

    let widget: WebDSWidget;
    const { commands, shell } = app;
    const command = Attributes.command;
    commands.addCommand(command, {
      label: Attributes.label,
      caption: Attributes.caption,
      icon: (args: { [x: string]: any }) =>
        args["isLauncher"] ? documentationIcon : undefined,
      execute: () => {
        if (!widget || widget.isDisposed) {
          const callback = (item: Widget): void => {
            shell.add(item, "main");
          };
          const docLauncher = new WebDSDocLauncher(
            commands,
            launcher.items(),
            callback
          );
          widget = new WebDSWidget({ content: docLauncher });
          widget.id = Attributes.id;
          widget.title.label = Attributes.label;
          widget.title.icon = documentationIcon;
          widget.title.closable = true;
        }

        if (!tracker.has(widget)) tracker.add(widget);

        if (!widget.isAttached) shell.add(widget, "main");

        shell.activateById(widget.id);
      }
    });

    launcher.add({
      command,
      args: { isLauncher: true },
      category: Attributes.category,
      rank: Attributes.rank
    });

    let tracker = new WidgetTracker<WebDSWidget>({
      namespace: Attributes.id
    });
    restorer.restore(tracker, { command, name: () => Attributes.id });
  }
};

export default plugin;
