import { Job } from '@app/domain/entities/job.model';

export class JobResponseDto
  implements
    Pick<
      Job,
      | 'id'
      | 'description'
      | 'price'
      | 'paid'
      | 'contractId'
      | 'createdAt'
      | 'updatedAt'
    >
{
  id: string;
  description: string;
  price: number;
  contractId: string;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
}
