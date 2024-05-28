import React from "react";
import { ArrowLeft } from "./Icons";

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  blurSelected: () => void;
}

export const EditBox = ({ blurSelected, onChange, value }: Props) => {
  return (
    <div className="text-3xl font-bold text-center text-blue-900">
      <div className="flex justify-between border-b border-black px-2 mb-4">
        <div className="cursor-pointer" onClick={blurSelected}>
          <ArrowLeft />
        </div>
        <label
          htmlFor="first_name"
          className="block mb-2 text-sm font-medium text-blue-700"
        >
          First Message
        </label>
        <div></div>
      </div>
      <div className="px-2 pb-8 border-b border-black">
        <input
          onChange={onChange}
          type="text"
          id="first_name"
          value={value}
          className="text-lg px-4 py-2 text-black font-normal"
          placeholder="John"
          required
        />
      </div>
    </div>
  );
};
