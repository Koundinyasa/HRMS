// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//   ) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean {
//     const request =
//       context.switchToHttp().getRequest();

//     const authHeader =
//       request.headers.authorization;

//     if (!authHeader) {
//       throw new UnauthorizedException(
//         'Token missing',
//       );
//     }

//     if (!authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException(
//         'Invalid auth format',
//       );
//     }

//     const token =
//       authHeader.split(' ')[1];

//     if (
//       !token ||
//       token === 'undefined' ||
//       token === 'null'
//     ) {
//       throw new UnauthorizedException(
//         'Invalid token',
//       );
//     }

//     try {
//       const payload =
//         this.jwtService.verify(token);

//       request.user = payload;

//       return true;
//     } catch {
//       throw new UnauthorizedException(
//         'Invalid or expired token',
//       );
//     }
//   }
// }


// //Cookie storage
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // READ TOKEN FROM COOKIE
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    if (token === 'undefined' || token === 'null') {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const payload = this.jwtService.verify(token);

      request.user = payload; 

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}