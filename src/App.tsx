import React, { useCallback, useMemo, useState } from "react";
import "./App.css";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  EdgeChange,
  NodeChange,
  ReactFlowProvider,
  getConnectedEdges,
  ReactFlowInstance,
  XYPosition,
} from "reactflow";
import toast, { Toaster } from "react-hot-toast";
import "reactflow/dist/style.css";

import TextUpdaterNode from "./components/Node";
import { SaveChanges } from "./components/SaveChanges";
import { Draggables } from "./components/Draggables";
import { EditBox } from "./components/EditBox";

function App() {
  const initialNodes = [] satisfies Node[];

  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  const initialEdges = [] satisfies Edge[];

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance | undefined
  >(undefined);
  const [activeNode, setActiveNode] = useState<Node | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const highlightNode = (node: Node, highlight: boolean) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id
          ? { ...n, data: { ...n.data, isHighlighted: highlight } }
          : { ...n, data: { ...n.data, isHighlighted: false } }
      )
    );
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Track input value on both side
    setActiveNode((node) => ({
      ...(node as Node),
      data: { ...node?.data, value: event.target.value },
    }));

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === activeNode?.id) {
          node.data = {
            ...node.data,
            value: event.target.value,
          };
        }

        return node;
      })
    );
  };

  const blurSelected = () => {
    if (activeNode) {
      highlightNode(activeNode, false);
      setActiveNode(null);
    }
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickedElement: HTMLElement = e.target as HTMLElement;
    if (clickedElement.className.includes("react-flow__pane") && activeNode) {
      blurSelected();
    }
  };

  const highlightOnNodeClick = (node: Node) => {
    highlightNode(node, true);
    setActiveNode(node);
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }
      const position =
        reactFlowInstance &&
        reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

      const newNode = {
        id: Date.now().toString(),
        position: position as XYPosition,
        type: "textUpdater", // type of the node
        data: {
          label: "Enter Text Message",
          value: "Text Message",
          isHighlighted: false,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const saveChanges = () => {
    // No Node
    if (!nodes.length) {
      toast.error("Please add atleast 1 node");
      return;
    }
    // No edges
    if (!edges.length) {
      toast.error("Please have the node connected to atleast 1 edge");
      return;
    }

    const IdSet = new Set<string>();

    const connectedEdges = getConnectedEdges(nodes, edges);
    connectedEdges.forEach((nd) => {
      IdSet.add(nd.source);
      IdSet.add(nd.target);
    });

    // Check for Node with no edges
    if (IdSet.size < nodes.length) {
      toast.error("Please have the node connected to atleast 1 edge");
      return;
    }
    toast.success("Changes saved successfully");
  };

  return (
    <ReactFlowProvider>
      <div className="w-[100vw] h-[100vh] flex flex-col">
        <div className="w-full h-[60px] border-black bg-neutral-100 border-b flex justify-end pr-10 items-center">
          <SaveChanges saveChanges={saveChanges} />
        </div>
        <div className="flex flex-row h-[calc(100vh-60px)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onClick={(e) => onCanvasClick(e)}
            onNodesChange={onNodesChange}
            nodesConnectable
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onNodeClick={(_, node) => highlightOnNodeClick(node)}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>

          <div className="w-1/6 border-l h-full bg-blue-50 border-black  py-2">
            {activeNode ? (
              <EditBox
                blurSelected={blurSelected}
                onChange={onChange}
                value={activeNode.data.value}
              />
            ) : (
              <Draggables onDragStart={onDragStart} />
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </ReactFlowProvider>
  );
}

export default App;
