import React from 'react';
import styles from './Counter.module.css';

export const Counter = ({ onIncrement, onDecrement, value }) => {
  return (
    <div className="custom-number-input h-10 w-32">
      <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
        <button
          onClick={() => onDecrement()}
          data-action="decrement"
          className={
            'text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none ' +
            styles.sidebutton
          }
        >
          <span className="m-auto text-2xl font-thin">−</span>
        </button>
        <div
          className="focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center justify-center text-gray-700  outline-none"
          name="custom-input-number"
        >
          {value}
        </div>
        <button
          onClick={() => onIncrement()}
          className={
            'bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer sidebutton ' +
            styles.sidebutton
          }
        >
          <span className="m-auto text-2xl font-thin">+</span>
        </button>
      </div>
    </div>
  );
};
