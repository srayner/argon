interface SelectProps<TOption> {
  label?: string;
  register: any;
  fieldName: string;
  isValueNumeric: boolean;
  options: TOption[];
  optionValueField?: keyof TOption;
  optionNameField?: keyof TOption;
  defaultValue?: string | number;
  isOptional?: boolean;
  width: number;
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
  width = 300,
}: SelectProps<TOption>) {
  return (
    <div className="flex">
      {label && (
        <label className="w-[200px] p-1.5 text-[var(--text-color)] text-base font-bold">
          {label}
        </label>
      )}
      <select
        {...register(fieldName, {
          setValueAs: (value: any) => {
            if (!value) return null;
            return isValueNumeric ? Number(value) : value;
          },
        })}
        defaultValue={defaultValue}
        className="h-[32px] border border-[var(--seperator-color)] rounded px-2.5 py-1 text-[var(--text-color)] text-base"
        style={{ width: `${width}px` }}
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
