import { DMMF } from "@prisma/generator-helper";
import * as sdk from "@prisma/sdk";
import * as transformer from "prisma-schema-transformer";

export async function generateDMMF(datamodel: DMMF.Datamodel) {
  const models = await transformer.dmmfModelsdeserializer(datamodel.models);
  const enums = await transformer.dmmfEnumsDeserializer(datamodel.enums);

  console.log(`
      ${models} 
      ${enums}
    `);

  return sdk.getDMMF({
    datamodel: `
      ${models} 
      ${enums}
    `,
  });
}

// void generateDMMF({
//   enums: [],
//   models: [
//     {
//       name: "Balls",
//       isEmbedded: false,
//       dbName: null,
//       fields: [
//         {
//           name: "id",
//           isId: true,
//           type: "Boolean",
//           isRequired: true,
//           isUnique: false,
//           isGenerated: false,
//           isList: false,
//           kind: "scalar",
//           hasDefaultValue: false,
//         },
//       ],
//       uniqueFields: [],
//       uniqueIndexes: [],
//       idFields: [],
//     },
//   ],
// }).then(console.log);
//
