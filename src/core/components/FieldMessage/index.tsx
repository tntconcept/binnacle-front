import React, {memo} from "react"
import {motion} from "framer-motion"
import {cls} from "utils/helpers"
import styles from "./FieldMessage.module.css"

interface IFieldMessage {
  hintText?: string;
  errorText?: string;
  alignRight?: boolean
  isError?: boolean | "";
}

const fadeInTop = {
  visible: { opacity: 1, translateY: 0 },
  hidden: { opacity: 0, translateY: -10 }
};

const FieldMessage: React.FC<IFieldMessage> = memo(props => {
  return props.hintText || props.isError ? (
    <motion.p
      data-testid="input_error_message"
      className={cls(styles.hint, props.isError && styles.error, (!props.isError && props.alignRight) && styles.alignLeft)}
      initial={props.hintText ? "visible": "hidden"}
      animate="visible"
      variants={fadeInTop}
    >
      {props.isError ? props.errorText : props.hintText}
    </motion.p>
  ) : null;
});

export default FieldMessage;
