import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type TUserDecorator = {
  id: number;
  nickname: string;
};

export const CurrentUser = createParamDecorator(
  (data: keyof TUserDecorator, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Record<'user', TUserDecorator>>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
