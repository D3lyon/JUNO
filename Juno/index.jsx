import React, { createContext, useContext, useState } from "react";
import { createRoot } from "react-dom/client";
import {

BrowserRouter,
Routes,
Route,
Link,
useParams,
useNavigate,
} from "react-router-dom";

/*
Simple Task Router
- Routes:
    /         -> TaskList
    /tasks/:id -> TaskDetail
    /new      -> NewTask
- In-memory tasks via context
*/

const TaskContext = createContext();

function TaskProvider({ children }) {
const [tasks, setTasks] = useState([
    { id: "1", title: "Buy groceries", notes: "Milk, eggs, bread" },
    { id: "2", title: "Finish report", notes: "Due Monday" },
]);

const addTask = (task) =>
    setTasks((t) => [...t, { ...task, id: String(Date.now()) }]);
const removeTask = (id) => setTasks((t) => t.filter((x) => x.id !== id));
const getTask = (id) => tasks.find((t) => t.id === id);

return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask, getTask }}>
        {children}
    </TaskContext.Provider>
);
}

function useTasks() {
return useContext(TaskContext);
}

function TaskDetail() {
const { id } = useParams();
const { getTask, removeTask } = useTasks();
const navigate = useNavigate();
const task = getTask(id);

if (!task) {
    return (
        <div style={{ padding: 20 }}>
            <p>Task not found.</p>
            <Link to="/">Back to list</Link>
        </div>
    );
}

return (
    <div style={{ padding: 20 }}>
        <h2>{task.title}</h2>
        <p>{task.notes}</p>
        <button
            onClick={() => {
                removeTask(id);
                navigate("/");
            }}
        >
            Delete
        </button>
        {" "}
        <Link to="/">Back</Link>
    </div>
);
}

function NewTask() {
const { addTask } = useTasks();
const navigate = useNavigate();
const [title, setTitle] = useState("");
const [notes, setNotes] = useState("");

const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), notes: notes.trim() });
    navigate("/");
};

return (
    <div style={{ padding: 20 }}>
        <h2>New Task</h2>
        <form onSubmit={submit}>
            <div>
                <label>
                    Title:
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ marginLeft: 8 }}
                    />
                </label>
            </div>
            <div style={{ marginTop: 8 }}>
                <label>
                    Notes:
                    <input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{ marginLeft: 8 }}
                    />
                </label>
            </div>
            <div style={{ marginTop: 12 }}>
                <button type="submit">Add</button>{" "}
                <Link to="/">Cancel</Link>
            </div>
        </form>
    </div>
);
}

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <ClientProvider>
          <header style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
            <Link to="/">Home</Link>
          </header>

          <Routes>
    <Route path="/" element={<TaskList />} />
    <Route path="/tasks/:id" element={<TaskDetail />} />
    <Route path="/new" element={<NewTask />} />
    <Route path="/clients/:id" element={<ClientDetail />} /> {/* New route for client details */}
</Routes>
        </ClientProvider>
      </TaskProvider>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root") || document.body);
root.render(<App />);

