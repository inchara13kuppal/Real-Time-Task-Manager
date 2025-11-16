const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const Task = require('../models/Task'); 
const Project = require('../models/Project'); 
const User = require('../models/User'); 

// Export the router as a function that accepts the io instance
module.exports = (io) => { 

    // --- HELPER: Initialize a default project if none exists (for simplicity)
    const getOrCreateDefaultProject = async (userId) => {
        let project = await Project.findOne({ name: 'Collaborative Board' });
        
        if (!project) {
            project = new Project({ 
                name: 'Collaborative Board', 
                members: [userId] 
            });
            await project.save();
        }
        
        if (!project.members.includes(userId)) {
            project.members.push(userId);
            await project.save();
        }
        return project;
    };


    // @route   GET api/tasks/users
    // @desc    Get list of all users for assignment dropdown
    router.get('/users', authMiddleware, async (req, res) => {
        try {
            const users = await User.find().select('-password'); 
            res.json(users);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });


    // @route   GET api/tasks
    // @desc    Get all tasks for the project
    router.get('/', authMiddleware, async (req, res) => {
        try {
            const project = await getOrCreateDefaultProject(req.user.id);

            const tasks = await Task.find({ project: project._id })
                .populate('assignedTo', ['username']); 
            
            res.json({ tasks, projectId: project._id });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });


    // @route   POST api/tasks
    // @desc    Create a new task
    router.post('/', authMiddleware, async (req, res) => {
        const { title, description, status, assignedTo } = req.body;
        try {
            const project = await getOrCreateDefaultProject(req.user.id);
            
            const newTask = new Task({
                title,
                description: description || '', // Ensure description is set, defaults to empty string
                status: status || 'To Do',
                assignedTo: assignedTo || null,
                project: project._id
            });

            const task = await newTask.save();
            
            const populatedTask = await Task.findById(task._id).populate('assignedTo', ['username']);

            // REAL-TIME: Emit event after creating a task
            io.emit('task_created', populatedTask); 

            res.json(populatedTask);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    // @route   PUT api/tasks/:id
    // @desc    Update task status/details (Used for drag-and-drop AND full editing)
    router.put('/:id', authMiddleware, async (req, res) => {
        try {
            let task = await Task.findById(req.params.id);
            if (!task) return res.status(404).json({ msg: 'Task not found' });

            // $set handles updating any field passed in req.body (title, description, status, assignedTo)
            task = await Task.findByIdAndUpdate(
                req.params.id, 
                { $set: req.body }, 
                { new: true } // Return the updated document
            ).populate('assignedTo', ['username']);

            // REAL-TIME: Emit event after updating a task
            io.emit('task_updated', task); 

            res.json(task);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    // @route   DELETE api/tasks/:id
    // @desc    Delete a task (NEW FUNCTIONALITY)
    router.delete('/:id', authMiddleware, async (req, res) => {
        try {
            let task = await Task.findById(req.params.id);
            if (!task) return res.status(404).json({ msg: 'Task not found' });

            await Task.findByIdAndDelete(req.params.id);

            // REAL-TIME: Emit event after deleting a task
            io.emit('task_deleted', req.params.id); 

            res.json({ msg: 'Task removed' });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    return router; 
};