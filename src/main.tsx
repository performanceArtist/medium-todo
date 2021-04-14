import { AnyAction } from '@performance-artist/medium';
import React from 'react';
import ReactDOM from 'react-dom';

import { Root } from 'Root';
import { makeTodoApi } from './todo/todo.api';

const Resolved = Root.run({
  todoApi: makeTodoApi(),
  logMedium: (action: AnyAction) =>
    console.log('[out]', action.type, action.payload),
  logSource: (action: AnyAction) =>
    console.log('[in]', action.type, action.payload),
});

ReactDOM.render(<Resolved />, document.querySelector('#root'));
