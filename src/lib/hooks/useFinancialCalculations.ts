import Decimal from "decimal.js";

type InstallmentParams = {
  installmentPrice: number;
  discountPercentage: number;
  firstPaymentDate: Date;
  installments: number;
  monthlyInflationRate: number;
  cashPrice: number;
};

const useFinancialCalculations = () => {
  const calculateDiscountedCashPrice = (
    installmentPrice: number,
    discountPercentage: number
  ) => {
    return installmentPrice * (1 - discountPercentage / 100);
  };

  const calculateDaysToPay = (firstPaymentDate: Date) => {
    return (
      (firstPaymentDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24) /
      30
    );
  };

  const calculateUpdatedPayments = (
    params: Pick<InstallmentParams, "installmentPrice" | "installments" | "monthlyInflationRate"> & {
      daysToPay: number;
    }
  ) => {
    const { installmentPrice, installments, monthlyInflationRate, daysToPay } = params;

    const updatedPayments = [];
    const monthlyInflationRateInDecimals = new Decimal(monthlyInflationRate)
      .div(100)
      .toNumber();

    const monthlyInstallmentAmount = installmentPrice / installments;

    for (let i = 0; i < installments; i++) {
      const updatedPayment =
        monthlyInstallmentAmount /
        Math.pow(1 + monthlyInflationRateInDecimals, i + daysToPay);
      updatedPayments.push(updatedPayment);
    }

    return updatedPayments;
  };

  const calculateTotalPresentValue = (updatedPayments: number[]) => {
    return updatedPayments.reduce(
      (acc, payment) => acc + parseFloat(payment.toFixed(2)),
      0
    );
  };

  const calculateRechargePercentage = (
    installmentPrice: number,
    cashPrice: number
  ) => {
    return (installmentPrice / cashPrice) * 100 - 100;
  };

  return {
    calculateDiscountedCashPrice,
    calculateDaysToPay,
    calculateUpdatedPayments,
    calculateTotalPresentValue,
    calculateRechargePercentage,
  };
};

export default useFinancialCalculations;
