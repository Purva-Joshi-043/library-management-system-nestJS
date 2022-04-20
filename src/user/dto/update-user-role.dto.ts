import { IsEnum, IsOptional } from "class-validator";
import { Roles } from "../../auth/enums/role.enum";

export class UpdateUserRoleDto {

    @IsEnum(Roles)
    @IsOptional()
    role:Roles
 
}
