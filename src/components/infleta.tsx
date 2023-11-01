'use client';

import React, { useState, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Decimal from "decimal.js";

const InfletaCalculator: React.FC = () => {
  const [cashPrice, setCashPrice] = useState<number>(0);
  const [installmentPrice, setInstallmentPrice] = useState<number>(0);
  const [monthlyInflationRate, setMonthlyInflationRate] =
    useState<number>(12.4);
  const [installments, setInstallments] = useState<number>(12);
  const [firstPaymentDate, setFirstPaymentDate] = useState<Date>(new Date());
  const [presentValue, setPresentValue] = useState<number>(0);
  const [updatedPayments, setUpdatedPayments] = useState<number[]>([]);
  const [rechargePercentage, setRechargePercentage] = useState<number>(0);

  const calculatePresentValue = () => {
    const daysToPay: number =
      (firstPaymentDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24) /
      30;

    // Calcular montos mensuales actualizados
    const updatedPayments: number[] = [];

    const monthlyInflationRateInDecimals = new Decimal(monthlyInflationRate)
      .div(100)
      .toNumber();

    for (let i = 0; i < installments; i++) {
      const updatedPayment: number =
        installmentPrice /
        installments /
        Math.pow(1 + monthlyInflationRateInDecimals, i + daysToPay);
      updatedPayments.push(updatedPayment);
    }

    setUpdatedPayments(updatedPayments);

    // Calcular el valor total del VP como la sumatoria de todos los updated payments
    const totalPresentValue: number = updatedPayments.reduce(
      (acc, payment) => acc + parseFloat(payment.toFixed(2)),
      0
    );

    setPresentValue(totalPresentValue);

    const rechargedPercentage: number =
      (installmentPrice / cashPrice) * 100 - 100;
    setRechargePercentage(rechargedPercentage);
  };

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
      <button onClick={calculatePresentValue}>Calcular</button>

      <div>
        <h2>Resultados:</h2>
        <h3>{presentValue > cashPrice ? "Contado" : "En Cuotas"} es mejor</h3>
        <p>
          Sumatoria de las cuotas ajustadas a valor de hoy: $
          {presentValue.toFixed(2)}
        </p>
        <p>
          Porcentaje de recargo:{" "}
          {installmentPrice === 0 || cashPrice === 0 ? 0 : rechargePercentage}%
        </p>
        <p>Valor de cada cuota: ${installmentPrice / installments}</p>
        <h3>Cuotas ajustadas por la inflación mes a mes</h3>
        <ul>
          {updatedPayments.map((payment, index) => (
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
