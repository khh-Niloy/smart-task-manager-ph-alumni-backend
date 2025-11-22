import { Project, Task } from "./project.model";
import { IProject, ITask, TaskPriority } from "./project.interface";
import { Types } from "mongoose";
import { Team, TeamMember } from "../team/team.model";
import { ActivityLog } from "../activity/activity.model";
import { ActivityType } from "../activity/activity.interface";

// Project Services
const getProjectsService = async () => {
  const projects = await Project.find().populate("team", "name").populate("tasks");
  return projects;
};

const createProjectService = async (payload: Partial<IProject>) => {
  const newProject = await Project.create(payload);
  return newProject;
};

const updateProjectService = async (
  projectId: string,
  payload: Partial<IProject>
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedProject;
};

const deleteProjectService = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Delete all tasks associated with this project
  await Task.deleteMany({ project: projectId });

  // Delete the project
  await Project.findByIdAndDelete(projectId);

  return { message: "Project and associated tasks deleted successfully" };
};

// Task Services
const getTeamMembersWithLoadService = async (projectId: string) => {
  // Get the project with team
  const project = await Project.findById(projectId).populate("team");
  if (!project) {
    throw new Error("Project not found");
  }

  if (!project.team) {
    throw new Error("Project is not linked to a team");
  }

  const teamId = project.team as Types.ObjectId;

  // Get all team members
  const teamMembers = await TeamMember.find({ team: teamId });


  // Calculate current task load for each member (across all projects)
  const membersWithLoad = await Promise.all(
    teamMembers.map(async (member) => {
      const memberId = member._id.toString();
      // Count all tasks assigned to this member (excluding "Done" status) across all projects
      const currentTasks = await Task.countDocuments({
        assignedMember: memberId,
        status: { $ne: "Done" },
      });

      return {
        _id: member._id,
        name: member.name,
        role: member.role,
        capacity: member.capacity,
        currentTasks,
        loadPercentage: member.capacity > 0 ? (currentTasks / member.capacity) * 100 : 0,
        isOverCapacity: currentTasks > member.capacity,
      };
    })
  );

  return {
    team: project.team,
    members: membersWithLoad,
  };
};

const autoAssignMemberService = async (projectId: string) => {
  const { members } = await getTeamMembersWithLoadService(projectId);

  if (members.length === 0) {
    throw new Error("No team members available for assignment");
  }

  // Find member with least load (currentTasks / capacity ratio)
  const memberWithLeastLoad = members.reduce((best, current) => {
    const bestLoadRatio = best.capacity > 0 ? best.currentTasks / best.capacity : Infinity;
    const currentLoadRatio =
      current.capacity > 0 ? current.currentTasks / current.capacity : Infinity;

    // Prefer members who are not over capacity
    if (best.isOverCapacity && !current.isOverCapacity) return current;
    if (!best.isOverCapacity && current.isOverCapacity) return best;

    // If both have same over-capacity status, pick the one with lower load ratio
    return currentLoadRatio < bestLoadRatio ? current : best;
  });

  return memberWithLeastLoad._id.toString();
};

const createTaskService = async (
  payload: Partial<ITask>,
  options?: { autoAssign?: boolean; forceAssign?: boolean }
) => {
  // Verify that the project exists
  const project = await Project.findById(payload.project).populate("team");
  if (!project) {
    throw new Error("Project not found");
  }

  if (!project.team) {
    throw new Error("Project is not linked to a team");
  }

  let assignedMember = payload.assignedMember;
  let capacityWarning = null;

  // Handle auto-assign
  if (options?.autoAssign) {
    assignedMember = await autoAssignMemberService(payload.project as string);
    payload.assignedMember = assignedMember;
  }

  // Check capacity if a member is assigned
  if (assignedMember && assignedMember !== "Unassigned") {
    const { members } = await getTeamMembersWithLoadService(
      payload.project as string
    );
    const selectedMember = members.find(
      (m) => m._id.toString() === assignedMember
    );

    if (selectedMember) {
      const currentTasks = selectedMember.currentTasks;
      const capacity = selectedMember.capacity;

      // Check if member is over capacity (before adding this new task)
      if (currentTasks >= capacity) {
        if (!options?.forceAssign) {
          capacityWarning = {
            memberName: selectedMember.name,
            currentTasks,
            capacity,
            message: `${selectedMember.name} has ${currentTasks} tasks but capacity is ${capacity}. Assign anyway?`,
          };
          // Throw error to be caught by controller
          throw new Error(
            `CAPACITY_WARNING:${JSON.stringify(capacityWarning)}`
          );
        }
      }
    }
  }

  // Create the task
  const newTask = await Task.create(payload);

  // Add task to project's tasks array
  await Project.findByIdAndUpdate(
    payload.project,
    { $push: { tasks: newTask._id } },
    { new: true }
  );

  return { task: newTask, capacityWarning };
};

const updateTaskService = async (taskId: string, payload: Partial<ITask>) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTask;
};

const deleteTaskService = async (taskId: string) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  const projectId = task.project;

  // Remove task from project's tasks array
  await Project.findByIdAndUpdate(
    projectId,
    { $pull: { tasks: taskId } },
    { new: true }
  );

  // Delete the task
  await Task.findByIdAndDelete(taskId);

  return { message: "Task deleted successfully" };
};

