import * as React from "react";

import { showErrorMessage, VDomRenderer } from "@jupyterlab/apputils";

import { ILauncher } from "@jupyterlab/launcher";

import { classes, LabIcon } from "@jupyterlab/ui-components";

import { each, IIterator } from "@lumino/algorithm";

import { CommandRegistry } from "@lumino/commands";

import { Widget } from "@lumino/widgets";

import { webdsIcon } from "./icons";

const LAUNCHER_CLASS = "jp-webdsDocLauncher";

export class WebDSDocLauncher extends VDomRenderer {
  constructor(
    commands: CommandRegistry,
    items: IIterator<ILauncher.IItemOptions>,
    callback: (widget: Widget) => void
  ) {
    super();
    this._items = items;
    this._commands = commands;
    this._callback = callback;
    this.addClass(LAUNCHER_CLASS);
  }

  protected render(): React.ReactElement<any> | null {
    const docItems: any[] = [];
    each(this._items, (item) => {
      if (item.category == "DSDK - Documentation") {
        docItems.push(item);
      }
    });

    if (docItems.length == 0) return null;

    docItems.sort((a: any, b: any) => {
      return Private.sortCmp(a, b, this._commands);
    });

    const onClickFactory = (item: any): ((event: any) => void) => {
      const onClick = (event: Event): void => {
        event.stopPropagation();
        this._commands
          .execute(item.command, { ...item.args })
          .then((value) => {
            if (value instanceof Widget) {
              this._callback(value);
            }
          })
          .catch((error) => {
            showErrorMessage("webds_doc_launcher error", error);
          });
      };
      return onClick;
    };

    const cards: React.ReactElement<any>[] = [];

    docItems.forEach((item) => {
      const command = item.command;
      const args = { ...item.args };
      const label = this._commands.label(command, args);
      const caption = this._commands.caption(command, args);
      const iconClass = this._commands.iconClass(command, args);
      const _icon = this._commands.icon(command, args);
      const icon = _icon === iconClass ? undefined : _icon;
      const mainOnClick = onClickFactory(item);
      const card = (
        <div
          className="jp-webdsDocLauncher-item"
          title={caption}
          onClick={mainOnClick}
        >
          <div className="jp-webdsDocLauncherCard-icon">
            <LabIcon.resolveReact
              icon={icon}
              iconClass={classes(iconClass, "jp-Icon-cover")}
              stylesheet="launcherCard"
            />
          </div>
          <div className="jp-webdsDocLauncher-label" title={label}>
            {label}
          </div>
        </div>
      );
      cards.push(card);
    });

    const content: React.ReactElement<any> = (
      <div className="jp-webdsDocLauncher-section" key={"webds_doc_launcher"}>
        <div className="jp-webdsDocLauncher-sectionHeader">
          <webdsIcon.react stylesheet="launcherSection" />
          <h2 className="jp-webdsDocLauncher-sectionTitle">
            {"DSDK - Documentation"}
          </h2>
        </div>
        <div className="jp-webdsDocLauncher-cardContainer">{cards}</div>
      </div>
    );

    return (
      <div className="jp-webdsDocLauncher-body">
        <div className="jp-webdsDocLauncher-content">
          <div className="jp-webdsDocLauncher-content-main">{content}</div>
        </div>
      </div>
    );
  }

  private _items: IIterator<ILauncher.IItemOptions>;
  private _commands: CommandRegistry;
  private _callback: (widget: Widget) => void;
}

namespace Private {
  export function sortCmp(
    a: ILauncher.IItemOptions,
    b: ILauncher.IItemOptions,
    commands: CommandRegistry
  ): number {
    const r1 = a.rank;
    const r2 = b.rank;
    if (r1 !== r2 && r1 !== undefined && r2 !== undefined) {
      return r1 < r2 ? -1 : 1;
    }
    const aLabel = commands.label(a.command, { ...a.args });
    const bLabel = commands.label(b.command, { ...b.args });
    return aLabel.localeCompare(bLabel);
  }
}
