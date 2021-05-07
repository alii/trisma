import { AbstractDeserializer } from "./AbstractDeserializer";
import { DMMF } from "@prisma/generator-helper";

export class Model extends AbstractDeserializer<DMMF.Model> {
  process(model: DMMF.Model): string {
    return `
      model ${model.name} {
        ${Model.handleFields(model.fields)}
        ${Model.handleCompoundUniqueFields(model.uniqueFields)}
        ${model.dbName ? `@@map("${model.dbName}")` : ""}
        ${model.idFields.length ? `@@id([${model.idFields.join(", ")}])` : ""}
      }
    `;
  }

  /**
   * Handle compound unique fields on a model
   * @param uniqueFields
   * @private
   */
  private static handleCompoundUniqueFields(uniqueFields: string[][]) {
    return uniqueFields.length > 0
      ? uniqueFields
          .map((eachUniqueField) => `@@unique([${eachUniqueField.join(", ")}])`)
          .join("\n")
      : "";
  }

  /**
   * Handles attributes for a field on a model
   * @param field
   * @private
   */
  private static handleFieldAttributes(field: DMMF.Field): string {
    const results: string[] = [];

    if (typeof field.default !== "undefined") {
      if (typeof field.default === "object" && field.default !== null) {
        results.push(`@default(${field.default.name}(${field.default.args}))`);
      } else if (typeof field.default === "string") {
        results.push(`@default("${field.default}")`);
      } else {
        results.push(`@default(${field.default})`);
      }
    }

    if (field.isId) {
      results.push("@id");
    }

    if (field.dbNames?.length) {
      results.push(`@map(${field.dbNames[0]})`);
    }

    if (field.isUnique) {
      results.push("@unique");
    }

    return results.join(" ");
  }

  /**
   * Handles & parses fields on a model
   * @param fields
   * @private
   */
  private static handleFields(fields: DMMF.Field[]): string {
    return fields
      .map((field) => {
        switch (field.kind) {
          case "scalar": {
            return `${field.name} ${field.type}${field.isList ? "[]" : ""}${
              !field.isRequired ? "?" : ""
            } ${Model.handleFieldAttributes(field)}`;
          }

          default:
            throw new Error(`Unsupported field type ${field.kind}.`);
        }
      })
      .join("\n");
  }
}
