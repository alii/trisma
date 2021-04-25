import "reflect-metadata";

export const __LIST = "__list";

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
  FIELD_TYPE = "prisma:field:type",
  IS_UPDATED_AT = "prisma:field:is-updated-at",
  CLASS_DOCUMENTATION = "prisma:class:documentation",
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

export function ModelDocumentation(documentation: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      MetadataKeys.CLASS_DOCUMENTATION,
      documentation,
      target
    );
  };
}

export function UpdatedAt(): PropertyDecorator {
  return (target, property) => {
    const design = Reflect.getMetadata(
      "design:type",
      target,
      property
    ) as Function;

    if (design.name !== "Date") {
      throw new Error(
        `You must use @UpdatedAt on a Date only. You used a ${design.name} on ${
          target.constructor.name
        }.${property.toString()}`
      );
    }

    Reflect.defineMetadata(
      MetadataKeys.IS_UPDATED_AT,
      true,
      target.constructor,
      property
    );
  };
}

export function Field(type?: string | Function): PropertyDecorator {
  return (target, property) => {
    const existingFields = getFieldNames(target);

    const decidedType = (() => {
      const design = Reflect.getMetadata(
        "design:type",
        target,
        property
      ) as Function;

      switch (
        type ? (type instanceof Function ? type.name : type) : design.name
      ) {
        case "Number":
          return "Int";

        case "Boolean":
          return "Boolean";

        case "Array":
          return __LIST;

        case "String":
          return "String";

        case "BigInt":
          return "BigInt";

        case "Date":
          return "DateTime";

        default:
          throw new Error(
            `No type could be inferred for ${property.toString()}`
          );
      }
    })();

    Reflect.defineMetadata(
      MetadataKeys.FIELD_TYPE,
      decidedType,
      target.constructor,
      property
    );

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
