export class Utils {
  public static clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}
