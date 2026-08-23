import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import Pagination from "@/widgets/pagination/Pagination";
import { ApiError, memberApi } from "@/shared/api/memberApi";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { usePagination } from "@/shared/hooks/usePagination";
import { useResponsive } from "@/shared/hooks/useResponsive";
import "./CourseListPage.style.css";
import "./CourseListActions.style.css";

const copy = {
  ko: {
    eyebrow: "PUBLIC ITINERARIES",
    title: "코스별 여행",
    description:
      "여행자들이 전체 공개한 코스를 둘러보고 새로운 여행 계획을 발견해 보세요.",
    count: "전체 공개 코스",
    author: "작성자",
    places: "장소",
    empty: "아직 전체 공개된 여행 코스가 없습니다.",
    error: "공개 코스를 불러오지 못했습니다.",
    noDescription: "등록된 설명이 없습니다.",
    operator: "운영자 추천",
    member: "회원 추천",
    popular: "인기 추천",
    importCount: "가져오기",
    importCourse: "코스 가져오기",
    alreadyImported: "이미 가져옴",
    importing: "가져오는 중...",
    loginRequired: "코스를 가져오려면 먼저 로그인해 주세요.",
    copyError: "코스를 가져오지 못했습니다.",
  },
  en: {
    eyebrow: "PUBLIC ITINERARIES",
    title: "Travel by course",
    description:
      "Explore public itineraries shared by travelers and discover your next trip.",
    count: "Public courses",
    author: "Author",
    places: "Places",
    empty: "There are no public itineraries yet.",
    error: "Could not load public itineraries.",
    noDescription: "No description provided.",
    operator: "Operator picks",
    member: "Member picks",
    popular: "Popular",
    importCount: "Imports",
    importCourse: "Import course",
    alreadyImported: "Already imported",
    importing: "Importing...",
    loginRequired: "Please sign in before importing a course.",
    copyError: "Could not import the course.",
  },
};

export default function CourseListPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const labels = copy[lang === "ko" ? "ko" : "en"];
  const { isFullMobile, isTablet } = useResponsive();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyingId, setCopyingId] = useState("");
  const [copyError, setCopyError] = useState("");
  const [category, setCategory] = useState("member");
  const pagination = usePagination(
    courses,
    isFullMobile ? 6 : isTablet ? 8 : 9,
    `public-courses-${category}`,
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setCopyError("");
    memberApi(`/itineraries/public?category=${category}`)
      .then((data) => {
        if (active) setCourses(data);
      })
      .catch(() => {
        if (active) setError(labels.error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, labels.error]);

  const importCourse = async (courseId) => {
    setCopyingId(courseId);
    setCopyError("");
    try {
      const copied = await memberApi(`/itineraries/${courseId}/copy`, {
        method: "POST",
      });
      navigate(`/itineraries/${copied._id}`);
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 409) {
        setCourses((items) =>
          items.map((course) =>
            course._id === courseId ? { ...course, imported: true } : course,
          ),
        );
      } else {
        setCopyError(
          requestError instanceof ApiError && requestError.status === 401
            ? labels.loginRequired
            : labels.copyError,
        );
      }
    } finally {
      setCopyingId("");
    }
  };

  return (
    <>
      <Header />
      <main className="publicCoursePage">
        <section className="publicCourseHero">
          <div>
            <span>{labels.eyebrow}</span>
            <h1>{labels.title}</h1>
            <p>{labels.description}</p>
          </div>
        </section>
        <section className="publicCourseContent contentWidth">
          <div className="publicCourseLayout contentTopBottomSpacing">
            <nav className="publicCourseCategories" aria-label={labels.count}>
              {["operator", "member", "popular"].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={category === value ? "active" : ""}
                  onClick={() => setCategory(value)}
                >
                  {labels[value]}
                </button>
              ))}
            </nav>
            <div className="publicCourseResults">
              <div className="publicCourseHeading">
                <h2>{labels[category]}</h2>
                <strong>{courses.length}</strong>
              </div>
              {copyError && (
                <p className="publicCourseCopyError" role="alert">
                  {copyError}
                </p>
              )}
              {loading ? (
                <div className="publicCourseState">Loading...</div>
              ) : error ? (
                <div className="publicCourseState error">{error}</div>
              ) : !courses.length ? (
                <div className="publicCourseState">{labels.empty}</div>
              ) : (
                <>
                  <div className="publicCourseGrid">
                    {pagination.pagedList.map((course) => {
                      const places = (course.days || []).flatMap(
                        (day) => day.places || [],
                      );
                      const cover = places.find(
                        (place) => place.place?.img?.link,
                      );
                      const dates = (course.days || [])
                        .map((day) => day.date?.slice(0, 10))
                        .filter(Boolean)
                        .sort();
                      return (
                        <article className="publicCourseCard" key={course._id}>
                          <Link
                            className="publicCourseCardLink"
                            to={`/itineraries/${course._id}`}
                          >
                            <div className="publicCourseImage">
                              {cover ? (
                                <img
                                  src={`${cover.place.img.link}3R.jpg`}
                                  alt=""
                                />
                              ) : (
                                <div className="publicCourseFallback" />
                              )}
                              <span>
                                {lang === "ko"
                                  ? `장소 ${places.length}개`
                                  : `${places.length} ${labels.places}`}
                              </span>
                              {category === "popular" && (
                                <strong className="publicImportCount">
                                  {labels.importCount} {course.importCount || 0}
                                </strong>
                              )}
                            </div>
                            <div className="publicCourseBody">
                              <div className="publicCourseAuthor">
                                <span>
                                  {course.owner?.displayName?.[0] || "K"}
                                </span>
                                <p>
                                  <small>{labels.author}</small>
                                  <strong>
                                    {course.owner?.displayName ||
                                      "KORTRIP Member"}
                                  </strong>
                                </p>
                              </div>
                              <h3>{course.title}</h3>
                              <p className="publicCourseDescription">
                                {course.description || labels.noDescription}
                              </p>
                              {dates.length > 0 && (
                                <time>
                                  {dates[0]}
                                  {dates.length > 1 ? ` ~ ${dates.at(-1)}` : ""}
                                </time>
                              )}
                            </div>
                          </Link>
                          <div className="publicCourseActions">
                            <button
                              type="button"
                              className={course.imported ? "imported" : ""}
                              disabled={
                                course.imported || copyingId === course._id
                              }
                              onClick={() => importCourse(course._id)}
                            >
                              {course.imported
                                ? labels.alreadyImported
                                : copyingId === course._id
                                  ? labels.importing
                                  : labels.importCourse}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
