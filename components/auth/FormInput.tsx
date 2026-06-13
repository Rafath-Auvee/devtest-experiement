import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  labelClass?: string;
  inputClass?: string;
  wrapperClass?: string;
}

export default function FormInput({
  label,
  id,
  labelClass = "_social_login_label _mar_b8",
  inputClass = "form-control _social_login_input",
  wrapperClass = "_social_login_form_input _mar_b14",
  ...props
}: FormInputProps) {
  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
      <div className={wrapperClass}>
        <label className={labelClass} htmlFor={id}>
          {label}
        </label>
        <input id={id} className={inputClass} {...props} />
      </div>
    </div>
  );
}
