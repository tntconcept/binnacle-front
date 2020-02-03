import {css} from 'linaria'

export const navbar = css`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(30px);
  box-shadow: 0 3px 10px 0 rgba(216, 222, 233, 0.15);
  background-color: #fbfbfc;
  padding-right: 32px;
  padding-left: 32px;
  margin-bottom: 32px;
`


export const links = css`
   display: flex;
   align-items: center;
   list-style-type: none;
   padding: 0;
   margin: 0;
`

export const link = css`
  display: block;
  color: #162644;
  font-size: 18px;
  font-weight: lighter;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
`
