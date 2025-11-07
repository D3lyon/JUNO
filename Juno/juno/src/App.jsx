import React from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import './styles/app.css';

const App = () => {
    return (
        <div>
            <Header />
            <TaskList />
        </div>
    );
};

export default App;