import React from 'react'

import { useTranslation } from 'react-i18next';

import './DetailVideo.style.css'

const DetailVideo = ({video, isFullMobile}) => {
  if (!video?.existence || !video?.link) return null;

  const {t} = useTranslation();

  return (
    <section className="detailVideo">
      <h2 className={`${isFullMobile ? "detailVideoTitle":"explainNameF"}`}>{t("detailVideo.title")}</h2>
      {!isFullMobile && <div className='emptyLine1px'></div>}
      <div className="detailVideoFrameWrap">
        <div className="detailVideoFrame">
          <iframe
            src={video.link}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            />
        </div>
      </div>
    </section>
  )
}

export default DetailVideo