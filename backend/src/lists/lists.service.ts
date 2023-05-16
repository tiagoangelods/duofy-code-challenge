import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectModel } from '@nestjs/mongoose';
import { List } from './list.schema';
import { Task } from '../tasks/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(List.name) private listModel: Model<List>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async create(createListDto: CreateListDto) {
    try {
      const list = new this.listModel(createListDto);
      await list.save();
      return {
        status: HttpStatus.OK,
        message: 'created',
        id: list.id,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Not created',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async findAll() {
    try {
      return await this.listModel.find().exec();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Get error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.listModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Get error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async update(id: string, updateListDto: UpdateListDto) {
    try {
      await this.listModel.findByIdAndUpdate(id, updateListDto).exec();
      const list = await this.listModel.findById(id).exec();
      return {
        status: HttpStatus.OK,
        message: 'updated',
        list,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Update error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }

  async remove(id: string) {
    try {
      await this.taskModel.deleteMany({ list: id });
      await this.listModel.findByIdAndDelete(id);
      return {
        status: HttpStatus.OK,
        message: 'deleted',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Delete error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
