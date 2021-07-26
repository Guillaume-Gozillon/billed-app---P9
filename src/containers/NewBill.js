import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {

    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore

    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)

    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)

    this.fileUrl = null
    this.fileName = null

    new Logout({ document, localStorage, onNavigate })
  }

  handleChangeFile = e => {
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length - 1]

    if (
      !fileName.slice(-4).includes('.png') &&
      !fileName.slice(-4).includes('.jpg') &&
      !fileName.slice(-5).includes('.jpeg')
      ) {
        e.target.value = ''
          return
    }  
    this.firestore.storage
      .ref(`justificatifs/${fileName}`)
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        this.fileUrl = url
        this.fileName = fileName
      }) 
  }

  handleSubmit = e => {
    e.preventDefault()

    if (this.fileName === '') {
      return null
    }

    const email = JSON.parse(localStorage.getItem("user")).email

    const bill = {
      "id": "47qAXb6fIm2zOKkLzMro",
      "vat": "80",
      "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
      "status": "pending",
      "type": "Hôtel et logement",
      "commentary": "séminaire billed",
      "name": "encore",
      "fileName": "preview-facture-free-201801-pdf-1.jpg",
      "date": "2004-04-04",
      "amount": 400,
      "commentAdmin": "ok",
      "email": "a@a",
      "pct": 20
    }

    this.createBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  createBill = bill => {
    if (this.firestore) {
      this.firestore
      .bills()
      .add(bill)
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => error)
    }
  }
}