const autoReassignTasksService = async (projectId: string, performedBy?: string) => {
  // Get the project with team
  const project = await Project.findById(projectId).populate("team");
  if (!project) {
    throw new Error("Project not found");
  }

  if (!project.team) {
    throw new Error("Project is not linked to a team");
  }

  const teamId = project.team as Types.ObjectId;

  // Get all team members with their current load
  const { members } = await getTeamMembersWithLoadService(projectId);

  // Get all tasks for this project that are not Done
  const allTasks = await Task.find({
    project: projectId,
    status: { $ne: "Done" },
    assignedMember: { $ne: "Unassigned" },
  }).populate("assignedMember");

  const reassignments: Array<{
    taskId: string;
    taskTitle: string;
    oldAssignee: { id: string; name: string };
    newAssignee: { id: string; name: string };
  }> = [];

  // Find members who are over capacity
  const overCapacityMembers = members.filter((m) => m.isOverCapacity);

  if (overCapacityMembers.length === 0) {
    return {
      message: "No members are over capacity. No reassignments needed.",
      reassignments: [],
    };
  }

  // Process each over-capacity member
  for (const overCapacityMember of overCapacityMembers) {
    const memberId = overCapacityMember._id.toString();
    const excessTasks = overCapacityMember.currentTasks - overCapacityMember.capacity;

    if (excessTasks <= 0) continue;

    // Get tasks assigned to this member (excluding High priority)
    const memberTasks = allTasks.filter(
      (task) =>
        task.assignedMember &&
        task.assignedMember.toString() === memberId &&
        task.priority !== TaskPriority.HIGH
    );

    // Sort tasks by priority (Low first, then Medium)
    const tasksToReassign = memberTasks
      .sort((a, b) => {
        if (a.priority === TaskPriority.LOW && b.priority === TaskPriority.MEDIUM) return -1;
        if (a.priority === TaskPriority.MEDIUM && b.priority === TaskPriority.LOW) return 1;
        return 0;
      })
      .slice(0, excessTasks);

    // Find members with available capacity
    const availableMembers = members
      .filter((m) => {
        const memberIdStr = m._id.toString();
        return (
          memberIdStr !== overCapacityMember._id.toString() &&
          m.currentTasks < m.capacity
        );
      })
      .sort((a, b) => {
        // Sort by available capacity (most available first)
        const aAvailable = a.capacity - a.currentTasks;
        const bAvailable = b.capacity - b.currentTasks;
        return bAvailable - aAvailable;
      });

    // Reassign tasks
    for (const task of tasksToReassign) {
      if (availableMembers.length === 0) {
        // No available members, can't reassign
        break;
      }

      // Find the best member for this task (member with most available capacity)
      const bestMemberIndex = 0;
      const bestMember = availableMembers[bestMemberIndex];
      const oldAssigneeId = task.assignedMember?.toString() || "";
      const oldAssignee = members.find((m) => m._id.toString() === oldAssigneeId);

      // Update task
      await Task.findByIdAndUpdate(task._id, {
        assignedMember: bestMember._id.toString(),
      });

      // Update member load counts in members array
      const oldAssigneeIndex = members.findIndex(
        (m) => m._id.toString() === oldAssigneeId
      );
      const newAssigneeIndex = members.findIndex(
        (m) => m._id.toString() === bestMember._id.toString()
      );

      if (oldAssigneeIndex !== -1) {
        members[oldAssigneeIndex].currentTasks--;
        members[oldAssigneeIndex].isOverCapacity =
          members[oldAssigneeIndex].currentTasks > members[oldAssigneeIndex].capacity;
      }

      if (newAssigneeIndex !== -1) {
        members[newAssigneeIndex].currentTasks++;
        members[newAssigneeIndex].isOverCapacity =
          members[newAssigneeIndex].currentTasks > members[newAssigneeIndex].capacity;
      }

      // Update the bestMember reference in availableMembers array
      bestMember.currentTasks++;
      bestMember.isOverCapacity = bestMember.currentTasks > bestMember.capacity;

      // Update available members list
      if (bestMember.isOverCapacity) {
        availableMembers.shift();
      } else {
        // Re-sort available members
        availableMembers.sort((a, b) => {
          const aAvailable = a.capacity - a.currentTasks;
          const bAvailable = b.capacity - b.currentTasks;
          return bAvailable - aAvailable;
        });
      }

      // Record reassignment
      reassignments.push({
        taskId: task._id.toString(),
        taskTitle: task.title,
        oldAssignee: {
          id: oldAssigneeId,
          name: oldAssignee?.name || "Unknown",
        },
        newAssignee: {
          id: bestMember._id.toString(),
          name: bestMember.name,
        },
      });

      // Create activity log
      await ActivityLog.create({
        type: ActivityType.TASK_AUTO_REASSIGNED,
        description: `Task "${task.title}" was automatically reassigned from ${oldAssignee?.name || "Unknown"} to ${bestMember.name} due to capacity constraints`,
        project: projectId,
        task: task._id,
        team: teamId,
        teamMember: bestMember._id,
        performedBy: performedBy ? new Types.ObjectId(performedBy) : undefined,
        metadata: {
          oldAssignee: {
            id: oldAssigneeId,
            name: oldAssignee?.name || "Unknown",
          },
          newAssignee: {
            id: bestMember._id.toString(),
            name: bestMember.name,
          },
          reason: "Auto reassignment due to capacity",
        },
      });
    }
  }

  return {
    message: `Successfully reassigned ${reassignments.length} task(s)`,
    reassignments,
  };
};

export const projectServices = {
  getProjectsService,
  createProjectService,
  updateProjectService,
  deleteProjectService,
  getTeamMembersWithLoadService,
  autoAssignMemberService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
  autoReassignTasksService,
};

