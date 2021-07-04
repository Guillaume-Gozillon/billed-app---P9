import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import firebase from "../__mocks__/firebase"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
    })
    // Test si les dates sont triées par ordre décroissant
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  // test loading page sur BillUI
  test('Then, Loading page should be rendered', () => {
    // BillUI.loading, condition qui retourne la loading page si TRUE
    const html = BillsUI({ loading: true })
    document.body.innerHTML = html
    // Attend une valeur retour du DOM, verifie que le contenu est TRUE
    expect(screen.getAllByText('Loading...')).toBeTruthy()
    console.log(screen.getAllByText('Loading...'));
  })
  // test error page
  test('Then, Error page should be rendered', () => {
    const html = BillsUI({ error: 'some error message' })
    document.body.innerHTML = html
    expect(screen.getAllByText('Erreur')).toBeTruthy()
  })
  // test d'intégration GET
  test('fetches bills from mock API GET', async () => {
		const getSpy = jest.spyOn(firebase, 'get')
		const bills = await firebase.get()
		expect(getSpy).toHaveBeenCalledTimes(1)
		expect(bills.data.length).toBe(4)
	})
})

  // test click on new bill button
  // test click on eye button