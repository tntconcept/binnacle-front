import React from 'react'
import style from './recentProjects.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(style)

const RecentProjects = () => {
  return (
    <div className={style.base}>
      <header className={style.header}>
        <p className={style.label}>Proyectos recientes</p>
        <button className={style.button}>+ Añadir uno más</button>
      </header>
      <div className={style.grid}>
        <div
          className={style.card}
          tabIndex={0}>
          <p className={style.project}>Lorem ipsum dolor. Lorem ipsum dolor</p>
          <p className={style.role}>Lorem ipsum dolor. Lorem ipsum dolor</p>
        </div>
        <div
          className={style.card}
          tabIndex={0}>
          <p className={style.project}>Lorem ipsum dolor. Lorem ipsum dolor</p>
          <p className={style.role}>Lorem ipsum dolor. Lorem ipsum dolor</p>
        </div>
        <div
          className={style.card}
          tabIndex={0}>
          <p className={style.project}>Lorem ipsum dolor. Lorem ipsum dolor</p>
          <p className={style.role}>Lorem ipsum dolor. Lorem ipsum dolor</p>
        </div>
        <div
          className={style.card}
          tabIndex={0}>
          <p className={style.project}>Lorem ipsum dolor. Lorem ipsum dolor</p>
          <p className={style.role}>Lorem ipsum dolor. Lorem ipsum dolor</p>
        </div>
        <div
          className={style.card}
          tabIndex={0}>
          <p className={style.project}>Lorem ipsum dolor. Lorem ipsum dolor</p>
          <p className={style.role}>Lorem ipsum dolor. Lorem ipsum dolor</p>
        </div>
        <div
          className={style.card}
          tabIndex={0}>
          <p className={style.project}>Lorem ipsum dolor. Lorem ipsum dolor</p>
          <p className={style.role}>Lorem ipsum dolor. Lorem ipsum dolor</p>
        </div>
        <div
          className={cx({
            card: true,
            cardSelected: true
          })}
          tabIndex={0}>
          <p className={style.project}>Lorem ipsum dolor. Lorem ipsum dolor</p>
          <p className={style.role}>Lorem ipsum dolor. Lorem ipsum dolor</p>
        </div>
      </div>
    </div>
  )
}

export default RecentProjects