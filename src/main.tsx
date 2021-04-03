import { makeLoggerSource } from 'logger/view/logger.source';
import React from 'react';
import ReactDOM from 'react-dom';

import { Root } from 'Root';
import { makeTodoApi } from './todo/todo.api';

const Resolved = Root.run({
  todoApi: makeTodoApi(),
  loggerSource: makeLoggerSource(),
});

ReactDOM.render(<Resolved />, document.querySelector('#root'));
