import { MetadataKeys } from "./decorators";

export function parseModel(model: Object) {
  const name = Reflect.getMetadata(MetadataKeys.MODEL_NAME, model) as string;
  const fieldNames = Reflect.getMetadata(
    MetadataKeys.FIELDS,
    model
  ) as string[];

  const fields = fieldNames.map((field) => {
    const type = Reflect.getMetadata(
      "design:type",
      // @ts-ignore It does exist
      model.prototype,
      field
    ) as Function;

    return { name: field, type: type.name };
  });

  return { name, fields };
}
