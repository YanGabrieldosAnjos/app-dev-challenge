import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'create a user',
  })
  @Post()
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }
}
