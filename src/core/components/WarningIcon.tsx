import React from 'react'
import {motion} from 'framer-motion'
import {ReactComponent as WarningSVG} from "assets/icons/warning.svg"

const WarningIcon = () => {
  return (
    <motion.div
      initial={{
        scale: 0.5
      }}
      animate={{scale: 1}}
    >
      <WarningSVG style={{width: 20, height: 20, margin: "0 13px", color: "var(--error-color)"}}/>
    </motion.div>
  )
}

export default WarningIcon