import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateCandidateByGoogleSheetInput {

    @Field()
    @IsNotEmpty()
    sheetId : string

    @Field({nullable:true})
    teamName : string
}