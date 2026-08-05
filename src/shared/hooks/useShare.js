import { useCallback } from 'react';

export const useShare = () => {
    const share = useCallback(async ({
        title,
        text,
        url,
        copiedMessage = 'Link copied.',
    } = {}) => {
        const shareUrl = url ?? window.location.href;
        const shareData = {
            title,
            text,
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return { status: 'shared', method: 'native' };
            }

            await navigator.clipboard.writeText(shareUrl);
            window.alert(copiedMessage);
            return { status: 'shared', method: 'clipboard' };
        } catch (error) {
            if (error.name === 'AbortError') {
                return { status: 'cancelled' };
            }

            console.error('Failed to share:', error);
            return { status: 'failed', error };
        }
    }, []);

    return { share };
};

/*
다른 컴포넌트(페이지)에서는 아래와 같이 사용
import { useShare } from '@/shared/hooks/useShare';

const { share } = useShare();

const handleShare = () => {
    share({
        title: '공유 제목',
        text: '공유할 설명',
        url: 'https://kortripfollow.shop/', // 생략하면 현재 URL (생략하고 메인 페이지에서만 사용)
        copiedMessage: lang === 'ko' ? '링크가 복사되었습니다.' : 'Link copied.',
    });
};

*/