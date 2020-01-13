import React from 'react'

const recentProjectsMock = [
  {
    organization: {
      id: 200,
      name: "Autentia"
    },
    project: {
      id: 1,
      name: "Zara"
    },
    role: {
      id: 10,
      name: "CSS Developer"
    }
  },
  {
    organization: {
      id: 100,
      name: "KAkut"
    },
    project: {
      id: 5,
      name: "NobodyKnows"
    },
    role: {
      id: 10,
      name: "Secrert"
    }
  }
]


const RecentProjects = () => {

  // Los proyectos recientes se calculan al entrar en la bitacora teniendo en cuenta las ultimas 2 semanas.
  // Cuando entramos en una actividad, se cargan las entidades de esa actividad.
  // - Si el proyecto existe en recientes se marca en recientes.
  // - Si el proyecto no existe en recientes se muestra la lista de selects con las entidades seleccionadas.
  // - Recientes estara vacio cuando el usuario entre por primera vez a la bitacora
  // - Cuando el usuario vea imputaciones de meses o años anteriores
  // Al seleccionar un proyecto automaticamente cambia el billable

  // Recibo por props la lista de recientes
  // if projecto of current activity exists by id in recientes, check the card and render recent projects
  // show the selects filled with the organization, project and role of the activity.




  return (
    <fieldset>
      <legend>Proyectos recientes</legend>
      <button>Añadir uno más</button>
    </fieldset>
  )
}

export default RecentProjects