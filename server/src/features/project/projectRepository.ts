import * as _nexus from "nexus";
import { prisma } from "../../config/prisma";

import { Project } from "@prisma/client";

const getAllProjects = async (): Promise<Project[]> =>
  await prisma.project.findMany();

const getProjectById = async (projectId: string): Promise<Project | null> =>
  await prisma.project.findUnique({ where: { id: projectId } });

interface CreateProjectSchema {
  clientId: string;
  createProjectArgs: {
    name: string;
    description: string;
  };
}

const createProject = async ({
  clientId,
  createProjectArgs,
}: CreateProjectSchema): Promise<Project> =>
  await prisma.project.create({ data: { ...createProjectArgs, clientId } });

enum ProjectStatus {
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  COMPLETED = "COMPLETED",
}

interface UpdateProjectSchema {
  projectId: string;
  updateProjectArgs: {
    name?: string;
    description?: string;
    status?: ProjectStatus;
  };
}
const updateProject = async ({
  projectId,
  updateProjectArgs,
}: UpdateProjectSchema): Promise<Project> =>
  await prisma.project.update({
    where: { id: projectId },
    data: { ...updateProjectArgs },
  });

const deleteProject = async (projectId: string): Promise<Project> =>
  await prisma.project.delete({ where: { id: projectId } });

const ProjectRepository = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
