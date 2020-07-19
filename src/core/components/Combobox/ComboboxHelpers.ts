import { RefObject } from 'react'

export enum Keys {
  Backspace = 'Backspace',
  Clear = 'Clear',
  Down = 'ArrowDown',
  End = 'End',
  Enter = 'Enter',
  Escape = 'Escape',
  Home = 'Home',
  Left = 'ArrowLeft',
  PageDown = 'PageDown',
  PageUp = 'PageUp',
  Right = 'ArrowRight',
  Space = ' ',
  Tab = 'Tab',
  Up = 'ArrowUp'
}

export enum MenuActions {
  Close,
  CloseSelect,
  First,
  Last,
  Next,
  Open,
  Previous,
  Select,
  Space,
  Type
}

// return combobox action from key press
export function getActionFromKey(
  key: string,
  menuOpen: boolean
): MenuActions | undefined {
  // handle opening when closed
  if (!menuOpen && (key === Keys.Down || key === Keys.Enter || key === Keys.Space)) {
    return MenuActions.Open
  }

  // handle keys when open
  if (key === Keys.Down) {
    return MenuActions.Next
  } else if (key === Keys.Up) {
    return MenuActions.Previous
  } else if (key === Keys.Home) {
    return MenuActions.First
  } else if (key === Keys.End) {
    return MenuActions.Last
  } else if (key === Keys.Escape) {
    return MenuActions.Close
  } else if (key === Keys.Enter) {
    return MenuActions.CloseSelect
  } else if (key === Keys.Space) {
    return MenuActions.Space
  } else if (key === Keys.Backspace || key === Keys.Clear || key.length === 1) {
    return MenuActions.Type
  }
}

// get updated option index
export function getUpdatedIndex(
  current: number,
  max: number,
  action: MenuActions
): number {
  switch (action) {
    case MenuActions.First:
      return 0
    case MenuActions.Last:
      return max
    case MenuActions.Previous:
      return Math.max(0, current - 1)
    case MenuActions.Next:
      return Math.min(max, current + 1)
    default:
      return current
  }
}

// check if an element is currently scrollable
export function isScrollable(element: RefObject<HTMLElement>): boolean {
  return element.current
    ? element.current.clientHeight < element.current.scrollHeight
    : false
}

// ensure given child element is within the parent's visible scroll area
export function maintainScrollVisibility(
  activeElement: RefObject<HTMLElement>,
  scrollParent: RefObject<HTMLElement>
) {
  if (activeElement.current && scrollParent.current) {
    const { offsetHeight, offsetTop } = activeElement.current
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent.current

    const isAbove = offsetTop < scrollTop
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight

    if (isAbove) {
      scrollParent.current.scrollTo(0, offsetTop)
    } else if (isBelow) {
      scrollParent.current.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight)
    }
  }
}
