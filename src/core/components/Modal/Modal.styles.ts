import {css} from "linaria"

export const cover = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; // This must be at a higher index to the rest of your page content
  background-color: #c5c5c595;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const modal = css`
  width: 100vw;
  background-color: white;
  padding: 16px;
  min-height: 200px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const icon = css`
  width: 25px;
  height: 25px;
  fill: transparent;
  stroke: black;
  stroke-linecap: round;
  stroke-width: 2;
`;

export const hideVisually = css`
  border: 0 !important;
  clip: rect(0 0 0 0) !important;
  height: 1px !important;
  margin: -1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
`;
