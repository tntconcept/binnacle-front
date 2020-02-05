import React from 'react'
import {motion} from 'framer-motion'
import {cls} from "utils/helpers"
import styles from './FieldMessage.module.css'

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
      className={cls(styles.hint, props.isError && styles.error)}
      initial="hidden"
      animate="visible"
      variants={fadeInTop}
    >
      {props.text}
    </motion.p>
  )
}

export default FieldMessage