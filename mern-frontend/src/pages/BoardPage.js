// mern-frontend/src/pages/BoardPage.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import TeamStats from '../components/TeamStats'; // Assuming TeamStats.js is created
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

function BoardPage() {
    const { logout, token } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [assignedUserId, setAssignedUserId] = useState('');
    
    const columns = ['To Do', 'In Progress', 'Done'];

    // Helper to assign a light color to each column
    const getColumnColor = (status) => {
        switch(status) {
            case 'To Do': return '#e6f7ff';
            case 'In Progress': return '#fffbe6';
            case 'Done': return '#f0fff4';
            default: return '#ffffff';
        }
    };
    
    // Helper: Calculate statistics for all users
    const calculateStats = () => {
        const stats = users.map(user => {
            const userTasks = tasks.filter(task => 
                // Checks if the assignedTo array exists and includes the user's ID
                task.assignedTo && task.assignedTo.some(assignment => assignment._id === user._id)
            );
            return {
                ...user,
                taskCount: userTasks.length
            };
        });
        
        // Find tasks that are not assigned to anyone
        const unassignedTasks = tasks.filter(task => !task.assignedTo || task.assignedTo.length === 0);
        
        return { stats, unassignedCount: unassignedTasks.length };
    };
    

    // --- 1. Data Fetching --- 
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const config = { headers: { 'x-auth-token': token } };
                
                const taskRes = await axios.get('/api/tasks', config);
                setTasks(taskRes.data.tasks);

                const userRes = await axios.get('/api/tasks/users', config);
                setUsers(userRes.data);
            } catch (err) {
                console.error("Failed to fetch board data:", err);
                logout(); 
            }
        };

        if (token) {
            fetchBoardData();
        }
    }, [token, logout]);


    // --- 2. Real-Time Socket.io Handlers --- 
    useEffect(() => {
        if (!socket) return;
        
        socket.on('task_created', (newTask) => {
            setTasks(prevTasks => [...prevTasks, newTask]);
        });
        
        socket.on('task_updated', (updatedTask) => {
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task._id === updatedTask._id ? updatedTask : task
                )
            );
        });

        socket.on('task_deleted', (deletedTaskId) => {
            setTasks(prevTasks => prevTasks.filter(task => task._id !== deletedTaskId));
        });

        return () => {
            socket.off('task_created');
            socket.off('task_updated');
            socket.off('task_deleted'); 
        };
    }, [socket]);


    // --- 3. Task Creation Logic ---
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle) return;

        try {
            const config = { headers: { 'x-auth-token': token } };
            const body = { 
                title: newTaskTitle, 
                description: newTaskDescription, 
                // Send assignedTo as an array
                assignedTo: assignedUserId ? [assignedUserId] : []
            };
            
            await axios.post('/api/tasks', body, config);
            
            setNewTaskTitle('');
            setNewTaskDescription('');
            setAssignedUserId('');
        } catch (err) {
            console.error(err);
        }
    };


    // --- 4. Drag & Drop Logic ---
    const onDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = async (e, newStatus) => {
        const taskId = e.dataTransfer.getData("taskId");
        
        try {
            const config = { headers: { 'x-auth-token': token } };
            const body = { status: newStatus };

            await axios.put(`/api/tasks/${taskId}`, body, config);
        } catch (err) {
            console.error(err);
        }
    };


    // --- 5. Rendering the Board ---
    const renderTasksByStatus = (status) => {
        return tasks
            .filter(task => task.status === status)
            .map(task => (
                <TaskCard 
                    key={task._id} 
                    task={task} 
                    onDragStart={onDragStart} 
                    users={users} 
                />
            ));
    };

    const { stats, unassignedCount } = calculateStats();

    return (
        <div style={{ padding: '30px', backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            
            {/* Header: Project Lens (Left), Board Title (Center), Logout (Right) */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '30px', 
                borderBottom: '2px solid #eee', 
                paddingBottom: '15px' 
            }}>
                
                {/* 1. Project Name (Project Lens) */}
                <h1 style={{ 
                    color: '#007bff', 
                    margin: 0,
                    fontSize: '1.5em',
                    position: 'absolute',
                    left: '30px', 
                    top: '30px',
                    width: 'auto'
                }}>
                    Project Lens
                </h1>
                
                {/* 2. Centered Page Title */}
                <h1 style={{ 
                    color: '#333', 
                    margin: 0,
                    fontSize: '1.2em', 
                    flexGrow: 1, 
                    textAlign: 'center'
                }}>
                    Collaborative Task Board
                </h1>

                {/* 3. Logout Button */}
                <button 
                    onClick={logout}
                    style={{ 
                        padding: '10px 15px', 
                        backgroundColor: '#ff6b6b', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}
                >
                    Logout
                </button>
            </div>
            
            {/* Task Creation Form */}
            <form onSubmit={handleCreateTask} 
                style={{ 
                    marginBottom: '40px', 
                    padding: '20px', 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}
            >
                <input 
                    type="text" 
                    placeholder="Task Title" 
                    value={newTaskTitle} 
                    onChange={(e) => setNewTaskTitle(e.target.value)} 
                    required 
                    style={{ flex: '1 1 200px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <input 
                    type="text" 
                    placeholder="Task Description (Optional)" 
                    value={newTaskDescription} 
                    onChange={(e) => setNewTaskDescription(e.target.value)} 
                    style={{ flex: '1 1 300px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <select 
                    value={assignedUserId} 
                    onChange={(e) => setAssignedUserId(e.target.value)}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                >
                    <option value="">Assign To...</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <button 
                    type="submit"
                    style={{ 
                        padding: '10px 15px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                    }}
                >
                    Add Task
                </button>
            </form>

            {/* Kanban Board Layout (4 Columns) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                {/* Kanban Columns (To Do, In Progress, Done) */}
                {columns.map(status => (
                    <div
                        key={status}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, status)} 
                        style={{ 
                            width: '24%', // Column width
                            minHeight: '60vh', 
                            backgroundColor: getColumnColor(status), 
                            border: '1px solid #d0d0d0', 
                            borderRadius: '8px',
                            padding: '15px', 
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <h2 style={{ 
                            borderBottom: '2px solid #ccc', 
                            paddingBottom: '10px', 
                            color: '#444', 
                            textAlign: 'center', 
                            margin: '0 0 15px 0' 
                        }}>
                            {status}
                        </h2>
                        {renderTasksByStatus(status)}
                    </div>
                ))}

                {/* Vertical Team Load Stats Column */}
                <div style={{ width: '24%', minHeight: '60vh' }}>
                    <TeamStats stats={stats} unassignedCount={unassignedCount} />
                </div>
            </div>
        </div>
    );
}

export default BoardPage;