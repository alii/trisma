import { Field, Model } from "./decorators";

@Model()
export class Example {
  @Field()
  id!: string;
}
