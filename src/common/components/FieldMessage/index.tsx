import React, {memo} from "react"
import {motion} from "framer-motion"
import {cls} from "utils/helpers"
import styles from "./FieldMessage.module.css"
import {VisuallyHidden} from "common/components"

interface IFieldMessage {
  id: string;
  error?: boolean;
  errorText?: string;
  hintText?: string;
  className?: string;
  alignRight?: boolean;
}

const fadeInTop = {
  visible: { opacity: 1, translateY: 0 },
  hidden: { opacity: 0, translateY: -10 }
};

const FieldMessage: React.FC<IFieldMessage> = memo(props => {
  return props.hintText || props.error ? (
    <motion.p
      data-testid="input_error_message"
      id={props.id}
      className={cls(styles.hint, props.error && styles.error, (!props.error && props.alignRight) && styles.alignLeft)}
      initial={props.hintText ? "visible": "hidden"}
      animate="visible"
      variants={fadeInTop}
    >
      {props.error ? (
        <React.Fragment>
          <VisuallyHidden>Error: </VisuallyHidden>
          {props.errorText}
        </React.Fragment>
      ) : props.hintText}
    </motion.p>
  ) : null;
});

export default FieldMessage;
