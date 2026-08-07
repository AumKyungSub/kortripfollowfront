import { useState } from 'react'

// Language
import { useLanguage } from '@/shared/hooks/useLanguage';

import './DetailVideo.style.css'

const VIDEO_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

const getYoutubeVideoId = (link = '') => (
  link.match(/\/embed\/([^?&/]+)/)?.[1] ?? null
);

const VideoIframe = ({src, title}) => (
  <iframe
    src={src}
    title={title}
    frameBorder="0"
    allow={VIDEO_ALLOW}
    allowFullScreen
  />
);

const PlayIcon = ({size = 14}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="m8 5 11 7-11 7z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const EmptyVideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="14" x="3" y="5" rx="2" />
    <path d="m10 9 5 3-5 3z" />
    <path d="m4 4 16 16" />
  </svg>
);

const DetailVideo = ({video, data, isFullMobile, variant = 'default'}) => {
  const {lang, t} = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const hasVideo = Boolean(video?.existence && video?.link);
  const isFeatureVariant = variant === 'feature';

  if (!isFeatureVariant) {
    if (!hasVideo) return null;

    return (
      <>
        <section className="detailVideo">
          {!isFullMobile ? (
            <>
              <h4 className="detailTitleMin768">{t('detailVideo.title')}</h4>
              <div className="emptyLine1px"></div>
            </>
          ) : (
            <h4 className="detailTitleMax768">{t('detailVideo.title')}</h4>
          )}
          <div className="detailVideoFrameWrap">
            <div className="detailVideoFrame">
              <VideoIframe src={video.link} title="YouTube video" />
            </div>
          </div>
        </section>
        {isFullMobile && <div className="emptyLine"></div>}
      </>
    );
  }

  const videoId = hasVideo ? getYoutubeVideoId(video.link) : null;
  const thumbnailUrl = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : null;
  const youtubeUrl = videoId
    ? `https://www.youtube.com/shorts/${videoId}`
    : null;
  const autoplayUrl = hasVideo
    ? `${video.link}${video.link.includes('?') ? '&' : '?'}autoplay=1`
    : null;
  const locationName = data?.location?.name?.[lang];
  const playVideo = () => setIsPlaying(true);

  return (
    <>
      <section className="detailVideoFeature">
        <div className="detailVideoFeatureHeading">
          <p className="preTitle14px600b54a2f">
            <span className="preTitle14px600b54a2fLine"></span>
            Links
          </p>
          <p className="title18px20px700">{t('detailVideo.featureTitle')}</p>
        </div>

        <div className="detailVideoFeatureCard">
          <div className="detailVideoFeatureMedia">
            {hasVideo && isPlaying ? (
              <VideoIframe
                src={autoplayUrl}
                title={`${locationName || ''} YouTube Shorts`}
              />
            ) : hasVideo ? (
              <button
                type="button"
                className="detailVideoFeatureThumbnail"
                aria-label={t('detailVideo.play')}
                onClick={playVideo}
              >
                <img src={thumbnailUrl} alt="" />
                <span className="detailVideoFeaturePlayIcon">
                  <PlayIcon size={26} />
                </span>
              </button>
            ) : (
              <div className="detailVideoFeaturePlaceholder" aria-hidden="true">
                <span className="detailVideoFeaturePlaceholderIcon">
                  <EmptyVideoIcon />
                </span>
              </div>
            )}
          </div>

          <div className="detailVideoFeatureContent">
            <span className={`detailVideoFeatureBadge${hasVideo ? '' : ' detailVideoFeatureBadge--pending'}`}>
              {hasVideo ? t('detailVideo.youtubeShorts') : t('detailVideo.pending')}
            </span>
            <h3>
              {hasVideo
                ? t('detailVideo.videoTitle', { name: locationName })
                : t('detailVideo.pendingTitle')}
            </h3>
            <p>
              {hasVideo
                ? t('detailVideo.description')
                : t('detailVideo.pendingDescription')}
            </p>

            {hasVideo && (
              <div className="detailVideoFeatureActions">
                <button type="button" onClick={playVideo}>
                  <PlayIcon />
                  {t('detailVideo.play')}
                </button>
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon />
                  {t('detailVideo.viewOnYoutube')}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
      {isFullMobile && <div className="emptyLine"></div>}
    </>
  )
}

export default DetailVideo
