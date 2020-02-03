import {css} from "linaria"
import {rem} from "utils/helpers"

export const hintText = css`
  color: rgba(0, 0, 0, 0.54);
  font-size: ${rem("12px")};
  margin: 8px 14px 0;
  min-height: 1em;
  text-align: left;
  font-family: var(--body-font);
  font-weight: 400;
  line-height: 1em;
  letter-spacing: 0.03333em;
`;

export const errorText = css`
  color: var(--error-color);
`;