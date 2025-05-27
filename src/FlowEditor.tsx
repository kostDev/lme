import { useCallback, useRef } from 'react';
import {Box, Text} from "@chakra-ui/react";
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  // NodeToolbar,
  Position,
  type Node,
  type Edge,
  type Connection,
  type FinalConnectionState, Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '0',
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 50 },
  },
];

const getId = (() => {
  let id = 1;
  return () => `${id++}`
})();
const nodeOrigin: [number, number] = [0.5, 0];
const nodeTypes = {
  'input': NodeWithToolbar,
};

function NodeWithToolbar({ data } : { data: { label: string}}) {
  // data.forceToolbarVisible || undefined
  return (
    <Box>
      {/*<Handle*/}
      {/*  type="target"*/}
      {/*  position={Position.Top}*/}
      {/*  isConnectable={true}*/}
      {/*/>*/}
      {/*<Stack direction='row' justify="center" spacing={4} p={2}>*/}
      {/*  <Button>cut</Button>*/}
      {/*  <Button>copy</Button>*/}
      {/*  <Button>paste</Button>*/}
      {/*</Stack>*/}

      <Text>{data.label}</Text>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={true}
      />
    </Box>
  );
}

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, conState: FinalConnectionState) => {
      if (!conState.to || !conState.fromNode) return;
      const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
      const sourceId = conState.fromNode.id;
      const id = getId();
      const position = screenToFlowPosition({ x: clientX, y: clientY });

      console.log(conState)

      const newNode: Node = {
        id,
        data: { label: `Node ${id}` },
        position,
        origin: nodeOrigin,
      };

      console.log(nodes);

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) =>
        eds.concat({
          id: `e${sourceId}->${id}`,
          source: sourceId,
          target: id,
        }),
      );
    },
    [nodes, screenToFlowPosition, setEdges, setNodes],
  );

  return (
    <Box ref={reactFlowWrapper}  h="100vh">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={nodeOrigin}
      >
        <Background />
      </ReactFlow>
    </Box>
  );
};

const FlowEditor = () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);

export default FlowEditor;