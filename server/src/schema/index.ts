import { makeSchema } from "nexus";
import * as _nexus from "nexus";
import { DateTimeResolver } from "graphql-scalars";

const DateTime = _nexus.asNexusMethod(DateTimeResolver, "date");

import * as ClientSchema from "../features/clients/clientSchema";
import * as ProjectSchema from "../features/project/projectSchema";

export const schema = makeSchema({
  types: {
    ...ClientSchema,
    ...ProjectSchema,
    DateTime,
  },
  outputs: {
    schema: __dirname+"/../generated/schema.graphql",
    typegen: __dirname+"/../generated/nexus.ts"
  }
});
