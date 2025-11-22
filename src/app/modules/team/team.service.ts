import { Team, TeamMember } from "./team.model";
import { ITeam, ITeamMember } from "./team.interface";

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

  await TeamMember.deleteMany({ team: teamId });

  await Team.findByIdAndDelete(teamId);

  return { message: "Team and associated members deleted successfully" };
};

const createTeamMemberService = async (payload: Partial<ITeamMember>) => {
  const team = await Team.findById(payload.team);
  if (!team) {
    throw new Error("Team not found");
  }

  const newTeamMember = await TeamMember.create(payload);

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

  await Team.findByIdAndUpdate(
    teamId,
    { $pull: { members: memberId } },
    { new: true }
  );

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

