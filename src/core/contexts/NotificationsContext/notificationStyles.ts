import { styled } from "styletron-react";
import { motion } from "framer-motion";

export const Container = styled("div", {
  position: "fixed",
  zIndex: 1000,
  width: "0 auto",
  top: "30px",
  margin: "0 auto",
  left: "30px",
  right: "30px",
  display: "flex",
  flexDirection: "column-reverse",
  pointerEvents: "none",
  alignItems: "flex-end",
  "@media (max-width: 680px)": {
    alignItems: "center"
  }
});

const Message = styled("div", {
  position: "relative",
  overflow: "hidden",
  width: "40ch",
  "@media (max-width: 680px)": {
    width: "100%"
  }
});

const Content = styled(motion.div, {
  color: "white",
  background: "#445159",
  opacity: 0.9,
  padding: "12px 22px",
  fontSize: "1em",
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gridGap: "10px",
  overflow: "hidden",
  height: "auto",
  borderRadius: "3px",
  marginBottom: "10px"
});

export default {
  Container,
  Message,
  Content
};
