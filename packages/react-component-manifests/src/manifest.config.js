module.exports = {
  dir: "manifests",
  manifestSchema: [
    { pkg: "@atrilabs/react-component-manifest-schema" },
    { pkg: "@atrilabs/component-icon-manifest-schema" },
  ],
  componentMap: {
    Button: {
      modulePath: "./src/manifests/Button/Button.tsx",
      exportedVarName: "Button",
    },
    Flex: {
      modulePath: "./src/manifests/Flex/Flex.tsx",
      exportedVarName: "Flex",
    },
    Input: {
      modulePath: "./src/manifests/Input/Input.tsx",
      exportedVarName: "Input",
    },
    Image: {
      modulePath: "./src/manifests/Image/Image.tsx",
      exportedVarName: "Image",
    },
    Upload: {
      modulePath: "./src/manifests/Upload/Upload.tsx",
      exportedVarName: "Upload",
    },
  },
};
