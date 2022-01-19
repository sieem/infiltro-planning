import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';
import { first } from 'rxjs/operators';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  public constructor(private userService: UserService) { }

  async transform(value: string): Promise<string> {
    return await this.userService.userToName(value).pipe(first()).toPromise();
  }


}
