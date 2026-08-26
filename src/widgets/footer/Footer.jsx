import React from "react";
/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from "react-router-dom";
// Transition Language
import { useTranslation } from "react-i18next";
// (hook) Device Size
import { useResponsive } from "@/shared/hooks/useResponsive";
/*------------------------/hooks-----------------------------------*/

// Page css
import "./Footer.style.css";

const Footer = () => {
  const { isFullMobile /*maxWidth: 767*/ } = useResponsive();

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const navigate = useNavigate();

  /* ------------------------ handlers ------------------------ */
  const goTo = (path) => () => navigate(path);

  const openMyTravel = () => {
    window.dispatchEvent(
      new CustomEvent("kortrip:open-auth", {
        detail: { redirectPath: "/myTravel" },
      }),
    );
  };

  /* ------------------------ links config ------------------------ */
  const links = [
    {
      key: "home",
      label: t("menu.home"),
      image: "logoIcon",
      onClick: goTo("/"),
    },
    {
      key: "blog",
      label: t("menu.blog"),
      image: "naverBlogIcon",
      href: "https://blog.naver.com/tripinsouthkorea",
    },
    {
      key: "insta",
      label: t("menu.insta"),
      image: "instaIcon",
      href: "https://www.instagram.com/kayaum_photo/",
    },
    {
      key: "youtube",
      label: t("menu.youtube"),
      image: "youtubeIcon",
      href: "https://www.youtube.com/@%EA%B5%AD%ED%8A%B8%EB%94%B0%EB%9D%BCKortrip",
    },
    {
      key: "about",
      label: t("menu.about"),
      image: isFullMobile ? "infoIcon" : "infoIconW",
      onClick: goTo("/about"),
    },
  ];

  // li 설정
  const gnbList = [
    {
      key: "region",
      path: "/region",
      startsWith: "/location",
      label: t("footer.region"),
    },
    { key: "season", path: "/season", label: t("footer.season") },
    {
      key: "theme",
      path: "/theme",
      startsWith: "/themeDetail",
      label: t("footer.theme"),
    },
    { key: "courses", path: "/courses", label: t("menu.courses") },
    { key: "myTravel", path: "/myTravel", label: t("menu.myTrip") },
    {
      key: "collection",
      path: "/collection",
      startsWith: "/collection",
      label: t("footer.collection"),
    },
    { key: "about", path: "/about", label: t("footer.about") },
  ];

  return (
    <footer className="contentTopBottomSpacing">
      <div className="footerWrapper contentWidthException">
        <div className="footerLeftCover">
          <div className="logo" onClick={goTo("/")}>
            <img src="/images/logo/logoIcon.png" alt="logoIcon" />
            {lang === "ko" ? (
              <img src="/images/logo/logoText.png" alt="logoText" />
            ) : (
              <img src="/images/logo/logoTextEn.png" alt="logoText" />
            )}
          </div>
          <div className="footerSlogan">
            <p>{t("footer.slogan")}</p>
          </div>
        </div>
        <div className="footerBrowse">
          <p className="footerBrowseTitle">{t("footer.browse")}</p>
          <ul>
            {gnbList.map(({ key, path, label }) => (
              <li
                key={key}
                onClick={key === "myTravel" ? openMyTravel : goTo(path)}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="footerLinkCover">
          <div className="footerEmailCover">
            <p className="footerEmailTitle">Contact</p>
            <p className="footerEmail">
              <img src="/images/icon/mail.png" alt="mail" />
              qnzldmad91@gmail.com
            </p>
          </div>
          {!isFullMobile && (
            <div className="footerLinks">
              {links.map((link) => (
                <React.Fragment key={link.key}>
                  {link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`/images/logo/${link.image}.png`}
                        alt="Naver Blog"
                        className="footerIcon"
                      />
                      {isFullMobile && <p>{link.label}</p>}
                    </a>
                  ) : (
                    <a onClick={link.onClick}>
                      <img
                        src={`/images/logo/${link.image}.png`}
                        alt="Naver Blog"
                        className="footerIcon"
                      />
                      {isFullMobile && <p>{link.label}</p>}
                    </a>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="footerCopyrightTextCover contentWidthException">
        <div>
          <p className="warnings subFont">{t("footer.warning")}</p>
        </div>
        <p className="footerCopyRight subFont">
          COPYRIGHT&copy; 2025 By Aum Kyung Sub. All RIGHT's RESERVED
        </p>
      </div>
      <div className="footerPolicyLinks contentWidthException">
        <button type="button" onClick={goTo("/terms")}>
          {t("footer.terms")}
        </button>
        <button type="button" onClick={goTo("/privacy")}>
          {t("footer.privacy")}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
