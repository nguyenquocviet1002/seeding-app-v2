import styles from './ModalCreateForm.module.scss';

const SelectField = ({
    label,
    value, // Giá trị hiển thị đã chọn
    options, // Mảng các đối tượng lựa chọn
    onSelect, // Callback khi một item được chọn: (itemValue, itemDisplay, itemSecondValue?) => void
    onSearch, // Callback khi giá trị tìm kiếm thay đổi: (e) => void
    searchValue, // Giá trị hiện tại của ô tìm kiếm
    onClearSearch, // Callback để xóa giá trị tìm kiếm: () => void
    isOpen, // Trạng thái mở/đóng của dropdown
    toggleOpen, // Callback để chuyển đổi trạng thái mở/đóng
    closeSelect, // Callback để đóng select và reset tìm kiếm ở component cha
    fieldRef, // Ref để xử lý click ngoài
    required = false,
    displayKey = 'name', // Key để hiển thị trong danh sách (ví dụ: 'name')
    valueKey = 'id', // Key để lấy giá trị thực tế (ví dụ: 'id', 'code')
    secondValueKey, // Key tùy chọn cho giá trị thứ hai (ví dụ: 'link' cho fanpage)
    placeholder = 'Chọn...',
    clearSelection, // Callback tùy chọn để hủy bỏ lựa chọn (ví dụ: cho Fanpage link)
}) => {
    return (
        <div className={styles['control']} ref={fieldRef}>
            <label className={styles['label']}>
                {label} {required && <span className={styles['require']}>(*)</span>}
                {clearSelection && value && (
                    <span onClick={clearSelection} className={styles['clear-selection']}>
                        [ Hủy bỏ ]
                    </span>
                )}
            </label>
            <p
                className={`${styles['input']} ${styles['select']}`}
                onClick={toggleOpen}
            >
                <span>{value || placeholder}</span>
            </p>
            {isOpen && (
                <div className={styles['option']}>
                    <div className={styles['filter']}>
                        <input
                            type="text"
                            value={searchValue}
                            placeholder={`Tìm kiếm ${label.toLowerCase()}`}
                            onChange={onSearch}
                        />
                        {searchValue && (
                            <button
                                onClick={onClearSearch}
                            >
                                &#10005;
                            </button>
                        )}
                    </div>
                    {options && options.length > 0 ? (
                        <ul className={styles['list']}>
                            {options.map((item) => (
                                <li
                                    key={item[valueKey] || item.id}
                                    onClick={() => {
                                        if (secondValueKey) {
                                            onSelect(item[valueKey], item[displayKey], item[secondValueKey]);
                                        } else {
                                            onSelect(item[valueKey], item[displayKey]);
                                        }
                                        closeSelect(); // Gọi hàm đóng và reset tìm kiếm từ component cha
                                    }}
                                >
                                    {item[displayKey]}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className={styles['list']}>Không có dữ liệu</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectField;