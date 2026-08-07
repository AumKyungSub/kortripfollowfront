import React from 'react'

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/

// Page css
import './LocationDetailFees.style.css'

const LocationDetailFees = ({rankingData}) => {
  const {isFullMobile} = useResponsive();
  const { lang, t } = useLanguage();
  const operating = rankingData?.operating;

  const feeInfoList = [
    {
      title: t('locationPage.info.entrance'),
      value: operating?.entranceFee?.[lang]?.length
              ? operating.entranceFee[lang]
              : t('locationPage.info.free')
    }
  ];

  if (operating?.etcFee?.[lang]) {
    feeInfoList.push({
      title: t('locationPage.info.etc'),
      value: operating.etcFee[lang]
    });
  }

  const renderFeeValue = (value) => {
    if (!Array.isArray(value)) {
      return <p className="locationDetailFeesValue">{value}</p>;
    }

    return value.map((item, idx) => {
      if (item.type === 'fee') {
        return (
          <div key={idx} className="locationDetailFeesItem">
            {item.title && (
              <p className="locationDetailFeesItemTitle">{item.title}</p>
            )}
            {item.exp && (
              <p className="locationDetailFeesSubText">{item.exp}</p>
            )}
            {(item.label || item.value) && (
              <div className="locationDetailFeesText">
                <p className="locationDetailFeesLabel">{item.label}</p>
                {item.label && item.value && (
                  <span className="locationDetailFeesDotLine" />
                )}
                <p className="locationDetailFeesItemValue">{item.value}</p>
              </div>
            )}
            {item.exps && (
              <p className="locationDetailFeesSubText">{item.exps}</p>
            )}
          </div>
        );
      }

      if (item.type === 'sub') {
        return (
          <p key={idx} className="locationDetailFeesSubText">
            {item.text}
          </p>
        );
      }

      return null;
    });
  };

  return (
    <>
      <section className="locationDetailFeesWrapper">
        <div className="locationDetailFeesCard">
          <div className="locationDetailFeesCardHeader">
            <p className='title18px20px700'>{t('locationPage.info.fees')}</p>
          </div>
          <div className="locationDetailFeesBody">
            {feeInfoList.map((item) => (
              <div key={item.title} className="locationDetailFeesSection">
                <h5 className="locationDetailFeesTitle">{item.title}</h5>
                <div className="locationDetailFeesList">
                  {renderFeeValue(item.value)}
                </div>
              </div>
            ))}
            <p className="locationDetailFeesWarning subFont">
              * {t('locationPage.info.warning')}
            </p>
          </div>
        </div>
      </section>
      {isFullMobile && <div className="emptyLine"></div>}
    </>
  )
}

export default LocationDetailFees
