// Stub for motion/react to avoid build errors
// Replaces motion components with regular divs

import { createElement, forwardRef } from 'react';

export const motion = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        return forwardRef((props: any, ref: any) => {
          const { animate, initial, exit, transition, whileHover, whileTap, variants, ...rest } = props;
          return createElement(prop, { ...rest, ref });
        });
      }
      return undefined;
    },
  }
);

export const AnimatePresence = ({ children }: any) => children;

export default motion;
