import * as _nexus from "nexus";
import { Client } from "@prisma/client";
import { GraphQLError } from "graphql";

import { ClientRepository } from "./clientRepository";

export const ClientType = _nexus.objectType({
  name: "Client",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("phone");
    t.nonNull.list.nonNull.field("projects", {
      type: "Project",
      resolve: async (parent: Client) =>
        await ClientRepository.getProjectsByClientId(parent.id),
    });

    t.nonNull.field("createdAt", { type: "DateTime" });
    t.nonNull.field("updatedAt", { type: "DateTime" });
  },
});

export const ClientQuery = _nexus.extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("getAllClients", {
      type: ClientType,
      resolve: async () => await ClientRepository.getAllClients(),
    });
    t.nullable.field("getClientById", {
      type: ClientType,
      args: {
        clientId: _nexus.nonNull(_nexus.stringArg()),
      },
      resolve: async (parent, args) => {
        const client = await ClientRepository.getClientById(args.clientId);
        if (!client) {
          throw new GraphQLError(`Client With Id: ${args.clientId} not Found`);
        }
        return client;
      },
    });
  },
});

//Mutation Begins

export const CreateClientArg = _nexus.inputObjectType({
  name: "CreateClientArg",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("phone");
  },
});

export const UpdateClientArg = _nexus.inputObjectType({
  name: "UpdateClientArg",
  definition(t) {
    t.nonNull.id("clientId");
    t.string("name");
    t.string("email");
    t.string("phone");
  },
});

export const ClientMutation = _nexus.extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createClient", {
      type: ClientType,
      args: { createClientArgs: _nexus.arg({ type: CreateClientArg }) },
      resolve: async (parent, args) =>
        await ClientRepository.createClient({ ...args.createClientArgs }),
    });
    t.nonNull.field("updateClient", {
      type: ClientType,
      args: { updateClientArg: _nexus.arg({ type: UpdateClientArg }) },
      resolve: async (parent, args) =>
        await ClientRepository.updateClient({
          clientId: args.updateClientArg.clientId,
          ...args.updateClientArg,
        }),
    });
    t.nonNull.field("deleteClient", {
      type: ClientType,
      args: {
        clientId: _nexus.nonNull(_nexus.stringArg()),
      },
      resolve: async (parent, args) =>
        ClientRepository.deleteClient(args.clientId),
    });
  },
});
