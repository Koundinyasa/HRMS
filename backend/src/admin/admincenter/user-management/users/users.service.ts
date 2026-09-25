// import {
//  Injectable,
//  BadRequestException,
// } from '@nestjs/common';

// import * as sql from 'mssql';

// import { DatabaseService } from '../../../database/database.service';

// @Injectable()
// export class UsersService {

// constructor(
//  private readonly dbService:DatabaseService,
// ){}

// // GET USERS

// async getUsers(
//  dto:any,
//  companyId:number,
// ){

// try{

// const pool =
// await this.dbService.getConnection();

// const request =
// pool.request()
// .input(
//  'CompanyID',
//  sql.Int,
//  companyId
// );

// if(dto.search){

// request.input(
//  'Search',
//  sql.VarChar(200),
//  dto.search
// );

// }

// request.input(
//  'Page',
//  sql.Int,
//  dto.page || 1
// );

// request.input(
//  'Limit',
//  sql.Int,
//  dto.limit || 10
// );

// const result =
// await request.execute(
//  'USP_GetUsers'
// );

// return {

// success:true,
// statusCode:200,
// message:'Users fetched successfully',
// data:result.recordset || []

// };

// }catch(error){

// throw new BadRequestException(
//  error.message
// );

// }

// }

// // CREATE USER

// async createUser(
// dto:any,
// createdBy:number,
// companyId:number,
// ){

// try{

// const pool =
// await this.dbService.getConnection();

// const result =
// await pool.request()

// .input(
// 'CompanyID',
// sql.Int,
// companyId
// )

// .input(
// 'EmployeeID',
// sql.Int,
// dto.employeeId
// )

// .input(
// 'RoleID',
// sql.Int,
// dto.roleId
// )

// .input(
// 'Email',
// sql.VarChar(100),
// dto.email
// )

// .input(
// 'Mobile',
// sql.VarChar(20),
// dto.mobile
// )

// .input(
// 'CreatedBy',
// sql.Int,
// createdBy
// )

// .execute(
// 'USP_AddUser'
// );

// return {

// success:true,
// statusCode:200,
// message:'User created successfully'

// };

// }catch(error){

// throw new BadRequestException(
// error.message
// );

// }

// }

// // GET USER DETAILS

// async getUserDetails(
// userId:number
// ){

// try{

// const pool =
// await this.dbService.getConnection();

// const result =
// await pool.request()

// .input(
// 'UserID',
// sql.Int,
// userId
// )

// .execute(
// 'USP_GetUserDetails'
// );

// return {

// success:true,
// statusCode:200,
// data:result.recordset

// };

// }catch(error){

// throw new BadRequestException(
// error.message
// );

// }

// }

// // UPDATE USER

// async updateUser(
// userId:number,
// dto:any,
// modifiedBy:number
// ){

// try{

// const pool =
// await this.dbService.getConnection();

// await pool.request()

// .input(
// 'UserID',
// sql.Int,
// userId
// )

// .input(
// 'RoleID',
// sql.Int,
// dto.roleId
// )

// .input(
// 'Email',
// sql.VarChar(100),
// dto.email
// )

// .input(
// 'Mobile',
// sql.VarChar(20),
// dto.mobile
// )

// .input(
// 'ModifiedBy',
// sql.Int,
// modifiedBy
// )

// .execute(
// 'USP_UpdateUser'
// );

// return {

// success:true,
// statusCode:200,
// message:'User updated successfully'

// };

// }catch(error){

// throw new BadRequestException(
// error.message
// );

// }

// }

// // UPDATE STATUS

// async updateStatus(
// userId:number,
// dto:any,
// modifiedBy:number
// ){

// try{

// const pool =
// await this.dbService.getConnection();

// await pool.request()

// .input(
// 'UserID',
// sql.Int,
// userId
// )

// .input(
// 'IsActive',
// sql.Bit,
// dto.isActive
// )

// .input(
// 'ModifiedBy',
// sql.Int,
// modifiedBy
// )

// .execute(
// 'USP_UpdateUserStatus'
// );

// return {

// success:true,
// statusCode:200,
// message:'User status updated successfully'

// };

// }catch(error){

// throw new BadRequestException(
// error.message
// );

// }

// }

// }
