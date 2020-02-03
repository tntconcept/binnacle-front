import React from "react"
import {css} from "linaria"

interface ITimeStats {
  timeBalance: any;
}

const constainer = css`
  height: 100%;
  padding: 10px 16px;
  background-color: #ebebeb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const block = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`

const description = css`
  font-size: 10px;
  text-transform: uppercase;
  font-family: 'Work sans', serif;
  margin-bottom: 4px;
`

const value = css`
  font-size: 14px;
  font-family: 'Work sans', serif;
  font-weight: 500;
`

const separator = css`
  display: inline-block;
  width: 1px;
  height: 22px;
  background-color: rgba(102, 102, 102, 0.26);
`

// Works, tiene la misma referencia y no se renderiza mas
export const TimeStats: React.FC<ITimeStats> = React.memo(props => {
  console.count("Time Stats");
  return (
    <div className={constainer}>
      <div className={block}>
        <span className={description}>Imputadas</span>
        <span className={value}>10h</span>
      </div>
      <div className={separator} />
      <div className={block}>
        <span className={description}>Laborables</span>
        <span className={value}>120h</span>
      </div>
      <div className={separator} />
      <div className={block}>
        <select
          style={{
            textTransform: "uppercase",
            fontSize: "8px",
            fontFamily: "Nunito sans"
          }}
        >
          <option data-testid="balance_by_month_button">
            balance mensual
          </option>
          <option data-testid="balance_by_year_button">balance anual</option>
        </select>
        <span className={value}>10h</span>
      </div>
    </div>
  );
});
