import { DMMF } from "@prisma/generator-helper";
import * as sdk from "@prisma/sdk";
import * as transformer from "prisma-schema-transformer";

export async function generateDMMF(datamodel: DMMF.Datamodel) {
  const models = await transformer.dmmfModelsdeserializer(datamodel.models);
  const enums = await transformer.dmmfEnumsDeserializer(datamodel.enums);

  return sdk.getDMMF({
    datamodel: `
      ${models} 
      ${enums}
    `,
  });
}
