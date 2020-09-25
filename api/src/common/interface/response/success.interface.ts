import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

export interface SuccessResponse<C = any> {
  data: C | C[];
  pagination?: PaginationQueryDTO;
}
