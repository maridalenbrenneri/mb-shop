class ArrayUtils {
  sortByName(array: Array<any>) {
    array.sort(function (a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  }

  sumArrayProp(array: any[], key: string) {
    if (!array || !key) return 0;

    return array.reduce((a, b) => a + (b[key] || 0), 0);
  }
}

export default new ArrayUtils();
