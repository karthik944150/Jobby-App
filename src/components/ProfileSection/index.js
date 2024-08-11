import './index.css'
import {BsSearch} from 'react-icons/bs'

const ProfileSection = props => {
  const {
    profileData,
    employmentTypesList,
    salaryRangesList,
    changeEmploymentType,
    changeSalaryRange,
    activeSalaryRangeId,
    searchInput,
    changeSearchInput,
    enterSearchInput,
  } = props

  const onChangeSearchInput = event => {
    changeSearchInput(event.target.value)
  }

  const onChangeEmployementType = event => {
    changeEmploymentType(event.target.value)
  }
  const onChangeSalaryRange = event => {
    changeSalaryRange(event.target.value)
  }
  const {name, profileImageUrl, shortBio} = profileData
  return (
    <div className="profile-filter-section">
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={onChangeSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={enterSearchInput}
        >
          s
          <BsSearch className="search-icon" />
        </button>
      </div>

      <div className="profile-section">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
      <hr />
      <div className="filter-container">
        <h1 className="filter-header">Type of Employement</h1>
        <ul className="filter-list">
          {employmentTypesList.map(eachEmploymentType => (
            <li
              key={eachEmploymentType.employmentTypeId}
              className="filter-item"
            >
              <input
                type="checkbox"
                id={eachEmploymentType.employmentTypeId}
                value={eachEmploymentType.employmentTypeId}
                onChange={onChangeEmployementType}
                className="input-label"
              />
              <label
                htmlFor={eachEmploymentType.eachEmploymentTypeId}
                className="label-item"
              >
                {eachEmploymentType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <div className="filter-container">
        <h1 className="filter-header">Salary Range</h1>
        <ul className="filter-list">
          {salaryRangesList.map(eachSalaryRange => (
            <li key={eachSalaryRange.salaryRangeId} className="filter-item">
              <input
                type="radio"
                id={eachSalaryRange.salaryRangeId}
                value={eachSalaryRange.salaryRangeId}
                checked={eachSalaryRange.salaryRangeId === activeSalaryRangeId}
                onChange={onChangeSalaryRange}
                className="input-label"
              />
              <label
                htmlFor={eachSalaryRange.salaryRangeId}
                className="label-item"
              >
                {eachSalaryRange.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProfileSection
