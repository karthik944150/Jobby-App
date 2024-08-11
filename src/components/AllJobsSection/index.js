import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import ProfileSection from '../ProfileSection'
import JobsCard from '../JobsCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobsSection extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobsList: [],
    profileData: {},
    activeEmploymentTypeId: [],
    activeSalaryRangeId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getProfile()
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {
      activeEmploymentTypeId,
      activeSalaryRangeId,
      searchInput,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentTypeId}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        id: eachJob.id,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const profileData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileData,
      })
    }
  }

  changeEmploymentType = employmentTypeId => {
    const {activeEmploymentTypeId} = this.state
    let updatedList = activeEmploymentTypeId

    if (activeEmploymentTypeId.includes(employmentTypeId)) {
      updatedList = activeEmploymentTypeId.filter(id => id !== employmentTypeId)
    } else {
      updatedList = [...updatedList, employmentTypeId]
    }

    this.setState({activeEmploymentTypeId: updatedList}, this.getJobs)
  }

  changeSalaryRange = activeSalaryRangeId => {
    this.setState(
      {
        activeSalaryRangeId,
      },
      this.getJobs,
    )
  }

  enterSearchInput = () => {
    this.getJobs()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0
    return shouldShowJobsList ? (
      <div className="all-products-container">
        <ul className="products-list">
          {jobsList.map(job => (
            <JobsCard jobDetails={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {
      profileData,
      activeEmploymentTypeId,
      activeSalaryRangeId,
      searchInput,
    } = this.state
    return (
      <div className="all-jobs-section">
        <ProfileSection
          profileData={profileData}
          employmentTypesList={employmentTypesList}
          salaryRangesList={salaryRangesList}
          changeEmploymentType={this.changeEmploymentType}
          changeSalaryRange={this.changeSalaryRange}
          activeEmploymentTypeId={activeEmploymentTypeId}
          activeSalaryRangeId={activeSalaryRangeId}
          searchInput={searchInput}
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
        />
        {this.renderAllJobs()}
      </div>
    )
  }
}

export default AllJobsSection
