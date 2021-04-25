import { __LIST, MetadataKeys } from "./decorators";
import { DMMF } from "@prisma/generator-helper";

export function parseModel(model: Object): DMMF.Model {
  const name = Reflect.getMetadata(MetadataKeys.MODEL_NAME, model) as string;

  const classDocumentation = Reflect.getMetadata(
    MetadataKeys.CLASS_DOCUMENTATION,
    model
  ) as string | undefined;

  const fieldNames = Reflect.getMetadata(
    MetadataKeys.FIELDS,
    model
  ) as string[];

  const fields = fieldNames.map(
    (field): DMMF.Field => {
      const type =
        (Reflect.getMetadata(MetadataKeys.FIELD_TYPE, model, field) as
          | string
          | undefined) ??
        (Reflect.getMetadata(
          "design:type",
          // @ts-ignore It does exist
          model.prototype,
          field
        ) as Function).name;

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
        type === __LIST
          ? (Reflect.getMetadata(
              MetadataKeys.ARRAY_TYPE,
              model,
              field
            ) as Function).name
          : type;

      const isUpdatedAt = !!Reflect.getMetadata(
        MetadataKeys.IS_UPDATED_AT,
        model,
        field
      );

      return {
        isId,
        isUnique,
        isUpdatedAt,
        name: field,
        isGenerated: false,
        type: fieldType,
        isRequired: !nullable,
        kind: "scalar",
        isList: type === "Array",
        default: defaultValue ?? null,
        hasDefaultValue: typeof defaultValue !== "undefined",
        documentation: documentation ?? null,
      };
    }
  );

  return {
    name,
    fields,
    documentation: classDocumentation,
    uniqueFields: [],
    uniqueIndexes: [],
    isEmbedded: false,
    dbName: name,
    idFields: [],
  };
}
