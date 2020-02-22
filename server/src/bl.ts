export const getCoffeeVariationWeight = (id: number) => {
  switch (id) {
    case 1:
      return 250;
    case 2:
      return 500;
    case 3:
      return 1000;
    default:
      throw new Error("Invalid coffee variation id");
  }
};
