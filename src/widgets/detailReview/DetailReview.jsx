import { useEffect, useState } from 'react'

// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
import { API_URL } from '@/shared/config/apiUrl';

// Page css
import './DetailReview.style.css'

const DetailReview = ({data, typeTable, isFullMobile}) => {
    const {lang, t} = useLanguage();
    const [blogState, setBlogState] = useState({ key: null, data: null });

    const hasReview = Boolean(data?.review?.existence && data?.review?.link);
    const reviewKey = typeTable && data?.id ? `${typeTable}:${data.id}` : null;
    const blog = blogState.key === reviewKey ? blogState.data : null;
    const dbURL = API_URL;

    useEffect(() => {
        if (!hasReview || !reviewKey) return undefined;

        const controller = new AbortController();
        const params = new URLSearchParams({
            typeTable,
            otherID: String(data.id),
        });

        const fetchBlog = async () => {
            try {
                const response = await fetch(`${dbURL}/blogs?${params}`, {
                    signal: controller.signal,
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const blogs = await response.json();
                const matchedBlog = Array.isArray(blogs)
                    ? blogs.find((item) => (
                        item.visibility !== false &&
                        item.typeTable === typeTable &&
                        String(item.otherID) === String(data.id)
                    ))
                    : null;

                setBlogState({ key: reviewKey, data: matchedBlog ?? null });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Failed to load review metadata:', error);
                }
            }
        };

        fetchBlog();
        return () => controller.abort();
    }, [data?.id, dbURL, hasReview, reviewKey, typeTable]);

    const reviewDate = blog?.date?.[lang] ?? blog?.date?.ko;

    return (
        <>
            <section className="detailReviewWrapper">
                <div className={`detailReviewCard${hasReview ? ' detailReviewCard--available' : ''}`}>
                    <span className="detailReviewIcon" aria-hidden="true">
                        {hasReview ? (
                            <img src="/images/logo/naverBlogIcon.png" alt="" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                                <path d="M8 8h3v3H8z" />
                                <path d="M14 8h3v3h-3z" />
                            </svg>
                        )}
                    </span>

                    <h3>{t('detailReview.title')}</h3>

                    {hasReview ? (
                        <>
                            {(blog?.stars || reviewDate) && (
                                <div className="detailReviewMeta">
                                    {blog?.stars && (
                                        <span className="detailReviewRating">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                <path d="m12 2.7 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z" />
                                            </svg>
                                            {blog.stars}
                                        </span>
                                    )}
                                    {blog?.stars && reviewDate && <span aria-hidden="true">·</span>}
                                    {reviewDate && <time>{reviewDate}</time>}
                                </div>
                            )}
                            <p>{t('detailReview.description')}</p>
                            <a
                                href={data.review.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="detailReviewAction"
                            >
                                <img src="/images/logo/naverBlogIcon.png" alt="" aria-hidden="true" />
                                {t('detailReview.readReview')}
                            </a>
                        </>
                    ) : (
                        <>
                            <p>{t('detailReview.pending')}</p>
                            <button type="button" className="detailReviewAction" disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="m16.862 3.487 3.651 3.651L8.5 19.151 3 21l1.849-5.5z" />
                                </svg>
                                {t('detailReview.writeReview')}
                            </button>
                        </>
                    )}
                </div>
            </section>
            {isFullMobile && <div className="emptyLine"></div>}
        </>
    )
}

export default DetailReview
