import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


//Добавляем проверку аутентификации
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}

//Теперь её можно использовать в контроллерах,
// например, не давать доступ к профилю,
// если пользователь не аутентифицирован.