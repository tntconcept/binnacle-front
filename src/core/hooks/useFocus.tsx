import {FocusEventHandler, useCallback, useState} from "react"

export function useFocus<T = Element>(
  props: OptionalFocusHandlers<T> = {}
): [boolean, FocusEventHandlers<T>] {
  const { onBlur: propsOnBlur, onFocus: propsOnFocus } = props;
  const [hasFocus, setFocus] = useState(false);

  const onBlur = useCallback(
    // @ts-ignore
    (ev: FocusEvent<T>) => {
      setFocus(false);
      if (typeof propsOnBlur === 'function') {
        propsOnBlur(ev);
      }
    },
    [setFocus, propsOnBlur]
  );

  const onFocus = useCallback(
    // @ts-ignore
    (ev: FocusEvent<T>) => {
      setFocus(true);
      if (typeof propsOnFocus === 'function') {
        propsOnFocus(ev);
      }
    },
    [setFocus, propsOnFocus]
  );

  return [hasFocus, { onBlur, onFocus }];
}

export interface OptionalFocusHandlers<T = Element> {
  onBlur?: FocusEventHandler<T>;
  onFocus?: FocusEventHandler<T>;
}

export interface FocusEventHandlers<T = Element> {
  onBlur: FocusEventHandler<T>;
  onFocus: FocusEventHandler<T>;
}