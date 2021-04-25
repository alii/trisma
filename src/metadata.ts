import { MetadataKeys } from "./decorators";
import { DMMF } from "@prisma/generator-helper";

export function parseModel(model: Object): DMMF.Model {
  const name = Reflect.getMetadata(MetadataKeys.MODEL_NAME, model) as string;
  const fieldNames = Reflect.getMetadata(
    MetadataKeys.FIELDS,
    model
  ) as string[];

  const fields = fieldNames.map(
    (field): DMMF.Field => {
      const type = Reflect.getMetadata(
        "design:type",
        // @ts-ignore It does exist
        model.prototype,
        field
      ) as Function;

      const nullable = Reflect.getMetadata(MetadataKeys.NULLABLE, model, field);

      const defaultValue = Reflect.getMetadata(
        MetadataKeys.DEFAULT_VALUE,
        model,
        field
      );

      const documentation = Reflect.getMetadata(
        MetadataKeys.DOCUMENTATION,
        model,
        field
      );

      const isId = !!Reflect.getMetadata(MetadataKeys.ID, model, field);
      const isUnique = !!Reflect.getMetadata(MetadataKeys.UNIQUE, model, field);

      const fieldType =
        type.name === "Array"
          ? (Reflect.getMetadata(
              MetadataKeys.ARRAY_TYPE,
              model,
              field
            ) as Function)
          : type;

      return {
        isId,
        isUnique,
        name: field,
        isGenerated: false,
        type: fieldType.name === "Number" ? "Int" : fieldType.name,
        isRequired: !nullable,
        kind: "scalar",
        isList: type.name === "Array",
        default: defaultValue ?? null,
        hasDefaultValue: typeof defaultValue !== "undefined",
        documentation: documentation ?? null,
      };
    }
  );

  return {
    name,
    fields: fields as DMMF.Field[],
    uniqueFields: [],
    uniqueIndexes: [],
    isEmbedded: false,
    dbName: name,
    idFields: [],
  };
}
