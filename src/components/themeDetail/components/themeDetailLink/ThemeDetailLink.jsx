import React from 'react'

// Page css
import './ThemeDetailLink.style.css'

const ThemeDetailLink = ({data, isFullMobile}) => {

    const goToHomepage = () => {
        window.open(data?.location?.homepage, "_blank", "noopener,noreferrer");
    }

    const goToInstagram = () => {
        window.open(data?.location?.instagram, "_blank", "noopener,noreferrer");
    }

    return (
        <>
            {isFullMobile && <div className='emptyLine'></div>}
            <section className="themeDetailLinkWholeCover">
                <h1 className='themeDetailLinkH1'>SNS/웹사이트 </h1>
                {!isFullMobile && <div className='emptyLine1px'></div>}
                <div className="themeDetailLinkCover">
                    {data?.location?.homepage &&
                        <span className='themeDetailLinkSpan' onClick={goToHomepage}>
                            <img src="/images/icon/homepageIcon.png" alt="homepage" />
                        </span> 
                    }
                    {data?.location?.instagram &&
                        <span className='themeDetailLinkSpan' onClick={goToInstagram}>
                            <img src="/images/icon/instaIcon.png" alt="instagram" />
                        </span>
                    }
                </div>
                {data?.review?.existence?
                    <a href={data?.review?.link} target="_blank" rel="noopener noreferrer" className='reviewCover'>
                      <span className='reviewPC'>찐리뷰 보러가기</span>
                    </a>
                  : <div>
                    <span className='reviewPCYet'>리뷰가 준비중 입니다</span>
                  </div>
                }
            </section>
        </>
    )
}

export default ThemeDetailLink
