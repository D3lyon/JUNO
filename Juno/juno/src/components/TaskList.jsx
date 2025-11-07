import React from 'react';

const TaskList = ({ tasks }) => {
    return (
        <div>
            <h2>Task List</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.name} - {task.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;