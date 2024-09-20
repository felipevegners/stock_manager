/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { NumericFormat, PatternFormat } from "react-number-format";

function MaskedInput({
  value,
  onChange,
  customInput,
  type,
  prefix,
  refInput,
  width,
  readOnly
}) {
  const AddCpfAndCnpjMask = (value) => {
    if (value.length >= 11) {
      return "###.###.###-###";
    } else {
      return "##.###.###/####-##";
    }
  };
  return type && type === "numeric" ? (
    <NumericFormat
      value={value}
      thousandSeparator="."
      decimalSeparator=","
      prefix={prefix + " "}
      decimalScale={2}
      customInput={customInput}
      onValueChange={(values) => {
        onChange(values.floatValue);
      }}
      getInputRef={refInput}
      style={{ width: width }}
      allowClear
      defaultValue={"0,00"}
      readOnly={readOnly}
    />
  ) : (
    <PatternFormat
      format={(value) =>
        value?.replace(/\D/g, "")?.length <= 11
          ? "###.###.###-###"
          : "##.###.###/####-##"
      }
    />
  );
}

export default MaskedInput;
