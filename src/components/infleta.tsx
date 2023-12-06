"use client";

import { ChangeEvent, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFinancialCalculations from "../lib/hooks/useFinancialCalculations";

const InfletaCalculator: React.FC = () => {
  const [cashPrice, setCashPrice] = useState<number>(0);
  const [installmentPrice, setInstallmentPrice] = useState<number>(0);
  const [monthlyInflationRate, setMonthlyInflationRate] =
    useState<number>(12.4);
  const [installments, setInstallments] = useState<number>(12);
  const [firstPaymentDate, setFirstPaymentDate] = useState<Date>(new Date());
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  const {
    calculateDiscountedCashPrice,
    calculateDaysToPay,
    calculateUpdatedPayments,
    calculateTotalPresentValue,
    calculateRechargePercentage,
  } = useFinancialCalculations();

  const discountedCashPrice = calculateDiscountedCashPrice(
    installmentPrice,
    discountPercentage
  );

  const daysToPay = calculateDaysToPay(firstPaymentDate);

  const updatedPayments = calculateUpdatedPayments({
    installmentPrice,
    installments,
    monthlyInflationRate,
    daysToPay,
  });

  const totalPresentValue = calculateTotalPresentValue(updatedPayments);

  const rechargePercentage = calculateRechargePercentage(
    installmentPrice,
    cashPrice
  );

  return (
    <div>
      <h1>Calculadora de Compra al Contado vs. Cuotas</h1>
      <label>Valor al Contado:</label>
      <input
        placeholder="Valor al Contado"
        type="number"
        value={cashPrice}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setCashPrice(Number(e.target.value))
        }
      />
      <br />

      <label>Valor en Cuotas:</label>
      <input
        placeholder="Valor en Cuotas"
        type="number"
        value={installmentPrice}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInstallmentPrice(Number(e.target.value))
        }
      />
      <br />

      <label>Tasa de Inflación Mensual Estimada (Ejemplo: 12.4%):</label>
      <input
        placeholder="Tasa de Inflación Mensual Estimada"
        type="number"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setMonthlyInflationRate(Number(e.target.value))
        }
        value={monthlyInflationRate}
      />
      <br />

      <label>Cantidad de Cuotas:</label>
      <input
        placeholder="Cantidad de Cuotas"
        type="number"
        value={installments}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInstallments(Number(e.target.value))
        }
      />
      <br />

      <label>Fecha de Pago de la Primera Cuota:</label>
      <DatePicker
        selected={firstPaymentDate}
        onChange={(date: Date) => setFirstPaymentDate(date)}
      />
      <br />

      <div>
        <h2>Resultados:</h2>
        <h3>
          {totalPresentValue > cashPrice ? "Contado" : "En Cuotas"} es mejor
        </h3>
        <p>
          Sumatoria de las cuotas ajustadas a valor de hoy: $
          {totalPresentValue.toFixed(2)}
        </p>
        <p>Porcentaje de recargo: {rechargePercentage.toFixed(2)}%</p>
        <p>Valor de cada cuota: ${installmentPrice / installments}</p>
        <h3>Cuotas ajustadas por la inflación mes a mes</h3>
        <ul>
          {updatedPayments.map((payment: number, index: number) => (
            <li key={index}>
              Cuota #{index + 1}: ${payment.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfletaCalculator;
