export type NodeId = string;

export interface MemoryNode {
  id: NodeId;
  contextId: string;
  edgeId: string;
  title: string;
  tags: string[];
  children: string[];
  createdAt: string;
  updatedAt: string;
}

export const EdgeTypes = {
  depends_on: 'depends_on',
  extends: 'extends',
  used_in: 'used_in',
  defined_by: 'defined_by',
  is_part_of: 'is_part_of',
  refuted_by: 'refuted_by'
} as const;

export type EdgeType = keyof typeof EdgeTypes;

export interface MemoryEdge {
  id: string;
  mnodeId: NodeId;
  type: EdgeType;
  from: string;
  to: string  | string[];
  createdAt: string;
  updatedAt: string;
}

export interface MemoryContext {
  id: string;
  mnodeId: NodeId;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type NodeMap = Map<NodeId, MemoryNode>
export type EdgeMap = Map<NodeId, MemoryEdge>
export type ContextMap = Map<NodeId, MemoryContext>