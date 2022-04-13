import { IsEnum, IsOptional } from "class-validator";
import { Roles } from "../enums/role.enum";

export class UpdateUserRoleDto {

    @IsEnum(Roles)
    @IsOptional()
    role:Roles
 
}
