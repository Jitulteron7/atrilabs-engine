import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import {Link as RouterLink} from "react-router-dom";
import "./BreadCrumb.css"


export type BreadCrumbProps = {
  styles: React.CSSProperties;
  custom: {
    divider: string;
    items: {
      // this will be visible
      name: string;
      // link
      link: string;
    }[];
  };
  onClick: (item: { name: string; link: string }) => {};
};
  
export const BreadCrumb: React.FC<BreadCrumbProps> =forwardRef<HTMLDivElement,{
    styes:React.CSSProperties;
    custom:{
      divider: string;
      items: {          
          name: string;          
          link: string;
        }[];
      };      
    onClick: (item: { name: string; link: string }) => {};
}>(
  (props,ref) => {
    console.log(props,"props")    
    return (
    <div ref={ref} aria-label="Breadcrumb" className="breadcrumb">       
        <ul>
          {props.custom.items.map((item,index)=>{
            return (<li><a href="#">{item?.name?item?.name:"test"}</a></li>)
          })} 
        </ul>      
    </div>);
  }
);

// {props.items.map((item,index)=>{
//   return(<RouterLink  to={item.link}>{item.name}</RouterLink>)
//  })}         

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
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
    divider: "text",
    items:"array"    
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "BreadCrumb", category: "Basics" },
  render: {
    comp: BreadCrumb,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          color: "#000"          
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          divider: ">",
          items:[]
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
      onPressEnter: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {
      
    },
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "BreadCrumb" } },
  drag: {
    comp: CommonIcon,
    props: { name: "BreadCrumb", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};






