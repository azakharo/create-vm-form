import {type ChangeEvent, type LegacyRef, useCallback} from 'react';
import {type SelectProps} from 'antd';

const normalizeValue = (
  value: string,
  isNumberValue: boolean,
): string | number => (isNumberValue ? Number.parseInt(value, 10) : value);

export const SelectMock = ({
  ref,
  ...props
}: SelectProps & {
  ref?: React.RefObject<LegacyRef<HTMLSelectElement> | null>;
}) => {
  // Здесь некоторые пропы специально извлекаются из props, чтобы не передавать их в select

  const {
    mode,
    onChange,
    options,
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ref={ref}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data-testid={props['data-testid']}
      onChange={handleChange}
      multiple={multiple}
      {...restProps}
    >
      {/* TODO option groups не поддерживаются */}
      {options
        ? options.map(({label, value, ...restOptProps}) => (
            <option key={value} value={value!} {...restOptProps}>
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
