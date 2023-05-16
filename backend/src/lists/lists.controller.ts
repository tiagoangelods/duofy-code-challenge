import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  async create(@Body() createListDto: CreateListDto) {
    return await this.listsService.create(createListDto);
  }

  @Get()
  async findAll() {
    return await this.listsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.listsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return await this.listsService.update(id, updateListDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.listsService.remove(id);
  }
}
