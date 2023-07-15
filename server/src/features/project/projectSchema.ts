import * as _nexus from "nexus";
import { ProjectRepository } from "./projectRepository";
import { Project } from "@prisma/client";
import { ClientRepository } from "../clients/clientRepository";

export const ProjectStatus = _nexus.enumType({
  name: "ProjectStatus",
  members: {
    NOT_STARTED: "NOT_STARTED",
    STARTED: "STARTED",
    COMPLETED: "COMPLETED",
  },
});

export const ProjectType = _nexus.objectType({
  name: "Project",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.field("status", { type: ProjectStatus });
    t.nonNull.field("client", {
      type: "Client",
      resolve: async (parent: Project) =>
        await ClientRepository.getClientById(parent.clientId),
    });
    t.nonNull.field("createdAt", { type: "DateTime" });
    t.nonNull.field("updatedAt", { type: "DateTime" });
  },
});

export const ProjectQuery = _nexus.extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("getAllProjects", {
      type: ProjectType,
      resolve: async () => await ProjectRepository.getAllProjects(),
    });
    t.nonNull.field("getProjectsById", {
      type: ProjectType,
      args: { projectId: _nexus.nonNull(_nexus.stringArg()) },
      resolve: async (parent, args) =>
        await ProjectRepository.getProjectById(args.projectId),
    });
  },
});

export const CreateProjectInput = _nexus.inputObjectType({
  name: "CreateProjectInput",
  definition(t) {
    t.nonNull.id("clientId");

    t.nonNull.string("name");
    t.nonNull.string("description");
  },
});

export const UpdateProjectInput = _nexus.inputObjectType({
  name: "UpdateProjectInput",
  definition(t) {
    t.nonNull.id("projectId");

    t.string("name");
    t.string("description");
  },
});

export const ProjectMutation = _nexus.extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createProject", {
      type: ProjectType,
      args: {
        createProjectArgs: _nexus.arg({ type: CreateProjectInput }),
      },
      resolve: async (parent, args) =>
        await ProjectRepository.createProject({
          clientId: args.createProjectArgs.clientId,
          createProjectArgs: { ...args.createProjectArgs },
        }),
    });

    t.nonNull.field("updateProject", {
      type: ProjectType,
      args: {
        updateProjectArgs: _nexus.arg({ type: UpdateProjectInput }),
      },
      resolve: async (parent, args) =>
        await ProjectRepository.updateProject({
          projectId: args.updateProjectArgs.projectId,
          updateProjectArgs: { ...args.updateProjectArgs },
        }),
    });

    t.nonNull.field("deleteProject", {
      type: ProjectType,
      args: { projectId: _nexus.nonNull(_nexus.stringArg()) },
      resolve: async (parent, args) =>
        await ProjectRepository.deleteProject(args.projectId),
    });
  },
});
