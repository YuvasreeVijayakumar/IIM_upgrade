import { CalculationWithoutDollar } from './CalculationWithoutDollar';

export const YAxisFormat = (tickItem) => {
  let value = CalculationWithoutDollar(tickItem);
  return value;
};
