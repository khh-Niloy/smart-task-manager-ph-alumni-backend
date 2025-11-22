import { Team, TeamMember } from "./team.model";
import { ITeam, ITeamMember } from "./team.interface";

// Team Services
const getAllTeamsService = async () => {
  const teams = await Team.find().populate("members").populate("createdBy", "name email");
  return teams;
};

const createTeamService = async (payload: Partial<ITeam>) => {
  const newTeam = await Team.create(payload);
  return newTeam;
};

const updateTeamService = async (teamId: string, payload: Partial<ITeam>) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  const updatedTeam = await Team.findByIdAndUpdate(teamId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTeam;
};

const deleteTeamService = async (teamId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  // Delete all team members associated with this team
  await TeamMember.deleteMany({ team: teamId });

  // Delete the team
  await Team.findByIdAndDelete(teamId);

  return { message: "Team and associated members deleted successfully" };
};

// Team Member Services
const createTeamMemberService = async (payload: Partial<ITeamMember>) => {
  // Verify that the team exists
  const team = await Team.findById(payload.team);
  if (!team) {
    throw new Error("Team not found");
  }

  // Create the team member
  const newTeamMember = await TeamMember.create(payload);

  // Add team member to team's members array
  await Team.findByIdAndUpdate(
    payload.team,
    { $push: { members: newTeamMember._id } },
    { new: true }
  );

  return newTeamMember;
};

const updateTeamMemberService = async (
  memberId: string,
  payload: Partial<ITeamMember>
) => {
  const teamMember = await TeamMember.findById(memberId);
  if (!teamMember) {
    throw new Error("Team member not found");
  }

  const updatedTeamMember = await TeamMember.findByIdAndUpdate(
    memberId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedTeamMember;
};

const deleteTeamMemberService = async (memberId: string) => {
  const teamMember = await TeamMember.findById(memberId);
  if (!teamMember) {
    throw new Error("Team member not found");
  }

  const teamId = teamMember.team;

  // Remove team member from team's members array
  await Team.findByIdAndUpdate(
    teamId,
    { $pull: { members: memberId } },
    { new: true }
  );

  // Delete the team member
  await TeamMember.findByIdAndDelete(memberId);

  return { message: "Team member deleted successfully" };
};

export const teamServices = {
  getAllTeamsService,
  createTeamService,
  updateTeamService,
  deleteTeamService,
  createTeamMemberService,
  updateTeamMemberService,
  deleteTeamMemberService,
};

