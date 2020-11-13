import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

    state = {
      tasks: [],
      taskName: '',
    };

    componentDidMount() {

      this.socket = io('http://localhost:8000');
      this.socket.on('addTask', (task) => this.addTask(task.id, task.task));
      this.socket.on('removeTask', (task) => this.removeTask(task.id, task.task));
      this.socket.on('updateData', (tasks) => this.updateTasks(tasks));

    }

    updateTasks(tasks) {
      this.setState({
        tasks: [
          ...tasks,
        ],
      });
    }

    removeTask(id, task) {
      const {tasks} = this.state;

      const updatedTaskList = tasks.filter(task => task.id !== id);

      this.setState({
        tasks: updatedTaskList,
      });

      this.socket.emit('removeTask', ({id: id, task: task}));
    }

    addTask(id, taskName) {
      const {tasks} = this.state;

      this.setState({
        tasks: [
          ...tasks,
          {
            id: id,
            task: taskName,
          },
        ],
        taskName: '',
      });
    }

    handleChange = (e) => {
      this.setState({
        taskName: e.target.value,
      });
    }

    handleSubmit = (event) => {
      const {taskName} = this.state;
      event.preventDefault();

      const id = uuidv4();
      this.addTask(id, taskName);

      this.socket.emit('addTask', ({id: id, taskName: taskName}));

    }

    render() {
      const {tasks, taskName} = this.state;
      return (
        <div className="App">

          <header>
            <h1>ToDoList.app</h1>
          </header>

          <section className="tasks-section" id="tasks-section">
            <h2>Tasks</h2>

            <ul className="tasks-section__list" id="tasks-list">
              {tasks.map(({id, task}) =>
                <li className="task" key={id}>{task}
                  <button className="btn btn--red" onClick={() => this.removeTask(id, task)}>Remove
                  </button>
                </li>
              )}
            </ul>

            <form onSubmit={this.handleSubmit}>
              <input autoComplete="off" type="text" value={taskName} onChange={this.handleChange}
                placeholder="Type your description"/>
              <button type="submit">Add</button>
            </form>

          </section>
        </div>
      );
    }
}

export default App;