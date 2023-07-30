import express from 'express';

import bcrypt from 'bcryptjs';
import Task from '../models/taskModel.js';
import mongoose from 'mongoose';
import expressAsyncHandler from 'express-async-handler';
import { isAuth,generateToken } from '../utils.js';
import User from '../models/userModel.js';
const taskRouter=express.Router();

taskRouter.get('/:id',async(req,res)=>{
    

    try
    {
        console.log(req.params.id);
    const userId=await User.findById(req.params.id);

    const populatedUser = await User.findById(userId).populate('task');
    if (!populatedUser) {
        return res.status(404).send({ message: 'User not found' });
      }

      const taskArray = populatedUser.task;
      res.status(200).send({ tasks: taskArray });
    }
    catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).send({ message: 'Internal Server Error' });
      }
    


    // console.log(user.task);
    // if(user)
    // {
    //     res.send(user);
    // }
    // else
    // {
    //     res.status(404).send({message:'Product Not Found'});
    // }
})

taskRouter.post('/:id',async(req,res)=>{
   
    try
    {
    const userId=req.params.id;
    console.log(userId);
    //const user=await User.findById(req.params.id);
   
    //console.log(req.body.text);
    //if(user)
    //{
        // await Task.create(
        //    {
        //     task:req.body.text
        //    }
        // )
        // res.status(200).send({ message: 'Task added successfully' });
       
        
        // const populatedUser=await User.findById(userid).populate('task');
        // res.status(200).send({ user: populatedUser, message: 'Task added successfully' });
    //}
    // else
    // {
    //     res.status(404).send({message:'Product Not Found'});
    // }


    const newTask = new Task({
        task: req.body.text,
      });

      const savedTask = await newTask.save();

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { task: savedTask._id } },
        { new: true } // This option returns the updated user document
      );

    //   const populatedUser = await updatedUser.populate('task').execPopulate();
    //   res.status(200).send({ user: updatedUser, message: 'Task added successfully' });
    const populatedUser = await User.populate(updatedUser, { path: 'task' });
    res.status(200).send({ user: populatedUser, message: 'Task added successfully' });
      }
      catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error' });
      }

})


taskRouter.post('/update/:id',async(req,res)=>{
   
 
  try
  {
    
    const userId = req.params.id;
    const taskIdToUpdate = req.body.toDoId;
    const updatedTaskData = req.body.text;
    console.log(updatedTaskData);

    console.log(taskIdToUpdate);

    const taskUpdateResult = await Task.findByIdAndUpdate(taskIdToUpdate, {task:updatedTaskData}, { new: true });

    console.log(taskUpdateResult);
    if (!taskUpdateResult) {
      return res.status(404).json({ message: 'Task not found in the task collection' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const taskIndex = user.task.findIndex((taskId) => taskId.toString() === taskIdToUpdate);
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found in the user\'s task list' });
    }
    
    user.task[taskIndex] = taskUpdateResult._id;

    await user.save();
    res.status(200).json({ message: 'Tasks updated successfully' });

  }
  catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
})



taskRouter.post('/delete/:id',async(req,res)=>{
   
    try
    {
        const taskId=req.body.deleteToDo;
        const userId=req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

        const taskIndex = user.task.findIndex((taskIdInArray) => taskIdInArray.toString() === taskId);
        console.log(taskIndex);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found in the user\'s task list' });
          }
          user.task.splice(taskIndex, 1);

        
          await user.save();

          res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})

export default taskRouter;