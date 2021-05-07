import { DMMF } from "@prisma/generator-helper";
import * as transformer from "prisma-schema-transformer";
import { deserialize } from "./deserializers";

export async function generateSchema(datamodel: DMMF.Datamodel) {
  const models = datamodel.models.map(deserialize);
  const enums = await transformer.dmmfEnumsDeserializer(datamodel.enums);

  return `
    ${models} 
    ${enums}
  `;
}
