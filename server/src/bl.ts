export const getCoffeeVariationWeight = (id: number) => {
  switch (id) {
    case 1:
      return 250;
    case 2:
      return 500;
    case 3:
      return 1200;
    default:
      throw new Error("Invalid coffee variation id");
  }
};

export const getCoffeeVariationSizeLabel = (id: number) => {
  switch (id) {
    case 1:
      return "";
    case 2:
      return "500g";
    case 3:
      return "1.2kg";
    default:
      throw new Error("Invalid coffee variation id");
  }
};
