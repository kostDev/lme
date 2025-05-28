import {ReactFlowProvider} from "@xyflow/react";
import FlowBuild from "@ui/editor/FlowBuild";


const FlowEditor = () => (
  <ReactFlowProvider>
    <FlowBuild />
  </ReactFlowProvider>
);

export default FlowEditor;