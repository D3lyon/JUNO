import React from 'react';

const Header = () => {
    return (
        <header>
            <h1>Task & Client Manager</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/tasks">Tasks</a></li>
                    <li><a href="/clients">Clients</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;