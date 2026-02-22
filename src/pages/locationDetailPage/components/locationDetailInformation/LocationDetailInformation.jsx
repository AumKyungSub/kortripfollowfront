import React from 'react'

import { useTranslation } from 'react-i18next';

// Component
import LocationDetailInformationComponent from './LocationDetailInformationComponent'

// Page css
import './LocationDetailInformation.style.css'

const LocationDetailInformation = ({rankingData, isFullMobile, lang}) => {
  const { t } = useTranslation();

  const operating = rankingData?.operating;

  const infoList = [
    {
      icon: '/images/icon/clockIcon.png',
      title: t('locationPage.info.operating'),
      value:
        operating?.operatingHour?.[lang] ||
        t('locationPage.info.allday'),
    },
    {
      icon: '/images/icon/bookingIcon.png',
      title: t('locationPage.info.closedDay'),
      value:
        operating?.closeDay?.[lang] ||
        t('locationPage.info.openAll'),
    },
    {
      icon: '/images/icon/feesIcon.png',
      title: t('locationPage.info.entrance'),
      value:
        operating?.entranceFee?.[lang] ||
        t('locationPage.info.free'),
    },
  ];

  return (
    <>
      <section className='locationDetailInformationWrapper'>
        {!isFullMobile && 
          <>
            <h4 className="detailTitleMin768">{t("locationPage.info.title")}</h4>
            <div className='emptyLine1px'></div>
          </>
        }

        {infoList.map((item, idx) => (
          <React.Fragment key={idx}>
            <LocationDetailInformationComponent {...item} />
            {isFullMobile && idx !== infoList.length - 1 && (
              <div className="emptyLine" />
            )}
          </React.Fragment>
        ))}

        <p className="warningInfo subFont">{t("locationPage.info.warning")}</p>
      </section>
      
      {isFullMobile && <div className="emptyLine"></div>}
    </>
  )
}

export default LocationDetailInformation