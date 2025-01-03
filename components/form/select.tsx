import styles from "./form.module.css";

interface SelectProps<TOption> {
  label: string;
  register: any;
  fieldName: string;
  isValueNumeric: boolean;
  options: TOption[];
  optionValueField?: keyof TOption;
  optionNameField?: keyof TOption;
  defaultValue?: string | number;
  isOptional?: boolean;
}

export default function Select<TOption>({
  label,
  register,
  fieldName,
  isValueNumeric,
  options,
  optionValueField = "id" as keyof TOption,
  optionNameField = "name" as keyof TOption,
  defaultValue,
  isOptional = true,
}: SelectProps<TOption>) {
  return (
    <div className={styles.formItem}>
      <label>{label}</label>
      <select
        {...register(fieldName, {
          setValueAs: (value: any) => {
            if (!value) return null;
            return isValueNumeric ? Number(value) : value;
          },
        })}
        defaultValue={defaultValue}
      >
        {isOptional && (
          <option key="!" value="">
            Unknown
          </option>
        )}
        {options.map((o) => {
          return (
            <option
              key={String(o[optionValueField])}
              value={String(o[optionValueField])}
            >
              {String(o[optionNameField])}
            </option>
          );
        })}
      </select>
    </div>
  );
}
