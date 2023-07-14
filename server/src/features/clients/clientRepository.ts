import * as _nexus from "nexus";
import { prisma } from "../../config/prisma";

import { Client, Project } from "@prisma/client";

const getAllClients = async (): Promise<Client[]> =>
  await prisma.client.findMany();

const getClientById = async (clientId: string): Promise<Client | null> =>
  await prisma.client.findUnique({ where: { id: clientId } });

interface CreateClientSchema {
  name: string;
  email: string;
  phone: string;
}

const createClient = async (
  createClientInfo: CreateClientSchema
): Promise<Client> =>
  await prisma.client.create({ data: { ...createClientInfo } });

interface UpdateClientSchema {
  clientId: string;
  updateClientInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
}
const updateClient = async ({
  clientId,
  updateClientInfo,
}: UpdateClientSchema): Promise<Client> =>
  await prisma.client.update({
    where: { id: clientId },
    data: { ...updateClientInfo },
  });

const deleteClient = async (clientId: string): Promise<Client> =>
  await prisma.client.delete({ where: { id: clientId } });

const getProjectsByClientId = async (clientId: string): Promise<Project[]> =>
  await prisma.project.findMany({ where: { clientId } });

const ClientRepository = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getProjectsByClientId
};
