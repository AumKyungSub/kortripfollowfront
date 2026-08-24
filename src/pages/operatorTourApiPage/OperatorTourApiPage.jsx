import { useEffect, useState } from "react";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import { memberApi } from "@/shared/api/memberApi";
import TourApiDraftManager from "./TourApiDraftManager";
import "./OperatorTourApiPage.style.css";
import "./OperatorTourApiSave.style.css";

const idle = { loading: false, error: "" };

const OperatorTourApiPage = () => {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [activeApi, setActiveApi] = useState("tourApi");
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [images, setImages] = useState([]);
  const [placeStatus, setPlaceStatus] = useState(idle);
  const [imageStatus, setImageStatus] = useState(idle);
  const [saveStatus, setSaveStatus] = useState({
    loadingSerial: "",
    savedSerial: "",
    error: "",
  });
  const [draftRefresh, setDraftRefresh] = useState({
    version: 0,
    externalId: "",
  });

  useEffect(() => {
    let active = true;
    memberApi("/auth/session")
      .then((data) => {
        if (active) setSession(data);
      })
      .catch(() => {
        if (active) setSession({ authenticated: false, user: null });
      })
      .finally(() => {
        if (active) setSessionLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const searchPlaces = async (event) => {
    event.preventDefault();
    const query = keyword.trim();
    if (query.length < 2 || placeStatus.loading) return;
    setPlaceStatus({ loading: true, error: "" });
    setSelectedPlace(null);
    setImages([]);
    setSaveStatus({ loadingSerial: "", savedSerial: "", error: "" });
    try {
      const result = await memberApi(
        `/operator/tour-api/places?keyword=${encodeURIComponent(query)}`,
      );
      setPlaces(result.items || []);
      setPlaceStatus(idle);
    } catch (error) {
      setPlaces([]);
      setPlaceStatus({ loading: false, error: error.message });
    }
  };

  const switchApi = source => {
    setActiveApi(source);
    setKeyword("");
    setPlaces([]);
    setSelectedPlace(null);
    setImages([]);
    setPlaceStatus(idle);
    setImageStatus(idle);
    setSaveStatus({ loadingSerial: "", savedSerial: "", error: "" });
  };

  const loadImages = async (place) => {
    if (!place?.externalId || imageStatus.loading) return;
    setSelectedPlace(place);
    setImages([]);
    setSaveStatus({ loadingSerial: "", savedSerial: "", error: "" });
    setImageStatus({ loading: true, error: "" });
    try {
      const result = await memberApi(
        `/operator/tour-api/places/${encodeURIComponent(place.externalId)}/images`,
      );
      setImages(result.items || []);
      setImageStatus(idle);
    } catch (error) {
      setImageStatus({ loading: false, error: error.message });
    }
  };

  const saveDraft = async (image = null) => {
    const withoutImage = !image;
    const requestKey = withoutImage ? "without-image" : image?.serialNumber;
    if (
      !selectedPlace?.externalId ||
      (!withoutImage && !image?.serialNumber) ||
      saveStatus.loadingSerial
    )
      return;
    setSaveStatus({
      loadingSerial: requestKey,
      savedSerial: "",
      error: "",
    });
    try {
      await memberApi(
        `/operator/tour-api/places/${encodeURIComponent(selectedPlace.externalId)}/draft`,
        {
          method: "POST",
          body: withoutImage
            ? { withoutImage: true }
            : { serialNumber: image.serialNumber },
        },
      );
      setSaveStatus({
        loadingSerial: "",
        savedSerial: requestKey,
        error: "",
      });
      setDraftRefresh((value) => ({
        version: value.version + 1,
        externalId: selectedPlace.externalId,
      }));
    } catch (error) {
      setSaveStatus({
        loadingSerial: "",
        savedSerial: "",
        error: error.message,
      });
    }
  };

  let content;
  if (sessionLoading) {
    content = (
      <div className="tourApiNotice">운영자 권한을 확인하고 있습니다.</div>
    );
  } else if (!session?.authenticated) {
    content = (
      <div className="tourApiNotice">로그인 후 사용할 수 있습니다.</div>
    );
  } else if (!session?.user?.isOperator) {
    content = <div className="tourApiNotice">운영자 전용 페이지입니다.</div>;
  } else {
    content = (
      <>
        <nav className="operatorApiTabs" aria-label="외부 장소 API 선택">
          <button type="button" className={activeApi === "tourApi" ? "active" : ""} onClick={() => switchApi("tourApi")}>TOURAPI</button>
          <button type="button" className={activeApi === "manual" ? "active" : ""} onClick={() => switchApi("manual")}>직접 입력</button>
        </nav>
        {activeApi === "tourApi" && <div className="tourApiWorkspace">
          <section className="tourApiPanel">
            <div className="tourApiSectionHeading">
              <span>STEP 1</span>
              <div>
                <h2>관광지 검색</h2>
                <p>장소명을 두 글자 이상 입력하세요.</p>
              </div>
            </div>
            <form className="tourApiSearchForm" onSubmit={searchPlaces}>
              <input
                type="search"
                value={keyword}
                maxLength={50}
                placeholder="예: 경복궁, 감천문화마을"
                onChange={(event) => setKeyword(event.target.value)}
              />
              <button
                type="submit"
                disabled={keyword.trim().length < 2 || placeStatus.loading}
              >
                {placeStatus.loading ? "검색 중" : "검색"}
              </button>
            </form>
            {placeStatus.error && (
              <p className="tourApiError">{placeStatus.error}</p>
            )}
            {!placeStatus.loading &&
              keyword.trim().length >= 2 &&
              !placeStatus.error &&
              !places.length && (
                <p className="tourApiEmpty">검색 결과가 없습니다.</p>
              )}
            <div className="tourApiPlaceList">
              {places.map((place) => (
                <button
                  type="button"
                  key={place.externalId}
                  className={
                    selectedPlace?.externalId === place.externalId
                      ? "selected"
                      : ""
                  }
                  onClick={() => loadImages(place)}
                >
                  <span className="tourApiPlaceThumb">
                    {place.thumbnail ? (
                      <img src={place.thumbnail} alt="" />
                    ) : (
                      <em>NO IMAGE</em>
                    )}
                  </span>
                  <span className="tourApiPlaceBody">
                    <strong>{place.name}</strong>
                    <small>{place.address || "주소 정보 없음"}</small>
                    <small>TourAPI ID {place.externalId}</small>
                  </span>
                  <span className="tourApiPlaceAction">사진·정보 보기</span>
                </button>
              ))}
            </div>
          </section>

          <section className="tourApiPanel">
            <div className="tourApiSectionHeading">
              <span>STEP 2</span>
              <div>
                <h2>제1유형 사진</h2>
                <p>사용 가능한 사진만 표시합니다.</p>
              </div>
            </div>
            {!selectedPlace && (
              <p className="tourApiEmpty">
                먼저 검색 결과에서 장소를 선택하세요.
              </p>
            )}
            {selectedPlace && (
              <div className="tourApiSelectedPlace">
                <strong>{selectedPlace.name}</strong>
                <span>{selectedPlace.address}</span>
              </div>
            )}
            {imageStatus.loading && (
              <p className="tourApiEmpty">사진을 불러오고 있습니다.</p>
            )}
            {imageStatus.error && (
              <p className="tourApiError">{imageStatus.error}</p>
            )}
            {saveStatus.error && (
              <p className="tourApiError">{saveStatus.error}</p>
            )}
            {saveStatus.savedSerial && (
              <p className="tourApiSuccess">
                {saveStatus.savedSerial === "without-image"
                  ? "사진 없이 장소 정보를 초안으로 저장했습니다. 나중에 제1유형 사진이 생기면 다시 저장할 수 있습니다."
                  : "초안으로 저장했습니다. 같은 장소를 다시 저장하면 선택 사진이 변경됩니다."}
              </p>
            )}
            {selectedPlace &&
              !imageStatus.loading &&
              !imageStatus.error &&
              !images.length && (
                <div className="tourApiNoImage">
                  <p>사용 가능한 제1유형 사진이 없습니다.</p>
                  <button
                    type="button"
                    onClick={() => saveDraft()}
                    disabled={Boolean(saveStatus.loadingSerial)}
                  >
                    {saveStatus.loadingSerial === "without-image"
                      ? "정보 가져오는 중"
                      : saveStatus.savedSerial === "without-image"
                        ? "정보 저장됨"
                        : "사진 없이 정보 가져오기"}
                  </button>
                  <small>장소 정보와 좌표만 초안으로 저장하고 대체 이미지를 표시합니다.</small>
                </div>
              )}
            <div className="tourApiImageGrid">
              {images.map((image) => (
                <article key={image.serialNumber || image.originalUrl}>
                  <a href={image.originalUrl} target="_blank" rel="noreferrer">
                    <img
                      src={image.thumbnailUrl}
                      alt={image.name || selectedPlace?.name || "관광사진"}
                    />
                  </a>
                  <div>
                    <strong>{image.name || selectedPlace?.name}</strong>
                    <small>사진 제공: {image.provider}</small>
                    <small>공공누리 제1유형 · {image.copyrightType}</small>
                    <button
                      type="button"
                      onClick={() => saveDraft(image)}
                      disabled={Boolean(saveStatus.loadingSerial)}
                    >
                      {saveStatus.loadingSerial === image.serialNumber
                        ? "검증·저장 중"
                        : saveStatus.savedSerial === image.serialNumber
                          ? "저장됨"
                          : "이 사진 저장"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>}
        <TourApiDraftManager refreshRequest={draftRefresh} source={activeApi} />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="operatorTourApiPage">
        <section className="tourApiHero">
          <span>OPERATOR TOOL</span>
          <h1>장소 등록 관리</h1>
          <p>
            TourAPI 관광정보를 가져오거나 장소 정보를 직접 입력해 관리합니다.
          </p>
        </section>
        {content}
      </main>
      <Footer />
    </>
  );
};

export default OperatorTourApiPage;
