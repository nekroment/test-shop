export const adminSuccesses = {
  brand: 'Brand has been added successfully.',
  phone: 'Phone has been added successfully.',
};

export const adminErrors = {
  price: 'Price should be more than 1.',
  brand: 'Incorrect brand. Please< try again.',
  name: (min: number, max: number) =>
    `The password must be at least ${min} characters long and not more than ${max}.`,
};
