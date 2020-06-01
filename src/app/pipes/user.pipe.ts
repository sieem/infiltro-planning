import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  public constructor(private userService: UserService) { }

  transform(value: string): Promise<string> {
    return this.userService.userToName(value)
  }


}
