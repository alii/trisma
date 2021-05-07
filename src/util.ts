import { MetadataKeys } from "./decorators";

/**
 * Works out if the class passed is a Prisma model
 * @param target
 */
export function isModel(target: Object): boolean {
  return !!Reflect.getMetadata(MetadataKeys.MODEL_NAME, target);
}
