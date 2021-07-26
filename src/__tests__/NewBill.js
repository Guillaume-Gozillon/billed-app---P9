import { fireEvent, screen } from '@testing-library/dom';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import '@testing-library/jest-dom';
import { localStorageMock } from '../__mocks__/localStorage';
import { ROUTES } from '../constants/routes';
import firebase from '../__mocks__/firebase';

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })

    // test handleChangeFile
    test("cover handleChangeFile method", () => {
			const html = NewBillUI()
			document.body.innerHTML = html

			Object.defineProperty(window, 'localStorage', { value: localStorageMock})
			window.localStorage.setItem('user', JSON.stringify({
				type: 'Employee',
				email: 'johndoe@email.com'
			}))

			const onNavigate = pathname => {
				document.body.innerHTML = ROUTES({ pathname })
			}

			const obj = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
			const handleChangeFile = jest.fn(obj.handleChangeFile)

			const file = "test.png"
			const input_file = screen.getByTestId("file")
	
			input_file.addEventListener("input", handleChangeFile)
			fireEvent.input(input_file, file)
			expect(handleChangeFile).toHaveBeenCalled()
		})

    // test handleSubmit
    test("cover handleSubmit method", () => {
			const html = NewBillUI()
			document.body.innerHTML = html

			Object.defineProperty(window, 'localStorage', { value: localStorageMock})
			window.localStorage.setItem('user', JSON.stringify({
				type: 'Employee',
				email: 'johndoe@email.com'
			}))

			const onNavigate = pathname => {
				document.body.innerHTML = ROUTES({ pathname })
			}

			const obj = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
			const handleSubmit = jest.fn(obj.handleSubmit)
			const submitNewBill = screen.getByTestId('form-new-bill')

			submitNewBill.addEventListener("submit", handleSubmit)
			fireEvent.submit(submitNewBill)
			expect(handleSubmit).toHaveBeenCalled()

			const handleChangeFile = jest.fn(obj.handleSubmit)
			if (handleChangeFile.fileName === '') {
				expect(handleChangeFile.fileName).toBe(null)
			}
		})

    // test d'intégration POST
    // méthod POST init dans la firebase
    describe("Given I am a user connected as an Employee", () => {
			describe("When I submit new bill", () => {
				test("POST bill to mock API", async () => {
					const newBill = {
						"amount": 200,
						"email": "a@a",
						"name": "test post",
						"vat": "40",
						"fileName": "preview-facture-free-201801-pdf-1.jpg",
						"date": "2002-02-02",
						"commentary": "test2",
						"type": "Restaurants et bars",
						"fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
					}
					const postSpy = jest.spyOn(firebase, "post")
					const postBill = await firebase.post(newBill)

					expect(postSpy).toHaveBeenCalledTimes(1)
					expect(postBill).toBe("Bill test post received.")
				})
			})
		})
  	})
})
