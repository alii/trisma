import { DMMF } from "@prisma/generator-helper";
import { deserialize } from "./deserializers";
import { formatSchema } from "@prisma/sdk";

export async function generateSchema(
  datamodel: DMMF.Datamodel
): Promise<string> {
  const models = datamodel.models.map(deserialize);
  // const enums = await transformer.dmmfEnumsDeserializer(datamodel.enums);

  // return format(`
  //   ${models}
  //   ${enums}
  // `);

  return formatSchema({
    schema: `
      ${models}
    `,
  });
}
