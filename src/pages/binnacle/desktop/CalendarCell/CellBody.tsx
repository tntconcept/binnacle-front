import React from "react"
import styles from "pages/binnacle/desktop/CalendarGrid/CalendarGrid.module.css"
import {FocusOn} from "react-focus-on"
import VisuallyHidden from "core/components/VisuallyHidden"

interface Props {
  isSelected: boolean
  onEscKey: () => void
}

const CellBody: React.FC<Props> = ({ children, isSelected, onEscKey }) => {
  // announce and trap the focus and focus new activity button
  // on escape key focus the cell header and announce
  // cell body content should not be in the tab order if the cell is not selected

  return (
    <div className={styles.cellBody}>
      <FocusOn
        enabled={isSelected}
        onEscapeKey={onEscKey}
        scrollLock={false}
        noIsolation={true}
      >
        <VisuallyHidden
          tag='button'
          tabIndex={isSelected ? 0 : -1}
        >
          New Activity
        </VisuallyHidden>
        {children}
      </FocusOn>
    </div>
  );
};

export default CellBody;
