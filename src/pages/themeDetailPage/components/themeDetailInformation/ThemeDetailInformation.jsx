import { useTranslation } from 'react-i18next'

// Page css
import './ThemeDetailInformation.style.css'

const TIME_RANGE_PATTERN = /(\d{1,2}:\d{2})\s*[~\-–—]\s*(\d{1,2}:\d{2})/

const parseOperatingData = (operatingItems = []) => {
  const rows = []
  const notes = []

  operatingItems.forEach((item) => {
    if (item?.type === 'note') {
      if (item.text) notes.push(item.text)
      return
    }

    if (item?.type !== 'time') return

    const label = item.label?.toString().trim() ?? ''
    const value = item.value?.toString().trim() ?? ''
    const labelTime = label.match(TIME_RANGE_PATTERN)
    const valueTime = value.match(TIME_RANGE_PATTERN)
    const timeRange = valueTime ?? labelTime

    if (!timeRange) {
      const text = [label, value].filter(Boolean).join(' ')
      if (text) notes.push(text)
      return
    }

    const categorySource = valueTime ? label : ''
    const category = categorySource
      .replace(TIME_RANGE_PATTERN, '')
      .replace(/^[-–—~|·\s]+|[-–—~|·\s]+$/g, '')
      .trim()

    rows.push({
      category: category || '-',
      opens: timeRange[1],
      closes: timeRange[2],
    })

    const extraText = (valueTime ? value.replace(TIME_RANGE_PATTERN, '') : value)
      .replace(/^[-–—~|·\s]+|[-–—~|·\s]+$/g, '')
      .trim()

    if (extraText) notes.push(extraText)
  })

  return {rows, notes}
}

const ThemeDetailInformation = ({data, isFullMobile, lang}) => {
  const {t} = useTranslation()
  const {rows: operatingRows, notes: operatingNotes} = parseOperatingData(
    data?.operating?.[lang],
  )
  const menu = data?.description?.menu?.[lang] ?? []
  const menuRows = menu.filter((item) => item?.name?.trim() && item?.price?.toString().trim())
  const menuNotes = menu.filter((item) => item?.name?.trim() && !item?.price?.toString().trim())

  const goToMenu = () => {
    window.open(data?.description?.menuLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <section className="themeDetailCafeInfoWholeCover">

        {isFullMobile && <div className="emptyLine"></div>}

        <section className="themeDetailInformationCover">
          <p className="preTitle14px600b54a2f">
            <span className="preTitle14px600b54a2fLine"></span>
            Menu
          </p>
          <p className="title18px20px700">{t('themeDetail.tDCI.tDCIHOperating')}</p>

          {operatingRows.length > 0 && (
            <div className="themeDetailOperatingList">
              {operatingRows.map((item, index) => (
                <p key={`${item.category}-${item.opens}-${index}`} className="themeDetailOperatingItem">
                  {item.category !== '-' && (
                    <span className="themeDetailOperatingLabel">{item.category}</span>
                  )}
                  <span className="themeDetailOperatingTime">
                    {item.opens} ~ {item.closes}
                  </span>
                </p>
              ))}
            </div>
          )}

          {operatingNotes.map((note, index) => (
            <p key={`${note}-${index}`} className="themeDetailInformationNote">
              {note.trim().startsWith('*') ? note : `*${note}`}
            </p>
          ))}
        </section>

        {isFullMobile && <div className="emptyLine"></div>}

        <section className="themeDetailInformationCover">
          <p className="preTitle14px600b54a2f">
            <span className="preTitle14px600b54a2fLine"></span>
            Menu
          </p>
          <p className="title18px20px700">{t('themeDetail.tDCI.tDCIHMenu')}</p>

          {menuRows.length > 0 && (
            <div className="themeDetailInformationTableCover">
              <table className="themeDetailInformationTable themeDetailMenuTable">
                <colgroup>
                  <col />
                  <col className="themeDetailMenuPriceColumn" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">{t('themeDetail.tDCI.tDCIHProduct')}</th>
                    <th scope="col">{t('themeDetail.tDCI.tDCIHPrice')}</th>
                  </tr>
                </thead>
                <tbody>
                  {menuRows.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td>{item.name.trim()}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {menuNotes.map((item, index) => (
            <p key={`${item.name}-${index}`} className="themeDetailInformationNote">
              {item.name}
            </p>
          ))}

          {data?.description?.menuLink && (
            <button type="button" className="themeDetailInfoBtn" onClick={goToMenu}>
              {t('themeDetail.tDCI.tDCIHAllMenu')}
            </button>
          )}
        </section>

        {isFullMobile && <div className="emptyLine"></div>}

        <section className="themeDetailInformationCover">
          <p className="preTitle14px600b54a2f">
            <span className="preTitle14px600b54a2fLine"></span>
            Menu
          </p>
          <p className="title18px20px700">{t('themeDetail.tDCI.tDCIHAmenities')}</p>
          
          <div className="themeDetailAmenitiesList">
            {data?.info?.parking && (
              <span className="themeDetailInfoOthersSpan">
                <img src="/images/icon/parkingsIcon.png" alt="" />
                <p>{t('themeDetail.tDCI.tDCIParking')}</p>
              </span>
            )}

            {data?.info?.takeOut && (
              <span className="themeDetailInfoOthersSpan">
                <img src="/images/icon/takeawayIcon.png" alt="" />
                <p>{t('themeDetail.tDCI.tDCITake')}</p>
              </span>
            )}

            {data?.info?.pet && (
              <span className="themeDetailInfoOthersSpan">
                <img src="/images/icon/petIcon.png" alt="" />
                <p>{t('themeDetail.tDCI.tDCIPet')}</p>
              </span>
            )}

            {data?.info?.reserve && (
              <span className="themeDetailInfoOthersSpan">
                <img src="/images/icon/bookingIcon.png" alt="" />
                <p>{t('themeDetail.tDCI.tDCIReserve')}</p>
              </span>
            )}
          </div>
        </section>
      </section>

      {isFullMobile && <div className="emptyLine"></div>}
    </>
  )
}

export default ThemeDetailInformation
