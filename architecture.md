// Pasaba en el select year
// Cuando se actualiza el estado y también en el mismo componente se suspende la transición se ignora.
// Por tanto ese estado se debe de pasar al componente que empieza la transición.


/Vacation
 /RequestVacationForm
  /DatePicker
  - RequestVacationForm.spec.tsx
  - RequestVacationForm.tsx
  - index.tsx
 /VacationTable
  /Table

  - VacationTable.spec.tsx
  - VacationTable.tsx
  - index.tsx
 /SelectYear
  - index.tsx
 /VacationInformation

 - VacationPage.tsx
 - index.tsx

--------------------------------------------------------------

/VacationPage
 /__tests__
 /RequestVacationForm
 /__tests__
  /DatePicker
  - index.tsx
 /VacationTable
  /Table
  - index.tsx
 /SelectYear
  - index.tsx
 /VacationInformation
  - index.tsx

 - index.tsx

# __tests__ no me gusta tanto porque no veo que ficheros tengo testeados y cuales no?
- Pero es realmente imporante?

/api
 /vacation
  - fetchVacation
  - createVacation
  - fooVacation
# Me gusta este concepto más porque es más fácil de ver

You could also use index file for exporting. Then the main part will stay in a dedicated file.
Example:
src/
  /components
    /Button
      /Button.js // Implementation of button component
      /styles.css or styles.js
      /index.js // For export purpose

So in another place you can still use this to import button
import Button from "../Button"

API folder organization

/api
 /User
  - interface.ts
  - fetchLoggedUser.ts
  - fetchLoggedUser.transformer.ts
 /Holidays
  - interface.ts
  - fetchHolidaysBetweenDate.ts
  - fetchHolidaysBetweenDate.transformer.ts
  - fetchHolidaysBetweenDate.test.tsx
  - createVacationRequest.ts
  - updateVacationRequest.ts
  - deleteVacationRequest.ts


Notes:
- Components should have their own folder if the component is made up of more than one file (Button.tsx, Button.test.tsx)
```javascript
/Button
  - Button.tsx
  - Button.test.tsx
```
- Files should be named after their default export as much as possible.
The button component lives in Button.js
- Each file name must be unique for the whole project, and convey what the file contains without context.
Don't `utils.ts`. Do `login.utils.ts`. Don't `api.ts`. Do `login.api.ts`


```javascript
function Example() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </header>
  )
}
```
