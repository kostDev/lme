import {atom, type WritableAtom} from 'jotai';
import { debounce } from 'lodash-es';
import { memoryStore } from '@store/localforageInstance';
import type { MemoryNode, MemoryEdge, MemoryContext, NodeId } from '@type/type';

const SAVE_MS = 500;

// main atoms
export const nodeMapAtom = atom<Map<NodeId, MemoryNode>>(new Map());
export const edgeMapAtom = atom<Map<NodeId, MemoryEdge>>(new Map());
export const contextMapAtom = atom<Map<NodeId, MemoryContext>>(new Map());

//  LocalForage loading all data as atoms
export const loadMemoryAtom = atom(null, async (_, set) => {
  try {
    const [nodes, edges, contexts] = await Promise.all([
      memoryStore.getItem<[NodeId, MemoryNode][]>('nodes'),
      memoryStore.getItem<[NodeId, MemoryEdge][]>('edges'),
      memoryStore.getItem<[NodeId, MemoryContext][]>('contexts'),
    ]);

    if(nodes && edges && contexts) {
      console.log(
        `nodes: ${nodes.length} | edges ${edges.length} | contexts ${contexts.length}`
      );
    }


    set(nodeMapAtom, new Map(nodes ?? []));
    set(edgeMapAtom, new Map(edges ?? []));
    set(contextMapAtom, new Map(contexts ?? []));
  } catch (error) {
    console.error('[loadMemoryAtom] Failed to load data from LocalForage:', error);
  }
});

// auto save to LocalForage
export function createSyncAtom<T>(
  key: string,
  baseAtom: WritableAtom<Map<string, T>, [Map<string, T>], void>,
  options?: { debounceMs?: number }
)  {
  const saveDebounced = debounce((map: Map<string, T>) => {
    memoryStore.setItem(key, Array.from(map.entries()));
  }, options?.debounceMs ?? SAVE_MS);

  return atom(
    (get) => get(baseAtom),
    (_get, set, newMap: Map<string, T>) => {
      saveDebounced(newMap);
      set(baseAtom, new Map(newMap ?? []));
    }
  );
}

export const nodeMapSyncAtom = createSyncAtom<MemoryNode>('nodes', nodeMapAtom);
export const edgeMapSyncAtom = createSyncAtom<MemoryEdge>('edges', edgeMapAtom);
export const contextMapSyncAtom = createSyncAtom<MemoryContext>('contexts', contextMapAtom);