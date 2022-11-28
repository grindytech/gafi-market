export class BaseResult<T> {
  errors: object;
  data: T;
  success = true;
}
