import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type {
  AcceptsChildFunction,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema/lib/types";
import { flexColSort } from "@atrilabs/react-component-manifest-schema/lib/utils";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";



export const VerticalMenu = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    children: React.ReactNode[];
    custom: {
      open: boolean;
      iconHeight: number;
      iconWidth: number;
      src?: string;
      strokeColor?: string;
      gap?: number;
      alignRight?: boolean;
    };
    onClick: (open: boolean) => void;
  }
>((props, ref) => {
  const onClick = useCallback(() => {
    props.onClick(!props.custom.open);
  }, [props]);
  const gap = typeof props.custom.gap === "number" ? props.custom.gap : 0;
  return (
    <div ref={ref} style={{ ...props.styles, position: "relative" }}>      
    </div>
  );
});


const acceptsChild: AcceptsChildFunction = (info: any) => {
  if (info.childCoordinates.length === 0) {
    return 0;
  }
  return flexColSort(info.loc, info.childCoordinates) || 0;
};

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: true,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    open: "boolean",
    src: "static_asset",
    iconHeight: "number",
    iconWidth: "number",
    strokeColor: "color",
    gap: "number",
    alignRight: "boolean",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "VerticalMenu", category: "Basics" },
  render: {
    comp: VerticalMenu,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { display: "inline-block" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          open: true,
          iconHeight: 24,
          iconWidth: 24,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "VerticalMenu"} },
  drag: {
    comp: CommonIcon,
    props: { name: "VerticalMenu", containerStyle: { padding: "1rem" }},
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
