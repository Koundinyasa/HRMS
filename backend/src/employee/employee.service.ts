import {Injectable,UnauthorizedException,NotFoundException,BadRequestException,ForbiddenException} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';



@Injectable()
export class EmployeeService {
  constructor(
    private readonly dbService: DatabaseService,
  ) {}
 
}