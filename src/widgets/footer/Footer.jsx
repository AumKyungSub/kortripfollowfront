import React from 'react'
/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from 'react-router-dom'
// Transition Language
import { useTranslation } from 'react-i18next'
/*------------------------/hooks-----------------------------------*/

// Page css
import './Footer.style.css'

const Footer = () => {
  const {t} = useTranslation();

  const navigate = useNavigate();

  /* ------------------------ handlers ------------------------ */
  const goTo = (path) => () => navigate(path)

  /* ------------------------ links config ------------------------ */
  const links = [
    {
      key: 'about',
      label: t('menu.about'),
      onClick: goTo('/about'),
    },
    {
      key: 'blog',
      label: 'Blog',
      href: 'https://blog.naver.com/tripinsouthkorea',
    },
    {
      key: 'insta',
      label: 'Insta',
      href: 'https://www.instagram.com/kayaum_photo/',
    },
    {
      key: 'youtube',
      label: 'Youtube',
      href: 'https://www.youtube.com/@%EA%B5%AD%ED%8A%B8%EB%94%B0%EB%9D%BC',
    }
  ]

  return (
    <footer>
      <div className='footerCover'>
        <div className='footerLinkCover'>
          {links.map((link, index) => (
            <React.Fragment key={link.key}>
              {link.href ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ) : (
                <a onClick={link.onClick}>
                  {link.label}
                </a>
              )}
              {index < links.length - 1 && ' | '}
            </React.Fragment>
          ))}
        </div>
        <p className='warnings'>
          {t("footer.warning")}
        </p>
        <p className='footerEmail'>
          {t("footer.email")}: qnzldmad91@gmail.com
        </p>
        <p className='footerCopyRight'>
          COPYRIGHT&copy; 2025 By Aum Kyung Sub.<br/> All RIGHT's RESERVED
        </p>
      </div>
    </footer> 
  )
}

export default Footer
