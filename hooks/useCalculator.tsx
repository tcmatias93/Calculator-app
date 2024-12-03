import { useEffect, useRef, useState } from "react";

enum Operator {
  add = "+",
  subtract = "-",
  multiply = "x",
  divide = "÷",
}

export const useCalculator = () => {
  const [formula, setFormula] = useState("");
  const [number, setNumber] = useState("0");
  const [prevNumber, setPrevNumber] = useState("0");

  const lastOperation = useRef<Operator>();

  useEffect(() => {
    if (lastOperation.current) {
      //Tomo la primera posicion de la formula
      const firstFormulaPart = formula.split(" ").at(0);
      setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`);
    } else {
      setFormula(number);
    }
  }, [number]);

  useEffect(() => {
    //Como calcular subRessultado
    const subResult = calculateSubResult();
    setPrevNumber(`${subResult}`);
  }, [formula]);

  //Reseteo todos los valores
  const clean = () => {
    setFormula("0");
    setNumber("0");
    setPrevNumber("0");

    lastOperation.current = undefined;
  };

  const toggleSign = () => {
    if (number.includes("-")) {
      return setNumber(number.replace("-", ""));
    }
    setNumber("-" + number);
  };

  const deleteLast = () => {
    //Con esta variable se el signo actual
    let currentSign = "";
    let temporalNumber = number;

    if (number.includes("-")) {
      currentSign = "-";
      temporalNumber = number.replace("-", "");
    }

    if (temporalNumber.length > 1) {
      setLastNumber();
      return setNumber(currentSign + temporalNumber.slice(0, -1));
    }

    setNumber("0");
  };

  const setLastNumber = () => {
    //Culo el resultado
    calculateResult();

    if (number.endsWith(".")) {
      setPrevNumber(number.slice(0, -1));
    }
    setPrevNumber(number);
    setNumber("0");
  };

  const divideOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.divide;
  };

  const multiplaceOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.multiply;
  };

  const addOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.add;
  };

  const subtractOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.subtract;
  };

  const calculateSubResult = () => {
    const [firstValue, operation, secondValue] = formula.split(" ");
    const num1 = Number(firstValue);
    const num2 = Number(secondValue); //NaN;

    if (isNaN(num2)) return num1;

    switch (operation) {
      case Operator.add:
        return num1 + num2;
      case Operator.subtract:
        return num1 - num2;
      case Operator.multiply:
        return num1 * num2;
      case Operator.divide:
        if (num2 == 0) {
          return `No se puede divider por ${num2}`;
        } else {
          return num1 / num2;
        }
      default:
        throw new Error(`Operation ${operation} not implemented`);
    }
  };

  const calculateResult = () => {
    const results = calculateSubResult();
    setFormula(`${results}`);
    lastOperation.current = undefined;
    setPrevNumber("0");
  };

  const buildNumber = (numberString: string) => {
    if (number.includes(".") && numberString === ".") return;

    if (number.startsWith("0") || number.startsWith("-0")) {
      if (numberString === ".") {
        return setNumber(number + numberString);
      }

      //evaluar otro cero y no hay un punto
      if (numberString === "0" && number.includes(".")) {
        return setNumber(number + numberString);
      }

      //evaluar si es diferente de cero, no hay punto y es el primer numero
      if (numberString !== "0" && !number.includes(".")) {
        return setNumber(numberString);
      }

      //evitar caso 0000.00
      if (numberString === "0" && !number.includes(".")) return;
    }

    setNumber(number + numberString);
  };

  return {
    //props
    formula,
    number,
    prevNumber,

    //methods
    buildNumber,
    clean,
    toggleSign,
    deleteLast,
    divideOperation,
    multiplaceOperation,
    addOperation,
    subtractOperation,
    calculateSubResult,
    calculateResult,
  };
};
