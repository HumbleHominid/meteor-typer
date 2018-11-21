import { helper } from '@ember/component/helper';
import { compare } from '@ember/utils'

// returns true if arg0 is less than arg 1
export function lessThan([ arg0, arg1 ]) {
  return compare(arg0, arg1) === -1;
}

export default helper(lessThan);
