import * as React from "react";
import {DataField} from "./types/types";


export interface GenericFormProps<T> {
    fields: DataField<T>[];
    initialValues?: Partial<T>;
    onChange?: (values: Partial<T>, errors: Record<keyof T, string | null>) => void;
    onSubmit: (values: Partial<T>) => Promise<void>;
    onCancel: () => void;
}

export function GenericForm<T>({
   fields,
   initialValues = {},
   onChange,
   onSubmit,
   onCancel
}: GenericFormProps<T>) {
    const [values, setValues] = React.useState<Partial<T>>(initialValues);
    const [errors, setErrors] = React.useState<Record<keyof T, string | null>>({} as any);

    const handleChange = (key: keyof T, value: any) => {
        const newValues = { ...values, [key]: value };
        setValues(newValues);

        const newErrors: Record<keyof T, string | null> = { ...errors };
        const field = fields.find(f => f.key === key);
        if (field?.validate) {
            newErrors[key] = field.validate(value);
        } else {
            newErrors[key] = null;
        }
        setErrors(newErrors);

        onChange?.(newValues, newErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<keyof T, string | null> = {} as any;
        let hasErrors = false;

        fields.forEach(field => {
            const value = values[field.key];
            if (field.validate) {
                newErrors[field.key] = field.validate(value);
                if (newErrors[field.key]) {
                    hasErrors = true;
                }
            } else {
                newErrors[field.key] = null;
            }
        });

        setErrors(newErrors);

        if (!hasErrors) {
            await onSubmit(values);
        }
    };

    const hasErrors = Object.values(errors).some(error => error !== null);

    return (
        <div className="form-container">
            <form className="generic-form" onSubmit={handleSubmit}>
                {fields.map(field => (
                    <div key={String(field.key)} className="form-field">
                        <label className="form-label">{field.label}</label>
                        <input
                            className={`form-input ${errors[field.key] ? 'error' : ''}`}
                            type={field.type}
                            value={String(values[field.key] ?? '')}
                            onChange={e => handleChange(
                                field.key,
                                field.type === "number" ?
                                    (e.target.value === '' ? undefined : Number(e.target.value)) :
                                    e.target.value
                            )}
                        />
                        {errors[field.key] && (
                            <div className="error-message">{errors[field.key]}</div>
                        )}
                    </div>
                ))}
                <div className="form-actions">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={hasErrors}
                    >
                        Сохранить
                    </button>
                </div>
            </form>
        </div>
    );
}