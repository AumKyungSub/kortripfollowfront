import React from 'react'
/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from 'react-router-dom'
// Transition Language
import { useTranslation } from 'react-i18next'
// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
/*------------------------/hooks-----------------------------------*/

// Page css
import './Footer.style.css'

const Footer = () => {
  const {
    isFullMobile /*maxWidth: 767*/
  } = useResponsive();

  const {t} = useTranslation();

  const navigate = useNavigate();

  /* ------------------------ handlers ------------------------ */
  const goTo = (path) => () => navigate(path)

  /* ------------------------ links config ------------------------ */
  const links = [
    {
      key: 'home',
      label: t('menu.home'),
      image: 'logoIcon',
      onClick: goTo('/'),
    },
    {
      key: 'blog',
      label: t('menu.blog'),
      image: 'naverBlogIcon',
      href: 'https://blog.naver.com/tripinsouthkorea',
    },
    {
      key: 'insta',
      label: t('menu.insta'),
      image: 'instaIcon',
      href: 'https://www.instagram.com/kayaum_photo/',
    },
    {
      key: 'youtube',
      label: t('menu.youtube'),
      image: 'youtubeIcon',
      href: 'https://www.youtube.com/@%EA%B5%AD%ED%8A%B8%EB%94%B0%EB%9D%BCKortrip',
    },
    {
      key: 'about',
      label: t('menu.about'),
      image: 'infoIcon',
      onClick: goTo('/about'),
    }
  ]

  return (
    <footer>
            <div className='footerLinkCover'>
              {links.map((link, index) => (
                <React.Fragment key={link.key}>
                  {link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={`/images/logo/${link.image}.png`} alt="Naver Blog" className='footerIcon'/>
                      {isFullMobile && <p>{link.label}</p>}
                    </a>
                  ) : (
                    <a onClick={link.onClick}>
                      <img src={`/images/logo/${link.image}.png`} alt="Naver Blog" className='footerIcon'/>
                      {isFullMobile && <p>{link.label}</p>}
                    </a>
                  )}
                  {!isFullMobile && index < links.length - 1 && ' | '}
                </React.Fragment>
              ))}
            </div>
            {!isFullMobile && 
              <div className='footerTextCover'>
                <p className='warnings subFont'>
                  {t("footer.warning")}
                </p>
                <p className='footerEmail'>
                  {t("footer.email")}: qnzldmad91@gmail.com
                </p>
                <p className='footerCopyRight subFont'>
                  COPYRIGHT&copy; 2025 By Aum Kyung Sub.<br/> All RIGHT's RESERVED
                </p>
              </div>
            }
    </footer> 
  )
}

export default Footer
