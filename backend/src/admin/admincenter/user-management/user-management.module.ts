import { Module } from '@nestjs/common';

//import { RolesModule } from './roles/roles.module';
//import { RoleAccessModule } from './role-access/role-access.module';
import { EmployeesModule } from './employees/employees.module';
//import { UsersModule } from './users/users.module';

@Module({
  imports: [
    //RolesModule,
    //RoleAccessModule,
    EmployeesModule,
    //UsersModule,
  ],
})
export class UserManagementModule {}