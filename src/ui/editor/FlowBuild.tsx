import {useCallback, useEffect, useRef} from 'react';
import {Box, Text} from "@chakra-ui/react";
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  // NodeToolbar,
  Position,
  type Node,
  type Edge,
  type Connection,
  type FinalConnectionState,
  Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '0',
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 0 },
  },
];

const getId = ((id = 1) => () => `${id++}`)();

const nodeOrigin: [number, number] = [0.5, 0];

// 'themeNode': null,
// 'activeNode': null,
// 'passiveNode': null
const nodeTypes = {
  'input': RootNode,
};

function RootNode({ data } : { data: { label: string}}) {
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

const FlowBuild = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, getNodes, setCenter } = useReactFlow();

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

      console.log("FinalConnectionState:", conState);

      const newNode: Node = {
        id,
        data: { label: `Node ${id}` },
        position,
        origin: nodeOrigin,
      };

      console.log("nodes:", nodes);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nodes = getNodes();
      const root = nodes.find((n) => n.id === '0');

      // centering correct main root node
      if (root) {
        const x = root.position.x;
        const y = root.position.y + 250;

        setCenter(x, y, { zoom: 1.5, duration: 800 });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     const currentNodes = getNodes();
  //     if (currentNodes.length > 0) {
  //       fitView({ nodes: [currentNodes[0]], padding: 1.8, duration: 800 });
  //     }
  //   }, 100);
  //
  //   return () => clearTimeout(timeout);
  // }, []);

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
        fitViewOptions={{ padding: 2.5 }}
        nodeOrigin={nodeOrigin}
      >
        <Background />
      </ReactFlow>
    </Box>
  );
};

export default FlowBuild;