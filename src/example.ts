import {
  Array,
  Default,
  Documentation,
  Field,
  ID,
  Model,
  Nullable,
} from "./decorators";

@Model()
export class Example {
  @ID()
  @Field()
  @Documentation("This is the ID of the row")
  id!: string;

  @Field()
  @Nullable()
  @Array(String)
  names?: string[];

  @Field()
  @Default(0)
  count!: number;
}
