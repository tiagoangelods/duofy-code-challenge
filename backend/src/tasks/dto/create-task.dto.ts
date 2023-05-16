import { List } from '../../lists/list.schema';

export class CreateTaskDto {
  title: string;
  dueDate: string;
  priority: number;
  list: List;
  order: number;
}
