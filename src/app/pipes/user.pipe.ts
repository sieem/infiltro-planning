import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';
import { firstValueFrom } from 'rxjs';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  public constructor(private userService: UserService) { }

  async transform(value: string): Promise<string> {
    return await firstValueFrom(this.userService.userToName(value));
  }


}
