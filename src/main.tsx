import React from 'react';
import ReactDOM from 'react-dom';

import { Root } from 'Root';
import { makeTodoApi } from 'todo/api';

const Resolved = Root.run({
  todoApi: makeTodoApi(),
});

ReactDOM.render(<Resolved />, document.querySelector('#root'));
