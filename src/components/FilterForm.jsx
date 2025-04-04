"use client";

import { useState } from "react";
import "../styles/form.css";

const FilterForm = ({ onFilter, departments, years, sections, subjects }) => {
  const [filters, setFilters] = useState({
    department: "",
    year: "",
    section: "",
    subject: "",
    criteria: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters); // Send filters to the parent component
  };

  return (
    <div className="filter-form">
      <h2>Filter Students</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select id="department" name="department" value={filters.department} onChange={handleChange}>
            <option value="">All</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <select id="year" name="year" value={filters.year} onChange={handleChange}>
            <option value="">All</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="section">Section:</label>
          <select id="section" name="section" value={filters.section} onChange={handleChange}>
            <option value="">All</option>
            {sections.map((section) => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <select id="subject" name="subject" value={filters.subject} onChange={handleChange}>
            <option value="">All</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="criteria">Marks below:</label>
          <input
            type="number"
            id="criteria"
            name="criteria"
            value={filters.criteria}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>

        <button type="submit" className="filter-button">Apply Filters</button>
      </form>
    </div>
  );
};

export default FilterForm;
