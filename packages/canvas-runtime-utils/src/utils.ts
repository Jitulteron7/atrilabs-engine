import { Breakpoint, ComponentCoordsWM } from "@atrilabs/canvas-runtime";
import { BrowserForestManager } from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { Tree, TreeNode } from "@atrilabs/forest";

// ================== body ===============================
export function lrtbSort(coords: ComponentCoordsWM[]) {
  coords.sort((a, b) => {
    const topDiff = a.topWM - b.topWM;
    if (topDiff === 0) {
      return a.leftWM - b.leftWM;
    }
    return topDiff;
  });
  return coords;
}

export function getEffectiveBreakpointWidths(
  canvasBreakpoint: Breakpoint,
  breakpoints: { [maxWidth: string]: { property: { styles: any } } }
) {
  const effectiveBreapointWidths = Object.keys(breakpoints).filter(
    (currMax) => {
      return parseInt(currMax) >= canvasBreakpoint.max;
    }
  );
  return effectiveBreapointWidths.sort((a, b) => {
    return parseInt(b) - parseInt(a);
  });
}

export function getEffectiveStyle(
  canvasBreakpoint: Breakpoint,
  breakpoints: { [maxWidth: string]: { property: { styles: any } } },
  styles: any
) {
  const effectiveBreakpointWidths = getEffectiveBreakpointWidths(
    canvasBreakpoint,
    breakpoints
  );
  let effectiveStyle = { ...styles };
  effectiveBreakpointWidths.forEach((curr) => {
    effectiveStyle = {
      ...effectiveStyle,
      ...breakpoints[curr].property.styles,
    };
  });
  return effectiveStyle;
}

export type ParentChildMap = { [parentId: string]: string[] };

/**
 * Filter out parent ids from lookup map that has been deleted
 * @param currentParentId
 * @param lookupMap
 * @param reverseMap
 */
function _createReverseMap(
  currentParentId: string,
  lookupMap: ParentChildMap,
  reverseMap: ParentChildMap
) {
  const childIds = reverseMap[currentParentId]!;
  childIds.forEach((childId) => {
    if (lookupMap[childId] !== undefined) {
      reverseMap[childId] = lookupMap[childId]!;
      _createReverseMap(childId, lookupMap, reverseMap);
    }
  });
}

export function createReverseMap(
  nodes: { [nodeId: string]: TreeNode },
  rootNodeId: string
) {
  const nodeIds = Object.keys(nodes);
  // lookupMap helps to quickly find all the children of a parent
  // lookupMap can contain components that are children of a deleted component
  const lookupMap: ParentChildMap = { [rootNodeId]: [] };
  // reverseMap does not contain components that are children of a deleted component
  const reverseMap: ParentChildMap = { [rootNodeId]: [] };
  nodeIds.forEach((nodeId) => {
    const node = nodes[nodeId]!;
    const parentId = node.state.parent.id;
    // update lookup map
    if (lookupMap[parentId] === undefined) {
      lookupMap[parentId] = [nodeId];
    } else {
      lookupMap[parentId]!.push(nodeId);
    }
    // update reverse map with children of root only
    if (parentId === rootNodeId) {
      reverseMap[rootNodeId]!.push(node.id);
    }
  });
  _createReverseMap(rootNodeId, lookupMap, reverseMap);
  return reverseMap;
}

export function getAllNodeIdsFromReverseMap(
  reverseMap: ParentChildMap,
  rootId: string
) {
  const parentNodeIds = Object.keys(reverseMap);
  const childNodeIds = parentNodeIds
    .map((parentNodeId) => {
      return reverseMap[parentNodeId]!;
    })
    .flat();
  const nodeIds = new Set([...parentNodeIds, ...childNodeIds]);
  nodeIds.delete(rootId);
  return Array.from(nodeIds);
}

/**
 *
 * @param nodes map of tree id and tree node
 * @param rootNodeId id of node to start breadth first walk from.
 * @returns parent-children map where children are sorted
 */
export function createSortedParentChildMap(
  nodes: { [nodeId: string]: TreeNode },
  rootNodeId: string
) {
  const parentChildMap = createReverseMap(nodes, rootNodeId);
  const parentNodeIds = Object.keys(parentChildMap);
  for (let i = 0; i < parentNodeIds.length; i++) {
    const currentParentNodeId = parentNodeIds[i];
    const currentNodesChildIds = parentChildMap[currentParentNodeId];
    currentNodesChildIds.sort((a, b) => {
      return nodes[a].state.parent.index - nodes[b].state.parent.index;
    });
  }
  return parentChildMap;
}

export function getComponentNode(id: string) {
  const compTree = BrowserForestManager.currentForest.tree(ComponentTreeId);
  return compTree!.nodes[id];
}

export function getAncestors(id: string, ancestors: string[] = []) {
  // returns array of ancestors, 0th index is the component itself, 1st index is parent if exists, 2th is the grandparent and so on
  const compNode = getComponentNode(id);
  const compParent = compNode.state.parent.id;
  ancestors.push(compNode.id);
  if (compParent !== "body") {
    getAncestors(compParent, ancestors);
  }
  return ancestors;
}

export function getStylesAlias(id: string, componentTree: Tree, cssTree: Tree) {
  // returns the alias and styles of an element
  const cssNode = cssTree.links[id];
  const cssNodeId = cssNode.childId;
  return {
    alias: componentTree.nodes[id].state?.alias,
    cssStyles: cssTree.nodes[cssNodeId].state?.property.styles,
  };
}

export function createObject(
  referenceObject: any,
  keys: (string | number)[],
  value: string | number | boolean | string[] | number[] | boolean[] | object
) {
  if (referenceObject === null) {
    throw "Reference object cannot be null";
  }
  if (keys.length === 0) {
    return value;
  }
  if (keys.length === 1) {
    referenceObject[keys[0]] = value;
  } else {
    const [key, ...remainingKeys] = keys;
    const nextKey = remainingKeys[0];
    const nextRemainingKeys = remainingKeys.slice(1);

    if (
      referenceObject[key] !== undefined &&
      typeof nextKey === "string" &&
      Array.isArray(referenceObject[key])
    ) {
      throw "Datatype of selector and reference object does not match";
    }

    if (
      referenceObject[key] !== undefined &&
      typeof nextKey === "number" &&
      typeof referenceObject[key] === "object"
    ) {
      throw "Datatype of selector and reference object does not match";
    }

    if (typeof nextKey === "number") {
      if (referenceObject[key] === undefined || referenceObject[key] === null) {
        // create array
        referenceObject[key] = [];
      }

      // Fill empty index with empty object
      if (nextKey <= referenceObject[key].length) {
        const delta = nextKey + 1 - referenceObject[key].length;
        for (let i = 0; i < delta; i++) {
          referenceObject[key].push({});
        }
      } else {
        throw "Cannot add index that is greater than the array size";
      }

      // recursively write the object
      referenceObject[key][nextKey] = createObject(
        referenceObject[key][nextKey],
        nextRemainingKeys,
        value
      );
    } else {
      // recursively write the object
      referenceObject[key] = createObject(
        typeof referenceObject[key] === "undefined" ? {} : referenceObject[key],
        remainingKeys,
        value
      );
    }
  }

  return referenceObject;
}
