"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from "@/store/counterSlice";
import { RootState } from "@/store/store";

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Redux Counter Example</h2>
      <div className="text-2xl">{count}</div>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment
        </button>
        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Decrement
        </button>
        <button
          onClick={() => dispatch(incrementByAmount(5))}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add 5
        </button>
        <button
          onClick={() => dispatch(reset())}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
