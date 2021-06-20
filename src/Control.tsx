import React from 'react';

export interface ControlProps<T> {
  value?: T
  options?: T[]
  onChange?: (v?: T) => void
  getKey?: (v: T) => React.Key
  getLabel?: (v: T) => React.ReactNode
  area?: string
  title?: React.ReactNode
  children?: React.ReactNode
}

export function Control<T>({
  value,
  options = [],
  onChange,
  getKey = JSON.stringify,
  getLabel = getKey,
  area,
  title,
  children,
}: ControlProps<T>) {
  return (
    <div
      style={{
        padding: '0.5em',
        margin: '0.5em',
        border: '1px solid black',
        gridArea: area,
      }}
    >
      <label>
        <h3 style={{ margin: '0.25em 0' }}>{title}</h3>
        <select
          style={{ width: '100%' }}
          placeholder='Empty'
          value={value != null ? getKey(value) : undefined}
          onChange={({ currentTarget: { value: next } }) => (
            onChange?.(
              next != null
                ? options.find((o) => getKey(o) === next)
                : undefined
            )
          )}
        >
          {options.map((o) => {
            const key = getKey(o);
            return (
              <option key={key} value={key}>
                {getLabel(o)}
              </option>
            );
          })}
        </select>
      </label>
      {children}
    </div>
  );
}
