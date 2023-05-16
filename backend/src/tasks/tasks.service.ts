import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { List } from '../lists/list.schema';
import { Task } from './task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(List.name) private listModel: Model<List>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    try {
      const list = await this.listModel.findById(createTaskDto.list);
      if (list.id === createTaskDto.list) {
        const task = new this.taskModel(createTaskDto);
        await task.save();
        return {
          status: HttpStatus.OK,
          message: 'created',
          id: task.id,
        };
      }
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "List doesn't exists",
        },
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Not created',
          error,
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
      return await this.taskModel.find().exec();
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

  async findOne(id: number) {
    try {
      return await this.taskModel.findById(id).exec();
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

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      if (updateTaskDto.list) {
        const list = await this.listModel.findById(updateTaskDto.list);
        if (!list) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: "List doesn't exists",
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      await this.taskModel.findByIdAndUpdate(id, updateTaskDto).exec();
      const task = await this.taskModel.findById(id).exec();
      return {
        status: HttpStatus.OK,
        message: 'updated',
        task,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
          message: 'Update error',
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
      await this.taskModel.findByIdAndDelete(id);
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
