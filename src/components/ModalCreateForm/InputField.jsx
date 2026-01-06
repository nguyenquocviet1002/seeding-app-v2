import styles from './ModalCreateForm.module.scss';

const InputField = ({ label, type = 'text', value, onChange, required = false, rows, placeholder, name }) => {
    return (
        <div className={styles['control']}>
            <label className={styles['label']} htmlFor={name}>
                {label} {required && <span className={styles['require']}>(*)</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    id={name}
                    className={styles['input']}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    placeholder={placeholder}
                    name={name}
                ></textarea>
            ) : (
                <input
                    id={name}
                    type={type}
                    className={styles['input']}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    name={name}
                />
            )}
        </div>
    );
};

export default InputField;