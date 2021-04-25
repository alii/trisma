import "reflect-metadata";

export const enum MetadataKeys {
  RELATION = "prisma:relation",
  MODEL_NAME = "prisma:model-name",
  FIELDS = "prisma:fields",
  NULLABLE = "prisma:field:nullable",
  DEFAULT_VALUE = "prisma:field:default-value",
  ARRAY_TYPE = "prisma:field:array-type",
  DOCUMENTATION = "prisma:field:documentation",
  ID = "prisma:field:id",
  UNIQUE = "prisma:field:unique",
}

function getFieldNames(target: Object): string[] {
  return Reflect.getMetadata(MetadataKeys.FIELDS, target.constructor) || [];
}

export function Documentation(value: string): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(
      MetadataKeys.DOCUMENTATION,
      value,
      target.constructor,
      property
    );
  };
}

export function Unique(): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(
      MetadataKeys.UNIQUE,
      true,
      target.constructor,
      property
    );
  };
}

export function ID(): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(MetadataKeys.ID, true, target.constructor, property);
  };
}

export function Default<T>(value: T): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(
      MetadataKeys.DEFAULT_VALUE,
      value,
      target.constructor,
      property
    );
  };
}

export function Array(type: Function): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(
      MetadataKeys.ARRAY_TYPE,
      type,
      target.constructor,
      property
    );
  };
}

export function Nullable(): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(
      MetadataKeys.NULLABLE,
      true,
      target.constructor,
      property
    );
  };
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
