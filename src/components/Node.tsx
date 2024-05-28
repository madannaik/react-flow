import { Handle, NodeProps, Position } from "reactflow";
import { MessageIcon, WhatsAppIcon } from "./Icons";

function TextUpdaterNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="text-updater-node">
      <div className={`p-2 `}>
        <div
          className={`shadow-md ${
            data.isHighlighted && "border border-neutral-600 rounded-md"
          }`}
        >
          <div className="flex w-60 text-sm flex-row items-center justify-between gap-3 bg-cyan-200 px-2 py-1 rounded-tl-md rounded-tr-md ">
            <MessageIcon />
            {data.label}
            <WhatsAppIcon />
          </div>
          <div className="w-60 rounded-bl-md text-sm rounded-br-md  px-2 py-4 bg-white overflow-hidden text-nowrap whitespace-nowrap text-ellipsis">
            {data.value}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Left}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
