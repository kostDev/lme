import {useCallback, useEffect, useRef, useState} from 'react';
import {Box, Input, IconButton, HStack, Select, Stack, Text, Divider, Textarea, Button} from '@chakra-ui/react';
import { SettingsIcon, EditIcon } from '@chakra-ui/icons';
import {
  Background, ReactFlow, useNodesState, useEdgesState, addEdge, useReactFlow, Position,
  type Node, type Edge, type Connection, type FinalConnectionState, Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const getId = ((id = 1) => () => `${id++}`)();
const nodeOrigin: [number, number] = [0.5, 0];
// const COLORS = ['purple', 'black', 'gray', 'lightblue', 'teal', 'pink', 'orange'];

function RootNode({ id, data }: {
  id: string;
  data: {
    label: string;
    content: string;
    width?: number;
    color?: string;
    onUpdate: (id: string, updates: Partial<any>) => void;
  };
}) {
  const refText = useRef<HTMLTextAreaElement>(null);
  const [showTools, setShowTools] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const width = data.width ?? 150;

  return (
    <Box
      px={4}
      py={2}
      borderRadius="md"
      bg="white"
      boxShadow="md"
      minW="100px"
      width={`${width}px`}
      border="3px solid"
      borderColor={data.color ?? 'gray.200'}
      position="relative"
    >
      {id !== '0' && (
        <Handle type="target" position={Position.Top} isConnectable={true} />
      )}

      <HStack justify="space-between" mb={1}>
        <Input
          value={data.label}
          onChange={(e) => data.onUpdate(id, { label: e.target.value })}
          variant="unstyled"
          textAlign="center"
          fontWeight="semibold"
        />
        <IconButton
          aria-label="Content"
          size="xs"
          icon={<EditIcon />}
          onClick={() => setShowContent(s => !s)}
        />
        <IconButton
          aria-label="Settings"
          size="xs"
          icon={<SettingsIcon />}
          onClick={() => setShowTools(s => !s)}
        />
      </HStack>

      {showContent && (
        <Box>
          <Divider my={2} />
          <Stack direction="column" spacing={1}>
            <Textarea ref={refText} defaultValue={data.content}/>
          </Stack>
          <Button
            variant="ghost"
            color="green.300"
            onClick={() =>  data.onUpdate(id, { content: refText.current?.value })}>Save</Button>
        </Box>
      )}

      {showTools && (
        <Box>
          <Divider my={2} />
          <Stack direction="row" spacing={1}>
            <Text fontSize="sm" alignSelf="center">width: </Text>
            <Input
              type="number"
              value={width}
              minLength={100}
              maxLength={400}
              onChange={(e) =>  data.onUpdate(id, { width: +e.target.value })}
              variant="unstyled"
              textAlign="center"
              fontSize="sm"
            />
          </Stack>
          {/*<Stack direction="row" spacing={1}>*/}
          {/*  <Select*/}
          {/*    size="sm"*/}
          {/*    value={data.color}*/}
          {/*    onChange={(e) => data.onUpdate(id, { color: e.target.value })}*/}
          {/*  >*/}
          {/*    {COLORS.map((color) => (*/}
          {/*      <option key={color} value={color}>{color}</option>*/}
          {/*    ))}*/}
          {/*  </Select>*/}
          {/*</Stack>*/}
        </Box>
      )}

      <Handle type="source" position={Position.Bottom} isConnectable={true} />
    </Box>
  );
}

const nodeTypes = { custom: RootNode };

export default function FlowBuild() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, getNodes, setCenter } = useReactFlow();

  const updateNodeData = useCallback(
    (id: string, updates: Partial<any>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
        )
      );
    },
    [setNodes]
  );

  const addCustomNode = useCallback((id: string, position: { x: number; y: number }) => ({
    id,
    type: 'custom',
    position,
    origin: nodeOrigin,
    data: {
      label: `Node ${id}`,
      content: '...',
      width: 180,
      color: 'purple.200',
      onUpdate: updateNodeData,
    },
  }), [updateNodeData]);

  useEffect(() => {
    const rootNode = addCustomNode('0', { x: 0, y: 0 });
    setNodes([rootNode]);
  }, [addCustomNode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const root = getNodes()[0];
      if (root) {
        setCenter(root.position.x, root.position.y + 250, { zoom: 1.5, duration: 800 });
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) =>
      addEdge({ ...params, style: { stroke: '#805ad5', strokeWidth: 2 } }, eds)
    );
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, conState: FinalConnectionState) => {
      if (!conState.to || !conState.fromNode) return;
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event;

      const sourceId = conState.fromNode.id;
      const id = getId();
      const position = screenToFlowPosition({ x: clientX, y: clientY });
      const newNode = addCustomNode(id, position);

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [
        ...eds,
        {
          id: `e${sourceId}->${id}`,
          source: sourceId,
          target: id,
          style: { stroke: '#805ad5', strokeWidth: 2 },
        },
      ]);
    },
    [screenToFlowPosition, setEdges, setNodes, addCustomNode]
  );

  return (
    <Box h="100vh">
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
}