// Add EditableTable component
function EditableTable() {
  const [tableData, setTableData] = useState([
    { id: 1, name: '', email: '', role: '' },
    { id: 2, name: '', email: '', role: '' },
  ]);

  const handleCellEdit = (id, field, value) => {
    setTableData(tableData.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const addRow = () => {
    setTableData([...tableData, { 
      id: Date.now(), 
      name: '', 
      email: '', 
      role: '' 
    }]);
  };

  const deleteRow = (id) => {
    setTableData(tableData.filter(row => row.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Data Table</h2>
      <button onClick={addRow}>Add Row</button>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Email</th>
            <th style={tableHeaderStyle}>Role</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(row => (
            <tr key={row.id}>
              <td style={tableCellStyle}>
                <input
                  value={row.name}
                  onChange={(e) => handleCellEdit(row.id, 'name', e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  value={row.email}
                  onChange={(e) => handleCellEdit(row.id, 'email', e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  value={row.role}
                  onChange={(e) => handleCellEdit(row.id, 'role', e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={tableCellStyle}>
                <button onClick={() => deleteRow(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Add styles
const tableHeaderStyle = {
  backgroundColor: '#f4f4f4',
  padding: '8px',
  border: '1px solid #ddd',
  textAlign: 'left'
};

const tableCellStyle = {
  padding: '8px',
  border: '1px solid #ddd'
};

const inputStyle = {
  width: '100%',
  padding: '4px',
  border: '1px solid transparent',
  borderRadius: '2px'
};

// Replace the existing TaskList component with this updated version
function TaskList() {
  const { tasks, removeTask } = useTasks();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1 }}>
          <h2>Tasks</h2>
          <Link to="/new">+ New Task</Link>
          <ul>
            {tasks.map((t) => (
              <li key={t.id} style={{ marginTop: 8 }}>
                <Link to={`/tasks/${t.id}`}>{t.title}</Link>
                {" — "}
                <button onClick={() => removeTask(t.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <EditableTable />
        </div>
      </div>
      <ClientGallery />
    </div>
  );
}

// Add this new context for clients after TaskContext
const ClientContext = createContext();

function ClientProvider({ children }) {
  const [clients, setClients] = useState([
    { 
      id: "1", 
      name: "John Doe", 
      image: "https://via.placeholder.com/150",
      email: "john@example.com",
      project: "Website Redesign"
    },
    { 
      id: "2", 
      name: "Jane Smith", 
      image: "https://via.placeholder.com/150",
      email: "jane@example.com",
      project: "Mobile App"
    },
  ]);

  const addClient = (client) => 
    setClients(c => [...c, { ...client, id: String(Date.now()) }]);
  const removeClient = (id) => 
    setClients(c => c.filter(x => x.id !== id));

  return (
    <ClientContext.Provider value={{ clients, addClient, removeClient }}>
      {children}
    </ClientContext.Provider>
  );
}

function useClients() {
  return useContext(ClientContext);
}

// Add the Gallery component
function ClientGallery() {
  const { clients, removeClient } = useClients();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    project: '',
    image: 'https://via.placeholder.com/150'
  });

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name.trim()) return;
    const { addClient } = useClients();
    addClient(newClient);
    setNewClient({ name: '', email: '', project: '', image: 'https://via.placeholder.com/150' });
    setShowAddForm(false);
  };

  return (
    <div style={galleryContainerStyle}>
      <div style={galleryHeaderStyle}>
        <h2>Clients Gallery</h2>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Client'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddClient} style={formStyle}>
          <input
            placeholder="Name"
            value={newClient.name}
            onChange={e => setNewClient({...newClient, name: e.target.value})}
            style={inputStyle}
          />
          <input
            placeholder="Email"
            value={newClient.email}
            onChange={e => setNewClient({...newClient, email: e.target.value})}
            style={inputStyle}
          />
          <input
            placeholder="Project"
            value={newClient.project}
            onChange={e => setNewClient({...newClient, project: e.target.value})}
            style={inputStyle}
          />
          <button type="submit">Add Client</button>
        </form>
      )}

      <div style={galleryGridStyle}>
    {clients.map(client => (
        <Link to={`/clients/${client.id}`} key={client.id} style={{ textDecoration: 'none' }}>
            <div style={clientCardStyle}>
                <img src={client.image} alt={client.name} style={clientImageStyle} />
                <h3 style={clientNameStyle}>{client.name}</h3>
                <p style={clientDetailStyle}>{client.email}</p>
                <p style={clientDetailStyle}>{client.project}</p>
                <button 
                    onClick={(e) => { e.stopPropagation(); removeClient(client.id); }}
                    style={deleteButtonStyle}
                >
                    Remove
                </button>
            </div>
        </Link>
    ))}
</div>
    </div>
  );
}

// Add these styles before the App component
const galleryContainerStyle = {
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
};

const galleryHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const galleryGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '20px',
};

const clientCardStyle = {
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const clientImageStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '4px',
};

const clientNameStyle = {
  margin: '10px 0',
  fontSize: '1.1em',
};

const clientDetailStyle = {
  margin: '5px 0',
  color: '#666',
};

const deleteButtonStyle = {
  backgroundColor: '#ff4444',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '20px',
};

function ClientDetail() {
    const { id } = useParams();
    const { clients, removeClient } = useClients();
    const client = clients.find(c => c.id === id);
    const [projectDetails, setProjectDetails] = useState(client?.projectDetails || []);
    const [newDetail, setNewDetail] = useState("");

    const handleAddDetail = (e) => {
        e.preventDefault();
        if (!newDetail.trim()) return;
        setProjectDetails([...projectDetails, { description: newDetail, status: '' }]);
        setNewDetail("");
    };

    if (!client) {
        return (
            <div style={{ padding: 20 }}>
                <p>Client not found.</p>
                <Link to="/">Back to gallery</Link>
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>{client.name}</h2>
            <img src={client.image} alt={client.name} style={{ width: '150px' }} />
            <p>Email: {client.email}</p>
            <p>Project: {client.project}</p>
            <form onSubmit={handleAddDetail} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newDetail}
                    onChange={(e) => setNewDetail(e.target.value)}
                    placeholder="Add project detail"
                    style={{ marginRight: '10px' }}
                />
                <button type="submit">Add Detail</button>
            </form>
            <EditableProjectDetails projectDetails={projectDetails} setProjectDetails={setProjectDetails} />
            <button onClick={() => removeClient(client.id)}>Remove Client</button>
            <Link to="/">Back to gallery</Link>
        </div>
    );
}

function EditableProjectDetails({ projectDetails, setProjectDetails }) {
    const [columns, setColumns] = useState([{ name: 'Description' }, { name: 'Status' }]);
    const [newColumnName, setNewColumnName] = useState('');

    const handleCellEdit = (index, columnIndex, value) => {
        const updatedDetails = projectDetails.map((detail, i) => 
            i === index ? { ...detail, [columns[columnIndex].name.toLowerCase()]: value } : detail
        );
        setProjectDetails(updatedDetails);
    };

    const addDetailRow = () => {
        const newRow = {};
        columns.forEach(col => newRow[col.name.toLowerCase()] = '');
        setProjectDetails([...projectDetails, newRow]);
    };

    const addColumn = () => {
        if (!newColumnName.trim()) return;
        setColumns([...columns, { name: newColumnName }]);
        setProjectDetails(projectDetails.map(detail => ({ ...detail, [newColumnName.toLowerCase()]: '' })));
        setNewColumnName('');
    };

    return (
        <div>
            <h3>Project Details</h3>
            <button onClick={addDetailRow}>Add Detail</button>
            <div style={{ marginBottom: '10px' }}>
                <input
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="New Column Name"
                    style={inputStyle}
                />
                <button onClick={addColumn}>Add Column</button>
            </div>
            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={tableHeaderStyle}>{col.name}</th>
                        ))}
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projectDetails.map((detail, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} style={tableCellStyle}>
                                    <input
                                        value={detail[col.name.toLowerCase()] || ''}
                                        onChange={(e) => handleCellEdit(rowIndex, colIndex, e.target.value)}
                                        style={inputStyle}
                                    />
                                </td>
                            ))}
                            <td style={tableCellStyle}>
                                <button onClick={() => {
                                    const updatedDetails = projectDetails.filter((_, i) => i !== rowIndex);
                                    setProjectDetails(updatedDetails);
                                }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
