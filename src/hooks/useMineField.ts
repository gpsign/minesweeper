import { useContext } from "react";
import { FieldContext } from "../context/FieldContext";

export function useMineField() {
  const context = useContext(FieldContext);
  if (!context)
    throw "O hook deve ser usado dentro do <FieldContext.Provider>!";
  return context;
}
