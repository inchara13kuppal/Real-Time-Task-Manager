import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import axios from 'axios';

// Helper function to get the dot color based on status
const getStatusColor = (status) => {
    switch (status) {
        case 'To Do':
            return '#dc3545'; // Red
        case 'In Progress':
            return '#ffc107'; // Yellow/Amber
        case 'Done':
            return '#28a745'; // Green
        default:
            return '#6c757d'; // Default (Gray)
    }
};

const TaskCard = ({ task, onDragStart, users }) => {
    const { token } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    
    // Check if task.assignedTo exists and grab the first user if it's an array
    const initialAssignedUser = task.assignedTo && task.assignedTo.length > 0 
                                ? task.assignedTo[0] 
                                : null;

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [assignedTo, setAssignedTo] = useState(initialAssignedUser ? initialAssignedUser._id : '');

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const config = { headers: { 'x-auth-token': token } };
                await axios.delete(`/api/tasks/${task._id}`, config);
            } catch (err) {
                console.error('Failed to delete task', err);
            }
        }
    };
    
    const handleUpdate = async () => {
        try {
            const config = { headers: { 'x-auth-token': token } };
            // Ensure assignedTo is sent as an array for the PUT request
            const body = { 
                title, 
                description, 
                assignedTo: assignedTo ? [assignedTo] : []
            };

            await axios.put(`/api/tasks/${task._id}`, body, config);
            setIsEditing(false); 
        } catch (err) {
            console.error('Failed to update task', err);
        }
    };


    // Determine the user to display for the card
    const displayUser = initialAssignedUser; 


    // --- RENDERING EDIT MODE ---
    if (isEditing) {
        return (
            <div style={{ padding: '15px', margin: '10px 0', backgroundColor: '#fff', borderRadius: '8px', border: '2px solid #007bff' }}>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '5px', marginBottom: '8px', border: '1px solid #ccc' }}
                />
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add description..."
                    rows="3"
                    style={{ width: '100%', padding: '5px', marginBottom: '8px', border: '1px solid #ccc' }}
                />
                <select 
                    value={assignedTo} 
                    onChange={(e) => setAssignedTo(e.target.value)}
                    style={{ width: '100%', padding: '5px', marginBottom: '10px', border: '1px solid #ccc' }}
                >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.username}</option>
                    ))}
                </select>
                <button onClick={handleUpdate} style={{ marginRight: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#ccc', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
            </div>
        );
    }

    // --- RENDERING VIEW MODE ---
    return (
        <div 
            className="task-card"
            draggable
            onDragStart={(e) => onDragStart(e, task._id)}
            style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px', 
                padding: '12px', 
                margin: '10px 0', 
                cursor: 'grab',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                position: 'relative'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{task.title}</h4>
                
                {/* Status Indicator Dot */}
                <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(task.status),
                    marginLeft: '10px',
                    flexShrink: 0, 
                    marginTop: '4px' 
                }}></div>
                
            </div>
            
            {/* Show description only if it exists */}
            {task.description && (
                <p style={{ fontSize: '0.85em', color: '#666', margin: '0 0 8px 0' }}>
                    {task.description}
                </p>
            )}
            
            {/* Display the assigned user if one exists in the array */}
            {displayUser && ( 
                <small style={{ 
                    backgroundColor: '#e6f7ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: '#0056b3',
                    fontWeight: 'bold'
                }}>
                    Assigned to: {displayUser.username}
                </small>
            )}

            {/* Editing and Deleting Controls */}
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                <button 
                    onClick={() => setIsEditing(true)} 
                    style={{ marginRight: '5px', backgroundColor: '#ffc107', color: 'white', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75em' }}
                >
                    Edit
                </button>
                <button 
                    onClick={handleDelete} 
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75em' }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskCard;