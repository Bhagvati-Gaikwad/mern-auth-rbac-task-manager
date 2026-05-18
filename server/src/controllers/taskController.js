import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/Task.js";

const findOwnedTask = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, owner: userId });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Task created",
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id);

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id);

    Object.assign(task, req.body);
    await task.save();

    res.json({
      success: true,
      message: "Task updated",
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await findOwnedTask(req.params.id, req.user._id);
    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted"
    });
  } catch (error) {
    next(error);
  }
};
