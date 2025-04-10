import mongoose from 'mongoose';

export interface ITask extends mongoose.Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  project: mongoose.Schema.Types.ObjectId;
  assignedTo: mongoose.Schema.Types.ObjectId[];
  dependencies: mongoose.Schema.Types.ObjectId[];
  type: string;
  isDisabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a task name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    type: {
      type: String,
      enum: ['task', 'milestone', 'project'],
      default: 'task',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>('Task', TaskSchema);