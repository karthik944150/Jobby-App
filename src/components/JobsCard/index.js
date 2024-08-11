import './index.css'
import {Link} from 'react-router-dom'
import {IoMdStar} from 'react-icons/io'
import {MdLocationOn, MdWork} from 'react-icons/md'

const JobsCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`}>
      <li className="list-item">
        <div className="header">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />

          <div className="header-title">
            <h1 className="title">{title}</h1>
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
        <h1 className="description-title">Description</h1>
        <p className="description-text">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobsCard
