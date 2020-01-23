import React from 'react'
import {motion} from 'framer-motion'
import {ReactComponent as WarningSVG} from "assets/icons/warning.svg"

const WarningIcon = () => {
  return (
    <motion.div
      animate={{scale: 1}}
      transition={{duration: 0.3}}
    >
      <WarningSVG style={{width: 20, height: 20, margin: "0 13px", color: "var(--error-color)"}}/>
    </motion.div>
  )
}

export default WarningIcon