import { styled } from "styletron-react";
import { motion } from "framer-motion";
import { COLORS } from "core/components/aspect-guide/colors";

export const Container = styled("div", {
  zIndex: 1000,
  position: "absolute",
  top: "24px",
  right: "24px",
  display: "flex",
  flexDirection: "column-reverse",
  "@media (max-width: 680px)": {
    alignItems: "center",
    right: 0,
    left: 0
  }
});

const Message = styled("div", {
  display: "flex",
  "flex-direction": "column",
  "justify-content": "center"
});

const Title = styled("p", {
  fontSize: "16px",
  fontWeight: "bold",
  lineHeight: "1.38"
});

const Description = styled("p", {
  fontSize: "14px",
  // @ts-ignore
  fontWeight: "300",
  lineHeight: "1.36"
});

const CloseButton = styled("button", {
  width: "9px",
  height: "9px",
  outline: "none",
  border: "none",
  color: "white",
  margin: "16px",
  background: "transparent"
});

const Content = styled(motion.div, {
  display: "flex",
  color: "white",
  backgroundColor: COLORS.error,
  borderRadius: "5px",
  height: "66px",
  marginBottom: "16px"
});

const Error = styled("div", {
  backgroundColor: "white",
  width: "26px",
  height: "26px",
  margin: "20px 16px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

export default {
  Container,
  Message,
  Content,
  Error,
  Title,
  Description,
  CloseButton
};
