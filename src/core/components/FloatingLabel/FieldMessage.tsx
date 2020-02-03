import React from 'react'
import {motion} from 'framer-motion'
import {cx} from 'linaria'
import {errorText, hintText} from "core/components/FloatingLabel/FieldMessage.styles"

interface IFieldMessage {
  text: string,
  isError: boolean,
}

const fadeInTop = {
  visible: {opacity: 1, translateY: 0},
  hidden: {opacity: 0, translateY: -10},
}

const FieldMessage: React.FC<IFieldMessage> = (props) => {
  return (
    <motion.p
      className={cx(hintText, props.isError && errorText)}
      initial="hidden"
      animate="visible"
      variants={fadeInTop}
    >
      {props.text}
    </motion.p>
  )
}

export default FieldMessage