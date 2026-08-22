import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLanguage } from '@/shared/hooks/useLanguage'
import { API_URL } from '@/shared/config/apiUrl'

import './LoginPage.style.css'

const LoginPage = ({ authUser, isAuthLoading, onClose, onAuthUserChange }) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isDeleteAgreed, setIsDeleteAgreed] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deleteAccountError, setDeleteAccountError] = useState('')
  const [devCredentials, setDevCredentials] = useState({ id: '', password: '' })
  const [devLoginError, setDevLoginError] = useState('')
  const [isDevLoggingIn, setIsDevLoggingIn] = useState(false)
  const isDevLoginEnabled = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_LOGIN === 'true'
  const apiUrl = API_URL
  const navigate = useNavigate()
  const { t, isKo } = useLanguage()

  const closeModal = () => {
    if (isDeletingAccount) return
    setIsDeleteConfirmOpen(false)
    setIsDeleteAgreed(false)
    setDeleteAccountError('')
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeModal()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  const loginWith = (provider) => {
    window.location.assign(`${apiUrl}/auth/${provider}`)
  }

  const loginAsDeveloper = async (event) => {
    event.preventDefault()
    setIsDevLoggingIn(true)
    setDevLoginError('')
    try {
      const response = await fetch(`${apiUrl}/auth/dev-login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(devCredentials),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.authenticated) throw new Error('Development login failed')
      onAuthUserChange(data.user)
      closeModal()
    } catch {
      setDevLoginError(isKo ? '개발자 아이디 또는 비밀번호를 확인해 주세요.' : 'Check the developer ID and password.')
    } finally {
      setIsDevLoggingIn(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      onAuthUserChange(null)
      closeModal()
    }
  }

  const deleteAccount = async () => {
    if (!isDeleteAgreed) return

    setIsDeletingAccount(true)
    setDeleteAccountError('')

    try {
      const response = await fetch(`${apiUrl}/auth/account`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Unable to delete account')

      onAuthUserChange(null)
      onClose()
    } catch {
      setDeleteAccountError(t('header.deleteAccountError'))
    } finally {
      setIsDeletingAccount(false)
    }
  }

  const openPage = (path) => {
    closeModal()
    navigate(path)
  }

  const accountProvider = authUser?.providers?.[0]
  const accountProviderLabel = accountProvider === 'google'
    ? 'Google'
    : accountProvider === 'naver'
      ? (isKo ? '네이버' : 'Naver')
      : accountProvider === 'kakao'
        ? (isKo ? '카카오' : 'Kakao')
        : (isKo ? '소셜' : 'social')

  return (
    <div className="authModalWrapper" role="presentation">
      <button className="authModalOverlay" type="button" aria-label={t('loginModal.closeModal')} />
      <section className="authModal" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
        <div className="authModalHeader">
          <div>
            <span className="preTitle14px600b54a2f">{t('loginModal.preTitle')}</span>
            <h2 id="authModalTitle">{authUser ? t('loginModal.account') : t('loginModal.loginTitle')}</h2>
          </div>
          <button type="button" className="authModalClose" onClick={closeModal} disabled={isDeletingAccount} aria-label={t('loginModal.closeModal')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {isAuthLoading ? (
          <p className="authModalLoading">{t('loginModal.checkingLogin')}</p>
        ) : authUser ? (
          <div className="authAccount">
            <div className="authAccountAvatar" aria-hidden="true">
              {authUser.displayName?.charAt(0) || 'K'}
            </div>
            <p className="authAccountName">
              {authUser.displayName}
            </p>
            <span className="authAccountProvider">
              {authUser.providers.map((provider) => 
              provider === 'naver' ? 'Naver' 
              : provider === 'google' ? 'Google' 
              : provider === 'kakao' ? 'Kakao' 
              : provider).join(' · ')}
            </span>
            <div className="authAccountBtnCover">
              <button type="button" onClick={() => openPage('/myTravel')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase-icon lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                {t('loginModal.myTrip')}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <button type="button" onClick={logout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-right-exit-icon lucide-square-arrow-right-exit"><path d="M10 12h11"/><path d="m17 16 4-4-4-4"/><path d="M21 6.344V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.344"/></svg>
                {t('loginModal.logout')}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
            <button type="button" className="deleteAccountTrigger" onClick={() => setIsDeleteConfirmOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-x-icon lucide-user-round-x"><path d="M2 21a8 8 0 0 1 11.873-7"/><circle cx="10" cy="8" r="5"/><path d="m17 17 5 5"/><path d="m22 17-5 5"/></svg>
                {t('loginModal.deleteAccount')}
            </button>
          </div>
        ) : (
          <div className="socialLoginList">
            <button type="button" className="socialLogin google" onClick={() => loginWith('google')}>
              <span className="socialLoginIcon googleIcon" aria-hidden="true">G</span>
              <span>{t('loginModal.googleLogin')}</span>
            </button>
            <button type="button" className="socialLogin naver" onClick={() => loginWith('naver')}>
              <span className="socialLoginIcon naverIcon" aria-hidden="true">N</span>
              <span>{t('loginModal.naverLogin')}</span>
            </button>
            <button type="button" className="socialLogin kakao" onClick={() => loginWith('kakao')}>
              <span className="socialLoginIcon kakaoIcon" aria-hidden="true">K</span>
              <span>{t('loginModal.kakaoLogin')}</span>
            </button>
            {isDevLoginEnabled && <form className="devLoginForm" onSubmit={loginAsDeveloper}>
              <div className="devLoginDivider"><span>{isKo ? '개발 환경' : 'Development'}</span></div>
              <input
                type="text"
                autoComplete="username"
                placeholder={isKo ? '개발자 아이디' : 'Developer ID'}
                value={devCredentials.id}
                onChange={(event) => setDevCredentials({ ...devCredentials, id: event.target.value })}
                disabled={isDevLoggingIn}
                required
              />
              <input
                type="password"
                autoComplete="current-password"
                placeholder={isKo ? '비밀번호' : 'Password'}
                value={devCredentials.password}
                onChange={(event) => setDevCredentials({ ...devCredentials, password: event.target.value })}
                disabled={isDevLoggingIn}
                required
              />
              {devLoginError && <p className="devLoginError" role="alert">{devLoginError}</p>}
              <button type="submit" className="devLoginButton" disabled={isDevLoggingIn}>
                {isDevLoggingIn ? (isKo ? '로그인 중...' : 'Signing in...') : (isKo ? '개발자로 로그인' : 'Developer login')}
              </button>
            </form>}
          </div>
        )}
        <p className="authModalNotice">
          {t('loginModal.loginNotice')}
          <span className="authPolicyLinks">
            <button type="button" onClick={() => openPage('/terms')}>{t('legalNotice.terms')}</button>
            <button type="button" onClick={() => openPage('/privacy')}>{t('legalNotice.privacy')}</button>
          </span>
        </p>
      </section>
      {isDeleteConfirmOpen && (
        <div className="deleteAccountModalLayer" role="presentation">
          <button
            type="button"
            className="deleteAccountModalOverlay"
            aria-label={t('loginModal.closeModal')}
          />
          <section className="deleteAccountModal" role="alertdialog" aria-modal="true" aria-labelledby="deleteAccountTitle" aria-describedby="deleteAccountDescription">
            <div className="deleteAccountTopCover">
              <div className="deleteAccountAlertIcon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert-icon lucide-shield-alert"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              </div>
              <h2 id="deleteAccountTitle">{t('header.deleteAccountTitle')}</h2>
              <p id="deleteAccountDescription" className="deleteAccountLead">{t('loginModal.deleteAccountLead')}</p>
            </div>

            <ul className="deleteAccountItems">
              {['profile', 'session', 'favorites', 'travelRecords'].map((item) => (
                <li key={item}>
                  <span aria-hidden="true">
                    {
                      item === 'profile' ? <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="7" r="4"/></svg>
                      : item === 'session' ? <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-id-card-icon lucide-id-card"><path d="M16 10h2"/><path d="M16 14h2"/><path d="M6.17 15a3 3 0 0 1 5.66 0"/><circle cx="9" cy="11" r="2"/><rect x="2" y="5" width="20" height="14" rx="2"/></svg> 
                      : item === 'favorites' ? <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg> 
                      : <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-waypoints-icon lucide-waypoints"><path d="m10.586 5.414-5.172 5.172"/><path d="m18.586 13.414-5.172 5.172"/><path d="M6 12h12"/><circle cx="12" cy="20" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="4" cy="12" r="2"/></svg> 
                    }
                  </span>
                  {t(`loginModal.deleteItems.${item}`)}
                </li>
              ))}
            </ul>

            <p className="deleteAccountProviderNotice">
              <span aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert-icon lucide-circle-alert deleteAccountProviderNoticeIcon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </span>
              {t('loginModal.providerNotice', { provider: accountProviderLabel })}
            </p>

            <label className="deleteAccountAgreement">
              <input type="checkbox" checked={isDeleteAgreed} onChange={(event) => setIsDeleteAgreed(event.target.checked)} disabled={isDeletingAccount} />
              <span>{t('loginModal.deleteAgreement')}</span>
            </label>

            {deleteAccountError && <p className="deleteAccountError" role="alert">{deleteAccountError}</p>}
            <div className="deleteAccountActions">
              <button type="button" onClick={() => { setIsDeleteConfirmOpen(false); setIsDeleteAgreed(false); setDeleteAccountError('') }} disabled={isDeletingAccount}>{t('button.cancel')}</button>
              <button type="button" className="deleteAccountDanger" onClick={deleteAccount} disabled={!isDeleteAgreed || isDeletingAccount}>
                {isDeletingAccount ? t('loginModal.deletingAccount') : t('loginModal.confirmDeleteAccount')}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default LoginPage
