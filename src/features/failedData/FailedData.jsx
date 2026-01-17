import React from 'react'

//Page css
import './FailedData.style.css'

const FailedData = ({onRetry}) => {
  return (
    <div className="failedData">
      <p className="failedDataText">
        데이터를 불러오지 못했어요.
      </p>

      {onRetry && (
        <button className="failedDataBtn" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  )
}

export default FailedData