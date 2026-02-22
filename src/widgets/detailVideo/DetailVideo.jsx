import React from 'react'

import { useTranslation } from 'react-i18next';

import './DetailVideo.style.css'

const DetailVideo = ({video, isFullMobile}) => {
  if (!video?.existence || !video?.link) return null;

  const {t} = useTranslation();

  return (
    <>
      <section className="detailVideo">
        {!isFullMobile ?
          <>
            <h4 className='detailTitleMin768'>{t("detailVideo.title")}</h4>
            <div className='emptyLine1px'></div>
          </>
        :
          <>
            <h4 className='detailTitleMax768'>{t("detailVideo.title")}</h4>
          </>
        }
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
      {isFullMobile && <div className='emptyLine'></div>}
    </>
  )
}

export default DetailVideo