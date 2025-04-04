import Navbar from "../components/Navbar"
import StudentForm from "../components/StudentForm"
import "../styles/form.css"

function FirstYearPage() {
  return (
    <div className="first-year-page">
      <Navbar />
      <StudentForm title="1st Year Student Details" />
    </div>
  )
}

export default FirstYearPage

