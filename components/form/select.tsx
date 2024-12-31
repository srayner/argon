import styles from "./form.module.css";

interface SelectProps<TOption> {
  label: string;
  register: any;
  fieldName: string;
  isValueNumeric: boolean;
  options: TOption[];
  optionValueField?: keyof TOption;
  optionNameField?: keyof TOption;
}

export default function Select<TOption>({
  label,
  register,
  fieldName,
  isValueNumeric,
  options,
  optionValueField = "id" as keyof TOption,
  optionNameField = "name" as keyof TOption,
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
      >
        <option key="!" value="">
          Unknown
        </option>
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
