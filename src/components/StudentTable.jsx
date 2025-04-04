import "../styles/table.css";

const StudentTable = ({ students, criteria, totalClassSize = 60 }) => {
  if (!students || students.length === 0) {
    return <div className="no-data">No students match the criteria</div>;
  }

  const totalStudents = students.length;
  const slowLearners = students.filter(student => student.marks < criteria).length;
  const percentage = ((slowLearners / totalClassSize) * 100).toFixed(2); // Percentage of slow learners

  return (
    <div className="table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th>Reg. No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Marks</th>
            <th>CGPA</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.regNo}>
              <td>{student.regNo}</td>
              <td>{student.name}</td>
              <td>{student.department}</td>
              <td>{student.marks}</td>
              <td>{student.cgpa.toFixed(2)}</td>
              <td className={student.marks < criteria ? "slow-learner" : "normal"}>
                {student.marks < criteria ? "Slow Learner" : "Normal"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-summary">
        <div className="summary-item">
          <span className="summary-label">Total Students:</span>
          <span className="summary-value">{totalStudents}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Slow Learners:</span>
          <span className="summary-value">{slowLearners}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Slow Learners Percentage:</span>
          <span className="summary-value">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
