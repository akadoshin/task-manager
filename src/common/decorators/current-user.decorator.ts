import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type TUserDecorator = {
  id: number;
  nickname: string;
};

export const CurrentUser = createParamDecorator(
  (data: keyof TUserDecorator, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: TUserDecorator = request.user;

    return data ? user?.[data] : user;
  },
);
