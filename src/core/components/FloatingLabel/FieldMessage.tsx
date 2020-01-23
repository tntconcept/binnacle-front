import React from 'react'
import './style.css'
import {motion} from 'framer-motion'

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
      className={`hint ${props.isError && 'error'}`}
      initial="hidden"
      animate="visible"
      variants={fadeInTop}
    >
      {props.text}
    </motion.p>
  )
}

export default FieldMessage