import React from "react";
import { MessageIcon } from "./Icons";

interface Props {
  onDragStart: (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string
  ) => void;
}

export const Draggables = ({ onDragStart }: Props) => {
  return (
    <div className="flex justify-center">
      <button
        draggable
        // Options to add many customnodes
        onDragStart={(event) => onDragStart(event, "textUpdater")}
        className="py-3 gap-3 px-4 bg-white text-blue-900 border-blue-900 border-2 hover:bg-blue-100 rounded-md flex flex-col items-center"
      >
        <MessageIcon />
        Message Node
      </button>
    </div>
  );
};
