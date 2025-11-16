// mern-frontend/src/components/TeamStats.js

import React from 'react';

const TeamStats = ({ stats, unassignedCount }) => {
    return (
        <div 
            style={{ 
                minHeight: '60vh', 
                backgroundColor: '#d6e1f5ff', // White background for stats panel
                border: '1px solid #d0d0d0', 
                borderRadius: '8px',
                padding: '15px', 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '100%' // Takes up the full width of its container
            }}
        >
            <h2 style={{ 
                borderBottom: '2px solid #ccc', 
                paddingBottom: '10px', 
                color: '#444', 
                textAlign: 'center', 
                margin: '0 0 15px 0' 
            }}>
                Team Task Load
            </h2>

            {/* Unassigned Tasks Row */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px', 
                backgroundColor: '#faeeefff', // Light red background
                borderRadius: '4px',
                marginBottom: '10px',
                fontWeight: 'bold',
                color: '#e6505fff'
            }}>
                <span>Unassigned</span>
                <span>{unassignedCount}</span>
            </div>

            {/* List of Team Members */}
            {stats.map(user => (
                <div 
                    key={user._id} 
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '10px', 
                        borderBottom: '1px solid #eee',
                        backgroundColor: user.taskCount === 0 ? '#f0f0f0' : '#ffffff', // Highlight unassigned members
                        borderRadius: '4px',
                        marginBottom: '4px'
                    }}
                >
                    <span style={{ fontWeight: 'bold' }}>{user.username}</span>
                    <span style={{ 
                        fontWeight: 'bold', 
                        color: user.taskCount > 3 ? '#dc3545' : '#28a745' // Red if overloaded (> 3)
                    }}>
                        {user.taskCount} Tasks
                    </span>
                </div>
            ))}
        </div>
    );
};

export default TeamStats;