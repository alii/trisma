import { DMMF } from "@prisma/generator-helper";
import * as transformer from "prisma-schema-transformer";

export async function generateSchema(datamodel: DMMF.Datamodel) {
  const models = await transformer.dmmfModelsdeserializer(datamodel.models);
  const enums = await transformer.dmmfEnumsDeserializer(datamodel.enums);

  return `
    ${models} 
    ${enums}
  `;
}
