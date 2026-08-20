import React from 'react'

// Page css
import './PaginationMethodTwo.style.css'

const PaginationMethodTwo = (props) => {
  return (
    <div className={`homeReviewNavBtnCover ${props.extraClassName}`}>
        <button
            className="homeReviewNavBtn prev"
            onClick={props.prev}
            disabled={props.prevDis}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
            </svg>
        </button>
        <button
            className="homeReviewNavBtn next"
            onClick={props.next}
            disabled={props.nextDis}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        </button>
    </div>
  )
}

export default PaginationMethodTwo