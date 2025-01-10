import styles from "./form.module.css";

interface TextInputProps {
  label?: string;
  register: any;
  fieldName: string;
  errors: any;
}

export default function TextInput({
  label,
  register,
  fieldName,
  errors,
}: TextInputProps) {
  return (
    <div className={styles.formItem}>
      {label && <label>{label}</label>}
      <div>
        <input {...register(fieldName)} type="text" autoComplete="off" />
        {errors && errors[fieldName] && (
          <p
            className={styles.errorMessage}
          >{`${errors[fieldName].message}`}</p>
        )}
      </div>
    </div>
  );
}
