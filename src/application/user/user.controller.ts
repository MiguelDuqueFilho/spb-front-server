import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  @ApiOperation({ summary: 'Get owner user' })
  @ApiOkResponse()
  @ApiForbiddenResponse({
    status: 401,
    description: 'unauthorized',
  })
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
