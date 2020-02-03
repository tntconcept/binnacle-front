import {css} from "linaria"

export const base = css`
  margin: 20px;
  position: relative;
  height: 139px;
  border-radius: 5px;
  border: solid 1px var(--dark-green);
  background-color: var(--base-background-color);
  padding: 18px 10px 10px 10px;
`;
export const isBillable = css`
  border: solid 1px var(--dark-green);
`;

export const billable = css`
  position: absolute;
  top: -2px;
  right: 16px;
  width: 62px;
  height: 10px;
  padding: 0px 5px;
  background-color: white;
  font-family: var(--body-font);
  font-weight: bold;
  line-height: 0.38;
  letter-spacing: 0.14px;
  color: var(--dark-green-2);
  text-transform: uppercase;
  font-size: var(--font-size-8);
`;

export const header = css`
  font-family: var(--body-font);
  font-size: var(--font-size-14);
  color: var(--black-color);
`;

export const headerBlock = css`
  font-size: var(--font-size-14);
  font-family: 'Work sans', 'serif';
`;

export const headerBlockWithMarginBottom = css`
  font-size: var(--font-size-14);
  margin-bottom: 4px;
  display: flex;
  align-items: baseline;
    font-family: 'Work sans', 'serif';

`;

export const organization = css`
  position: absolute;
  top: 6px;
  max-width: 45ch;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 18px;
  color: var(--light-grey);
  font-size: 10px;
  text-transform: uppercase;
      font-family: 'Work sans', 'serif';

`;

export const projectAndRoleText = css`
  max-width: 18ch;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
`;

export const icon = css`
  margin-right: 6px;
`;

export const dot = css`
  font-size: 14px;
  text-align: center;
  padding: 0 3px;
  position: relative;
  top: -3px;
  font-family: serif;
  font-weight: bold;
`;

export const line = css`
  width: 100%;
  height: 1px;
  margin: 8px auto;
  border-radius: 5px;
  background-color: var(--light-grey2);
`;

export const description = css`
  font-size: var(--font-size-14);
  line-height: var(--basic-line-height);
`;
