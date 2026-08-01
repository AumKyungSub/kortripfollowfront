import React, {useState, useEffect ,useCallback} from 'react'
/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// components
import CollectionDetailPageLinkCard from './components/CollectionDetailPageLinkCard'
import PaginationMethodTwo from '@/widgets/paginationMethodTwo/PaginationMethodTwo'

// Page css
import './CollectionDetailPageLink.style.css'

const imgNumMap = { puzzle: 2, frame: 3, post: 4 };
const keepMap = { puzzle: "keepPuzzle", frame: "keepFrame", post: "keepPostcard" };

const CollectionDetailPageLink = ({ collection }) => {
  const {
          isFullMobile, /*maxWidth: 767*/ 
  } = useResponsive();
  const { t } = useLanguage();

  const PlatformRow = ({ platformName, platformLinks, collection, shopName }) => {
    const rowRef = React.useRef(null);
    // 버튼 비활성화 상태 관리
    const [prevDis, setPrevDis] = useState(true);
    const [nextDis, setNextDis] = useState(true);

    if (!platformLinks) return null;

    const entries = Object.entries(platformLinks);
    if (entries.length === 0) return null;

    // 스크롤 위치 감지하여 버튼 비활성화 여부 업데이트
    const updateScrollButtons = useCallback(() => {
      if (!rowRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;

      // 스크롤 영역이 아예 없거나(카드 수가 적음), 맨 왼쪽일 때 이전 버튼 비활성화
      setPrevDis(scrollLeft <= 1);

      // 1. 스크롤 불가능할 정도로 아이템이 적은 경우 (scrollWidth <= clientWidth + 1)
      // 2. 맨 끝까지 스크롤한 경우 (scrollLeft + clientWidth >= scrollWidth - 1)
      const isEnd = scrollLeft + clientWidth >= scrollWidth - 1;
      const isNotScrollable = scrollWidth <= clientWidth + 1;

      setNextDis(isEnd || isNotScrollable);
    }, []);

    // 💡 이벤트 리스너 등록 및 초기 상태 체크 (핵심 수정 부분)
    useEffect(() => {
      const el = rowRef.current;
      if (!el) return;

      // 렌더링 직후 및 이미지/DOM 로드 시간 고려하여 초기 체크
      updateScrollButtons();

      // 스크롤 및 창 크기 변경 시 감지
      el.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);

      return () => {
        el.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }, [updateScrollButtons, entries.length]);
    // 좌우 스크롤 핸들러 (한 번 클릭 시 316px 이동)
    const handleScroll = (direction) => {
      if (rowRef.current) {
        const scrollAmount = direction === 'prev' ? -316 : 316;
        rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    return (
      <div className="collectionDetailPagePlatform">
        <h4 className="collectionDetailPagePlatformTitle">
          {platformName}
          {!isFullMobile &&
            <span>
              <PaginationMethodTwo
                prev={() => handleScroll('prev')}
                next={() => handleScroll('next')}
                prevDis={prevDis}
                nextDis={nextDis}
              />
            </span>
          }
        </h4>
        <div className="collectionDetailPageCardRowWrapper">
          <div className="collectionDetailPageCardRow" ref={rowRef}>
            {entries.map(([productType, itemData]) => {
              // itemData가 단순 URL 문자열인 경우와 객체인 경우 모두 대응
              const itemUrl = typeof itemData === 'string' ? itemData : itemData?.url;

              return (
                <CollectionDetailPageLinkCard
                  key={productType}
                  collection={collection}
                  itemData={typeof itemData === 'object' ? itemData : null}
                  keep={keepMap[productType] || "keepPuzzle"}
                  num={imgNumMap[productType] || 2}
                  link={() => window.open(itemUrl, "_blank")}
                  shopName={shopName}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="collectionDetailPageLinkWrapper">
      <div className="collectionDetailPageLinkPreTitleCover">
        <p className="preTitle14px600b54a2f">
            <span className="preTitle14px600b54a2fLine"></span>
            {t('preTitle.collectionLink')}
            {isFullMobile &&
              <span className="preTitle14px600b54a2fLine"></span>
            }
        </p>
      </div>
      <div className="collectionDetailPageLinkInner">
        <div className="collectionDetailPageCardCover">
          <PlatformRow platformName={t("collection.banner.zazzle")} platformLinks={collection.zazzle} collection={collection} shopName="zazzle" />
          <PlatformRow platformName={t("collection.banner.mapple")} platformLinks={collection.mapple} collection={collection} shopName="mapple" />
          <PlatformRow platformName={t("collection.banner.redbubble")} platformLinks={collection.redbubble} collection={collection} shopName="redbubble" />
        </div>
      </div>
    </section >
  )
}

export default CollectionDetailPageLink