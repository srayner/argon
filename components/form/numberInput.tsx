import styles from "./form.module.css";

interface NumberInputProps {
  label?: string;
  register: any;
  fieldName: string;
  errors: any;
}

export default function NumberInput({
  label,
  register,
  fieldName,
  errors,
}: NumberInputProps) {
  return (
    <div className={styles.formItem}>
      {label && <label>{label}</label>}
      <div>
        <input {...register(fieldName)} type="number" autoComplete="off" />
        {errors && errors[fieldName] && (
          <p
            className={styles.errorMessage}
          >{`${errors[fieldName].message}`}</p>
        )}
      </div>
    </div>
  );
}
