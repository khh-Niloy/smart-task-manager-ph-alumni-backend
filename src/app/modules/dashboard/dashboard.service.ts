import { Project, Task } from "../project/project.model";
import { Team, TeamMember } from "../team/team.model";
import { ActivityLog } from "../activity/activity.model";
import { ActivityType } from "../activity/activity.interface";
import { Types } from "mongoose";

const getDashboardDataService = async (userId?: string) => {
  // Get total projects count
  const totalProjects = await Project.countDocuments();

  // Get total tasks count (excluding Done tasks)
  const totalTasks = await Task.countDocuments({ status: { $ne: "Done" } });

  // Get all teams
  const teams = await Team.find().populate("members").populate("createdBy", "name");

  // Get team summary with member load
  const teamSummary = await Promise.all(
    teams.map(async (team) => {
      const teamMembers = await TeamMember.find({ team: team._id });

      const membersWithLoad = await Promise.all(
        teamMembers.map(async (member) => {
          const memberId = member._id.toString();
          // Count all tasks assigned to this member (excluding "Done" status)
          const currentTasks = await Task.countDocuments({
            assignedMember: memberId,
            status: { $ne: "Done" },
          });

          const isOverloaded = currentTasks > member.capacity;

          return {
            _id: member._id,
            name: member.name,
            role: member.role,
            capacity: member.capacity,
            currentTasks,
            isOverloaded,
            loadPercentage:
              member.capacity > 0 ? (currentTasks / member.capacity) * 100 : 0,
          };
        })
      );

      // Get projects linked to this team
      const teamProjects = await Project.find({ team: team._id }).select("_id name");

      return {
        _id: team._id,
        name: team.name,
        createdBy: (team.createdBy as any)?.name || "Unknown",
        members: membersWithLoad,
        projects: teamProjects,
        totalMembers: membersWithLoad.length,
        overloadedMembers: membersWithLoad.filter((m) => m.isOverloaded).length,
      };
    })
  );

  // Get recent reassignments (last 5)
  const recentReassignments = await ActivityLog.find({
    type: ActivityType.TASK_AUTO_REASSIGNED,
  })
    .populate("task", "title")
    .populate("project", "name")
    .populate("teamMember", "name")
    .sort({ createdAt: -1 })
    .limit(5)
    .select("description metadata task project teamMember createdAt");

  // Format recent reassignments
  const formattedReassignments = recentReassignments.map((log) => ({
    _id: log._id,
    taskTitle: (log.task as any)?.title || "Unknown Task",
    projectName: (log.project as any)?.name || "Unknown Project",
    newAssignee: (log.teamMember as any)?.name || "Unknown",
    oldAssignee: log.metadata?.oldAssignee?.name || "Unknown",
    reassignedAt: log.createdAt,
    description: log.description,
  }));

  return {
    totalProjects,
    totalTasks,
    teamSummary,
    recentReassignments: formattedReassignments,
  };
};

export const dashboardServices = {
  getDashboardDataService,
};

