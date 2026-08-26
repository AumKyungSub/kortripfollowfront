import { useLanguage } from "@/shared/hooks/useLanguage";

import "./HomePlannerGuide.style.css";

const HomePlannerGuide = () => {
  const { t } = useLanguage();

  const steps = [
    {
      key: "find",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
          <path d="M8.5 11h5M11 8.5v5" />
        </svg>
      ),
    },
    {
      key: "add",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      ),
    },
    {
      key: "plan",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="5.5" width="16" height="14" rx="2" />
          <path d="M8 3v5M16 3v5M4 10h16M8 14h3M8 17h6" />
        </svg>
      ),
    },
  ];

  const openPlanner = () => {
    window.dispatchEvent(
      new CustomEvent("kortrip:open-auth", {
        detail: { redirectPath: "/myTravel?tab=courses" },
      }),
    );
  };

  return (
    <section className="homePlannerGuideBackground contentTopBottomSpacing">
      <div className="homePlannerGuideWrapper contentWidth">
        <div className="homePlannerGuideHeader">
          <div>
            <p className="preTitle14px600b54a2f">
              <span className="preTitle14px600b54a2fLine"></span>
              TRIP PLANNER
            </p>
            <h2 className="title28px40px700">
              {t("homepage.homePlannerGuide.title")}
            </h2>
            <p className="homePlannerGuideDescription">
              {t("homepage.homePlannerGuide.description")}
            </p>
          </div>
          <button
            type="button"
            className="homePlannerGuideCta desktop"
            onClick={openPlanner}
          >
            {t("homepage.homePlannerGuide.cta")}
          </button>
        </div>

        <ol className="homePlannerGuideSteps">
          {steps.map(({ key, icon }, index) => (
            <li key={key} className="homePlannerGuideStep">
              <div className="homePlannerGuideStepTop">
                <span className="homePlannerGuideStepNumber">0{index + 1}</span>
                <span className="homePlannerGuideStepIcon">{icon}</span>
              </div>
              <h3>{t(`homepage.homePlannerGuide.steps.${key}.title`)}</h3>
              <p>{t(`homepage.homePlannerGuide.steps.${key}.description`)}</p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="homePlannerGuideCta mobile"
          onClick={openPlanner}
        >
          {t("homepage.homePlannerGuide.cta")}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
};

export default HomePlannerGuide;
