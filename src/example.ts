import {
  Array,
  Default,
  Documentation,
  Field,
  ID,
  Model,
  Nullable,
  Unique,
} from "./decorators";

@Model()
export class Example {
  @ID()
  @Field()
  @Documentation("This is the ID of the row")
  @Default("now()")
  id!: string;

  @Field()
  @Nullable()
  @Array(String)
  names?: string[];

  @Field()
  @Default(0)
  @Unique()
  count!: number;
}
