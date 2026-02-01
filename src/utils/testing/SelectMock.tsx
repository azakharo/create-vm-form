import {type ChangeEvent, useCallback} from 'react';

// Define types inline to avoid circular dependency with antd
type SelectValue = string | number | (string | number)[];
type SelectOption = {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
};

interface SelectMockProps {
  ref?: React.Ref<HTMLSelectElement>;
  mode?: 'multiple' | 'tags' | undefined;
  onChange?: (value: SelectValue, option: unknown) => void;
  options?: SelectOption[];
  optionFilterProp?: string;
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean);
  loading?: boolean;
  value?: SelectValue;
  defaultValue?: SelectValue;
  disabled?: boolean;
  placeholder?: string;
  allowClear?: boolean;
  showSearch?: boolean;
  'data-testid'?: string;
  [key: string]: unknown;
}

const normalizeValue = (
  value: string,
  isNumberValue: boolean,
): string | number => (isNumberValue ? Number.parseInt(value, 10) : value);

export const SelectMock = ({ref, ...props}: SelectMockProps) => {
  // Здесь некоторые пропы специально извлекаются из props, чтобы не передавать их в select

  const {
    mode,
    onChange,
    options,
    value,
    defaultValue,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    optionFilterProp,
    filterOption,
    loading,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...restProps
  } = props;
  const multiple = mode ? ['tags', 'multiple'].includes(mode) : false;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (!onChange) {
        return;
      }

      const isNumberValue =
        Array.isArray(options) &&
        options.length > 0 &&
        typeof options[0].value === 'number';

      onChange(
        multiple
          ? Array.from(e.target.selectedOptions).map(option =>
              normalizeValue(option.value, isNumberValue),
            )
          : normalizeValue(e.target.value, isNumberValue),
        e.target.selectedOptions,
      );
    },
    [multiple, onChange, options],
  );

  return (
    <select
      ref={ref}
      data-testid={props['data-testid']}
      onChange={handleChange}
      multiple={multiple}
      value={multiple ? undefined : (value as string | number | undefined)}
      defaultValue={
        multiple ? undefined : (defaultValue as string | number | undefined)
      }
      {...restProps}
    >
      {/* TODO option groups не поддерживаются */}
      {options
        ? options.map(({label, value, ...restOptProps}) => (
            <option key={value} value={value} {...restOptProps}>
              {label}
            </option>
          ))
        : null}
    </select>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
SelectMock.Option = ({children, ...otherProps}) => (
  <option {...otherProps}>{children}</option>
);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
SelectMock.OptGroup = ({children, ...otherProps}) => (
  <optgroup {...otherProps}>{children}</optgroup>
);
