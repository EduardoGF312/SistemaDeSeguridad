// AppContext.js
import { createContext } from 'react';

const AppContext = createContext({
  resetButtonCount: () => {},
});

export default AppContext;
