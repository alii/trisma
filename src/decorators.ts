import "reflect-metadata";

export const enum MetadataKeys {
  RELATION = "prisma:relation",
  MODEL_NAME = "prisma:model-name",
  FIELDS = "prisma:fields",
}

function getFieldNames(target: Object): string[] {
  return Reflect.getMetadata(MetadataKeys.FIELDS, target) || [];
}

/**
 * Defines a new model to be loaded by prisma
 * @param name The name of the model. This is entirely optional
 * @constructor
 */
export function Model(name?: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      MetadataKeys.MODEL_NAME,
      name || target.name,
      target
    );
  };
}

export function Field(): PropertyDecorator {
  return (target, property) => {
    const existingFields = getFieldNames(target);

    Reflect.defineMetadata(
      MetadataKeys.FIELDS,
      [...existingFields, property],
      target.constructor
    );
  };
}

export function Relation(
  property: string,
  on: string,
  name?: string
): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(
      MetadataKeys.RELATION,
      { on, name, property },
      target,
      property
    );
  };
}
