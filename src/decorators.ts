import "reflect-metadata";

/**
 * A constant for identifying list types
 */
export const __LIST = "__list";

/**
 * A list of Reflection metadata key names
 * @enum
 */
export const enum MetadataKeys {
  RELATION = "prisma:relation",
  MODEL_CLASS_NAME = "prisma:model-class-name",
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

/**
 * Gets a list of set field names from Reflection for this class (object)
 * @internal
 * @param target
 */
function getFieldNames(target: Object): string[] {
  return Reflect.getMetadata(MetadataKeys.FIELDS, target.constructor) || [];
}

/**
 * Add documentation to this field
 * @param value The documentation for this field
 */
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

/**
 * Marks this field as unique
 */
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

/**
 * Mark this field as an ID field
 */
export function ID(): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(MetadataKeys.ID, true, target.constructor, property);
  };
}

/**
 * Set the default value for this field
 * @param value
 */
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

/**
 * Mark the type of an array. Right now, TypeScript decorators cannot
 * get the type of an array at runtime, so this is needed.
 * @param type The primitive type of the array (String, Number, etc)
 */
export function Array(type: Function | string): PropertyDecorator {
  return (target, property) => {
    Reflect.defineMetadata(
      MetadataKeys.ARRAY_TYPE,
      type,
      target.constructor,
      property
    );
  };
}

/**
 * Mark a field as nullable. If you have `strictNullChecks` enabled, also set `?` on your field type.
 */
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
 */
export function Model(name?: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MetadataKeys.MODEL_CLASS_NAME, target.name, target);

    Reflect.defineMetadata(
      MetadataKeys.MODEL_NAME,
      name || target.name,
      target
    );
  };
}

/**
 * Set documentation on this model
 * @param documentation The documentation for this model
 */
export function ModelDocumentation(documentation: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      MetadataKeys.CLASS_DOCUMENTATION,
      documentation,
      target
    );
  };
}

/**
 * Mark a date field as a `@updatedAt`.
 */
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

/**
 * Mark this property as a working field
 * @param type An optional type for this field. This can be inferred most of the time through TypeScript.
 */
export function Field(type?: string | Function): PropertyDecorator {
  return (target, property) => {
    const existingFields = getFieldNames(target);

    const decidedType = (() => {
      const design = Reflect.getMetadata(
        "design:type",
        target,
        property
      ) as Function;

      const map = {
        Number: "Int",
        Boolean: "Boolean",
        // Arrays are an exception in Prisma. The type is primitive,
        // but the field has an isList property.
        Array: __LIST,
        String: "String",
        BigInt: "BigInt",
        Date: "DateTime",
      } as const;

      const key = type
        ? type instanceof Function
          ? type.name
          : type
        : design.name;

      const typeName = map[key as keyof typeof map] as string | undefined;

      if (!typeName) {
        throw new Error(`No type could be inferred for ${property.toString()}`);
      }

      return typeName;
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
