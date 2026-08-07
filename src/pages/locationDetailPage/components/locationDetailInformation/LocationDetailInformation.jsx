import React from 'react'

/*------------------------custom hooks-----------------------------------*/
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/

// Page css
import './LocationDetailInformation.style.css'

const LocationDetailInformation = ({rankingData}) => {
  const { lang, t } = useLanguage();
  const operating = rankingData?.operating;

  const basicInfoList = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock-icon lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
      title: t('detailPage.location.info.operating'),
      displayType: 'operating',
      value: operating?.operatingHour?.[lang]?.length
              ? operating.operatingHour[lang]
              : t('detailPage.location.info.allday'),
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>,
      title: t('detailPage.location.info.closedDay'),
      value: operating?.closeDay?.[lang]?.length
              ? operating.closeDay[lang]
              : t('detailPage.location.info.openAll'),
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>,
      title: t('detailPage.location.info.address'),
      value: rankingData?.location?.address?.[lang],
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-parking-icon lucide-circle-parking"><circle cx="12" cy="12" r="10"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>,
      title: t('detailPage.location.info.parking'),
      value: rankingData?.parking?.existence
              ? `${rankingData?.parking?.fee ? t("locationPage.parking.paid") 
              : t("locationPage.parking.free")} ${t("locationPage.parking.parkingAvailable")}`
              : t("locationPage.parking.parkingNotAvailable"),
    },
  ];

  const renderOperatingTable = (value) => {
    const operatingItems = value.filter((item) => item.type === 'fee');
    const notes = value.filter((item) => item.type === 'sub');
    let previousTitle = '';

    return (
      <>
        <div className="locationDetailInformationTableCover">
          <table className="locationDetailInformationTable">
            <colgroup>
              <col className="locationDetailInformationCategoryColumn" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">{t('detailPage.common.table.category')}</th>
                <th scope="col">{t('detailPage.common.table.opens')}</th>
                <th scope="col">{t('detailPage.common.table.closes')}</th>
              </tr>
            </thead>
            <tbody>
              {operatingItems.map((item, idx) => {
                if (item.title) previousTitle = item.title;

                const rawValue = [item.label, item.value]
                  .filter(Boolean)
                  .join(' ')
                  .trim();
                const timeRange = rawValue.match(
                  /(\d{1,2}:\d{2})\s*[~～\-–—]\s*(\d{1,2}:\d{2})/
                );
                const additionalCategory = timeRange
                  ? rawValue
                      .replace(timeRange[0], '')
                      .replace(/[()]/g, ' ')
                      .replace(/\s+/g, ' ')
                      .replace(/^[\s\-–—]+|[\s\-–—]+$/g, '')
                      .trim()
                  : '';
                const category = [item.title || previousTitle, additionalCategory]
                  .filter(Boolean)
                  .join(' · ') || '-';
                const rowNote = [item.exp, item.exps].filter(Boolean).join(' ');

                return (
                  <React.Fragment key={idx}>
                    <tr>
                      <td>{category}</td>
                      <td>{timeRange?.[1] || rawValue || '-'}</td>
                      <td>{timeRange?.[2] || '-'}</td>
                    </tr>
                    {rowNote && (
                      <tr className="locationDetailInformationTableNoteRow">
                        <td colSpan="3">{rowNote}</td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {notes.map((item, idx) => (
          <p key={idx} className="locationDetailInformationTableNote">
            * {item.text}
          </p>
        ))}
      </>
    );
  };

  const renderValue = (value, displayType) => {
    if (!Array.isArray(value)) {
      return <p className="locationDetailInformationValue">{value}</p>;
    }

    const isTextArray = value.every(
      (item) => typeof item === 'string' || typeof item === 'number'
    );

    if (isTextArray) {
      return (
        <p className="locationDetailInformationValue">
          {value.filter(Boolean).join(lang === 'ko' ? ' ' : ', ')}
        </p>
      );
    }

    const operatingItemCount = value.filter((item) => item.type === 'fee').length;

    if (displayType === 'operating' && operatingItemCount > 1) {
      return renderOperatingTable(value);
    }

    return value.map((item, idx) => {
      if (item.type === 'fee') {
        return (
          <div key={idx} className="locationDetailInformationItem">
            {item.title && (
              <p className="locationDetailInformationItemTitle">{item.title}</p>
            )}
            {item.exp && (
              <p className="locationDetailInformationSubText">{item.exp}</p>
            )}
            {(item.label || item.value) && (
              <div className="locationDetailInformationText">
                <p>{item.label}</p>
                {item.label && item.value && (
                  <span className="locationDetailInformationDotLine" />
                )}
                <p className="locationDetailInformationItemValue">{item.value}</p>
              </div>
            )}
            {item.exps && (
              <p className="locationDetailInformationSubText">{item.exps}</p>
            )}
          </div>
        );
      }

      if (item.type === 'sub') {
        return (
          <p key={idx} className="locationDetailInformationSubText">
            {item.text}
          </p>
        );
      }

      return null;
    });
  };

  return (
    <section className="locationDetailInformationWrapper">
      <div className="locationDetailInformationCard">
        <div className="locationDetailInformationCardHeader">
          <p className='title18px20px700'>{t('locationPage.info.title')}</p>
        </div>
        <div className="locationDetailInformationCardBody">
          {basicInfoList.map((item) => (
            <div key={item.title} className="locationDetailInformationCover">
              <div className="locationDetailInformationTitleCover">
                <span className="locationDetailInformationIconCover">
                  {item.icon}
                </span>
                <h5 className="locationDetailInformationTitle">{item.title}</h5>
              </div>
              <div className="locationDetailInformationContent">
                <div className="locationDetailInformationTextCover">
                  {renderValue(item.value, item.displayType)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LocationDetailInformation
