export function getFinalPrice(product) {
  const price = Number(product.price);

  if (!product.discountPercent) return price;

  return price - (price * product.discountPercent) / 100;
}

export function getOldPrice(product) {
  return Number(product.price);
}

export function getPricePerKg(product) {
  if (!product.weight) return null;

  const final = getFinalPrice(product);
  return final / product.weight;
}