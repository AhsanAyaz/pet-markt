export const calculateDiscountedPrice = (
  price: number,
  discountedPercentage: number
) => {
  return price * (1 - discountedPercentage);
};

// export const calculateShippingCost = (weight: number): number => {
//   // this function calculates the shipping cost based on the weight
//   // if the weight is less than or equal to 5, the shipping cost is 5.99
//   // otherwise, the shipping cost is 9.99
//   if (weight <= 5) {
//     return 5.99; // standard shipping cost
//   }
//   return 9.99; // express shipping cost
// };

// export const createOrder = (
//   itemName: string,
//   quantity: number,
//   pricePerUnit: number,
//   shippingAddress: string,
//   billingAddress: string,
//   paymentMethod: string
// ) => {
//   // this function creates an order
// };

// export const main = () => {
//   createOrder(
//     'Dog Food',
//     2,
//     10,
//     '123 Main St, Anytown, USA',
//     '123 Billing St, Anytown, USA',
//     'Credit Card'
//   );
// };
