import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {IoMdStar} from 'react-icons/io'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

// Constants for API status
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetailsList: {},
    similarJobList: [],
    isPlaying: false,
  }

  componentDidMount() {
    this.getEachJobDetails()
  }

  // Fetch job details from the API
  getEachJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedJobDetails = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        id: fetchedData.job_details.id,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        jobDescription: fetchedData.job_details.job_description,
        skills: fetchedData.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: fetchedData.job_details.life_at_company.description,
          imageUrl: fetchedData.job_details.life_at_company.image_url,
        },
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
      }
      const updatedSimilarJobs = fetchedData.similar_jobs.map(
        eachSimilarJob => ({
          companyLogoUrl: eachSimilarJob.company_logo_url,
          id: eachSimilarJob.id,
          employmentType: eachSimilarJob.employment_type,
          jobDescription: eachSimilarJob.job_description,
          rating: eachSimilarJob.rating,
          location: eachSimilarJob.location,
          title: eachSimilarJob.title,
        }),
      )
      this.setState({
        jobDetailsList: updatedJobDetails,
        similarJobList: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  // Render loading view
  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  // Retry fetching job details
  retry = () => {
    this.getEachJobDetails()
  }

  // Render failure view
  renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.retry}
      >
        Retry
      </button>
    </div>
  )

  OnClickPlay = () => {
    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying,
    }))
  }

  // Render job item details success view
  renderJobItemDetailsSuccessView = () => {
    const {jobDetailsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
    } = jobDetailsList
    const {similarJobList} = this.state
    const {title} = similarJobList

    return (
      <div className="job-item-container">
        <div className="list-item">
          <div className="header">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="header-title">
              <h1>{title}</h1>
              <div className="header-rating">
                <IoMdStar className="fa-star" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="details">
            <div className="details-section">
              <div className="details-item">
                <MdLocationOn className="md-location-on" />
                <p className="location">{location}</p>
              </div>
              <div className="details-item">
                <MdWork className="md-work" />
                <p className="employment-type">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="visit-description">
            <h1 className="description-title">Description</h1>
            <a href={companyWebsiteUrl} className="company-link">
              Visit
              <FiExternalLink className="external-link-logo" />
            </a>
          </div>
          <p className="description-text">{jobDescription}</p>

          <div>
            <h1 className="skill-header">Skills</h1>
            <ul className="skills-list">
              {skills.map(eachSkill => (
                <li className="skill-item" key={eachSkill.name}>
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="skill-img"
                  />
                  <p className="skill-name">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company-container">
            <div className="">
              <h1>Life at Company</h1>
              <p>{lifeAtCompany.description}</p>
            </div>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobList.map(eachItem => (
            <SimilarJobs key={eachItem.id} similarJobDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  // Render job item details based on API status
  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobItemDetails()}
        </div>
      </>
    )
  }
}

export default JobsItemDetails
