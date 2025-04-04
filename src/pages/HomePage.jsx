import Navbar from "../components/Navbar"
import learningImage from "../assets/learning.jpg"
import "../styles/home.css"

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />

      <div className="home-content">
        <div className="home-text">
          <h1>Welcome to the Slow Learners Tracking System</h1>
          <p>
            Our system helps educators identify and support students who need extra assistance in their academic
            journey. By tracking student performance and progress, we provide valuable insights to improve learning
            outcomes and enhance teaching strategies.
          </p>
          <p>
            Join us in making education more inclusive and effective for all students. Start tracking and improving
            learning today!
          </p>

          <div className="user-roles">
            <div className="role-card">
              <h3>Admin</h3>
              <p>Upload student data from Excel sheets to the database</p>
            </div>

            <div className="role-card">
              <h3>Faculty</h3>
              <p>Filter and identify slow learners based on various criteria</p>
            </div>

            <div className="role-card">
              <h3>Student</h3>
              <p>Check your status and get personalized recommendations</p>
            </div>
          </div>
        </div>

        <div className="home-image">
          <img src={learningImage || "/placeholder.svg"} alt="Students Learning" />
        </div>
      </div>
    </div>
  )
}

export default HomePage

