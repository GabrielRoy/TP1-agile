import type Response from '@/scripts/response'

export default interface Question {
    id: number;
    userId: number;
    title: string;
    content: string;
    tag: string;
    isHidden: boolean;
    responses: Response[]
  } 