import Decimal from "decimal.js";

type InstallmentParams = {
  installmentPrice: number;
  installments: number;
  monthlyInflationRate: number;
  firstPaymentDate: Date;
  discountPercentage: number;
  cashPrice: number;
};

type InstallmentData = {
  totalCashPrice: number;
  updatedPayments: number[];
  totalPresentValue: number;
  rechargePercentage: number;
  monthlyInstallmentAmount: number;
};

const calculateDiscountedCashPrice = ({
  installmentPrice,
  discountPercentage,
}: Pick<
  InstallmentParams,
  "installmentPrice" | "discountPercentage"
>): number => {
  return installmentPrice * (1 - discountPercentage / 100);
};

const calculateDaysToPay = ({
  firstPaymentDate,
}: Pick<InstallmentParams, "firstPaymentDate">): number => {
  return (
    (firstPaymentDate.getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24) /
    30
  );
};

const calculateUpdatedPayments = ({
  installmentPrice,
  installments,
  monthlyInflationRate,
  daysToPay,
}: Pick<
  InstallmentParams,
  "installmentPrice" | "installments" | "monthlyInflationRate"
> & { daysToPay: number }): number[] => {
  const updatedPayments: number[] = [];
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

const calculateTotalPresentValue = ({
  updatedPayments,
}: Pick<InstallmentData, "updatedPayments">): number => {
  return updatedPayments.reduce(
    (acc, payment) => acc + parseFloat(payment.toFixed(2)),
    0
  );
};

const calculateRechargePercentage = ({
  installmentPrice,
  cashPrice,
}: Pick<InstallmentParams, "installmentPrice" | "cashPrice">): number => {
  return (installmentPrice / cashPrice) * 100 - 100;
};

const useInstallment = (params: InstallmentParams): InstallmentData => {
  const discountedCashPrice = calculateDiscountedCashPrice(params);
  const daysToPay = calculateDaysToPay(params);
  const updatedPayments = calculateUpdatedPayments({
    ...params,
    daysToPay,
  });
  const totalPresentValue = calculateTotalPresentValue({ updatedPayments });
  const rechargePercentage = calculateRechargePercentage({
    installmentPrice: params.installmentPrice,
    cashPrice: params.cashPrice,
  });

  return {
    totalCashPrice: discountedCashPrice,
    updatedPayments,
    totalPresentValue,
    rechargePercentage,
    monthlyInstallmentAmount: params.installmentPrice / params.installments,
  };
};

export default useInstallment;
