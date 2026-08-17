import React, { useEffect } from 'react'
import { useLanguage } from '@/shared/hooks/useLanguage'
import Header from '@/widgets/header/Header'
import Footer from '@/widgets/footer/Footer'
import './LegalPage.style.css'

const CONTACT_EMAIL = 'qnzldmad91@gmail.com'

const koContent = {
  privacy: {
    eyebrow: 'PRIVACY', title: '개인정보처리방침',
    intro: '국트따라(Kortrip, 이하 “서비스”)는 이용자의 개인정보를 중요하게 생각하며, 필요한 범위에서 최소한의 정보만 처리합니다.',
    sections: [
      ['1. 처리하는 개인정보', ['Google 로그인: Google 계정의 고유 식별값, 표시 이름', '네이버 로그인: 네이버 계정의 고유 식별값, 별명', '카카오 로그인: 카카오계정의 고유 식별값, 닉네임', '로그인 세션: 무작위 세션 토큰의 해시값, 사용자 식별값, 생성 시각, 만료 시각', '서비스는 현재 이메일, 비밀번호 및 IP 주소를 회원 데이터베이스에 직접 저장하지 않습니다.', '다만 Netlify, Cloudtype 등 호스팅·네트워크 사업자의 접속 로그에는 보안과 서비스 운영을 위해 IP 주소, 접속 시각, 브라우저 정보 등이 자동 기록될 수 있습니다.']],
      ['2. 처리 목적', ['소셜 로그인 이용자 식별 및 계정 관리', '로그인 상태 유지와 부정 이용 방지', '서비스 안정성 확보 및 오류 대응', '회원 탈퇴 요청 처리']],
      ['3. 보유 및 이용 기간', ['회원 정보: 회원 탈퇴 시까지 보관하며, 탈퇴 시 지체 없이 삭제합니다.', '로그인 세션: 생성일로부터 최대 14일 동안 보관하며, 로그아웃 또는 회원 탈퇴 시 해당 세션을 삭제합니다.', '법령에 별도의 보관 의무가 있는 경우에는 해당 기간 동안 보관할 수 있습니다.', '호스팅 사업자의 접속 로그 보관기간은 각 사업자의 운영 및 개인정보 정책에 따를 수 있습니다.']],
      ['4. 제3자 서비스 및 처리 기반', ['Google OAuth: Google 계정 인증', '네이버 로그인 API: 네이버 계정 인증', '카카오 로그인 API: 카카오계정 인증', 'MongoDB Atlas: 회원 및 세션 데이터 저장', 'Cloudtype: 백엔드 서버 운영', 'Netlify: 프론트엔드 배포, DNS 및 네트워크 제공', '각 서비스 이용 과정에서 해당 사업자의 개인정보처리방침이 함께 적용될 수 있습니다.']],
      ['5. 이용자의 권리', ['이용자는 로그인 후 계정 화면에서 회원 탈퇴를 요청할 수 있습니다.', '회원 탈퇴 시 회원 정보, 모든 로그인 세션, 찜, 여행 코스와 방문 기록이 삭제됩니다.', '소셜 계정 자체의 삭제나 소셜 로그인 연결 해제는 Google·네이버·카카오 등 해당 서비스의 계정 설정에서 별도로 처리할 수 있습니다.', `개인정보 관련 문의는 ${CONTACT_EMAIL}로 접수할 수 있습니다.`]],
      ['6. 개인정보의 안전성 확보 조치', ['비밀번호를 직접 수집하거나 저장하지 않습니다.', '세션 쿠키에 HttpOnly, Secure, SameSite 속성을 적용합니다.', '세션 토큰 원문 대신 해시값을 데이터베이스에 저장합니다.', '환경변수를 통해 데이터베이스와 OAuth 비밀정보를 관리합니다.']],
      ['7. 방침 변경', ['본 방침의 내용이 변경되면 시행 전에 서비스 내에서 알립니다.', '시행일: 2026년 8월 16일']]
    ]
  },
  terms: {
    eyebrow: 'TERMS', title: '이용약관',
    intro: '본 약관은 카윰(Kayaum)이 운영하는 국트따라(Kortrip) 서비스의 이용 조건과 운영자 및 이용자의 권리·의무를 정합니다.',
    sections: [
      ['1. 서비스의 목적', ['서비스는 대한민국 여행지, 사진, 리뷰 및 관련 정보를 제공합니다.', '일부 콘텐츠와 기능은 운영 상황에 따라 추가·변경되거나 종료될 수 있습니다.']],
      ['2. 회원가입 및 계정', ['이용자는 제공되는 소셜 로그인으로 계정을 만들 수 있으며, 최초 로그인 시 회원가입과 로그인이 함께 처리됩니다.', '이용자는 자신의 계정을 안전하게 관리해야 하며, 타인의 계정을 이용해서는 안 됩니다.', '소셜 로그인 제공자의 장애나 정책 변경에 따라 로그인이 일시적으로 제한될 수 있습니다.']],
      ['3. 이용자의 의무', ['서비스 운영을 방해하거나 보안 취약점을 악용해서는 안 됩니다.', '타인의 권리, 개인정보 또는 저작권을 침해해서는 안 됩니다.', '자동화된 비정상 요청, 무단 복제·수집 또는 관련 법령에 위반되는 행위를 해서는 안 됩니다.']],
      ['4. 콘텐츠와 저작권', ['서비스의 사진, 글, 디자인 등 콘텐츠의 저작권은 별도 표시가 없는 한 운영자에게 있습니다.', '사전 허락 없이 콘텐츠를 복제, 배포, 판매하거나 상업적으로 이용할 수 없습니다.', '외부 사이트로 연결되는 콘텐츠에는 해당 사이트의 이용 조건이 적용됩니다.']],
      ['5. 여행 정보 및 외부 링크', ['운영시간, 요금, 위치 등 여행 정보는 변경될 수 있으므로 방문 전에 공식 채널을 통해 다시 확인해야 합니다.', '서비스가 연결하는 외부 웹사이트의 내용, 거래 및 운영에 대해서는 해당 사업자가 책임을 집니다.']],
      ['6. 서비스 이용 제한', ['약관이나 관계 법령을 위반하거나 서비스의 안전한 운영을 방해한 경우 이용을 제한하거나 계정을 삭제할 수 있습니다.', '긴급한 보안 문제가 있는 경우 사전 안내 없이 필요한 보호 조치를 할 수 있습니다.']],
      ['7. 회원 탈퇴', ['회원은 계정 화면에서 언제든지 탈퇴할 수 있습니다.', '탈퇴하면 회원 정보, 모든 로그인 세션, 찜, 여행 코스와 방문 기록이 삭제되며 복구할 수 없습니다.', '탈퇴는 Google 등 소셜 로그인 제공자의 계정 자체를 삭제하지 않습니다.']],
      ['8. 책임 및 문의', ['천재지변, 통신 장애, 외부 서비스 장애 등 합리적으로 통제하기 어려운 사유로 발생한 서비스 중단에 대해서는 관련 법령이 허용하는 범위에서 책임이 제한될 수 있습니다.', `서비스 및 약관 관련 문의: ${CONTACT_EMAIL}`, '시행일: 2026년 8월 16일']]
    ]
  }
}

const enContent = {
  privacy: {
    eyebrow: 'PRIVACY', title: 'Privacy Policy', intro: 'KORTRIP processes only the minimum personal information needed to provide account and login features.',
    sections: [
      ['1. Information we process', ['Google unique account identifier and display name', 'Naver unique account identifier and nickname', 'Kakao unique account identifier and nickname', 'Hashed session token, user identifier, creation time, and expiry time', 'KORTRIP does not currently store member email addresses, passwords, or IP addresses in its application database.', 'Hosting and network providers such as Netlify and Cloudtype may automatically record IP addresses, access times, and browser information in their operational logs.']],
      ['2. Purposes', ['Identify social-login users and manage accounts', 'Maintain login sessions and prevent misuse', 'Maintain service security and respond to errors', 'Process account deletion requests']],
      ['3. Retention', ['Member data is retained until account deletion and is then deleted without undue delay.', 'Login sessions are retained for up to 14 days and are deleted on logout or account deletion.', 'Data may be retained when required by applicable law.', 'Infrastructure log retention may follow each provider’s operational and privacy policies.']],
      ['4. Services used', ['Google OAuth for authentication', 'Naver Login API for authentication', 'Kakao Login API for authentication', 'MongoDB Atlas for member and session storage', 'Cloudtype for backend hosting', 'Netlify for frontend hosting, DNS, and network delivery', 'The privacy policies of these providers may also apply when their services are used.']],
      ['5. Your choices and rights', ['You can delete your account from the account dialog after logging in.', 'Account deletion removes your member data, sessions, saved places, itineraries, and visits.', 'Deleting KORTRIP membership does not delete an account held by Google, Naver, or another social login provider.', `Privacy inquiries: ${CONTACT_EMAIL}`]],
      ['6. Security measures', ['We do not collect or store passwords.', 'Session cookies use HttpOnly, Secure, and SameSite attributes.', 'We store a hash of the session token instead of the raw token.', 'Database and OAuth secrets are managed through environment variables.']],
      ['7. Changes', ['Material changes will be announced through the service before taking effect.', 'Effective date: August 16, 2026']]
    ]
  },
  terms: {
    eyebrow: 'TERMS', title: 'Terms of Service', intro: 'These Terms govern the use of KORTRIP, operated by Kayaum.',
    sections: [
      ['1. Service', ['KORTRIP provides information, photography, and reviews about destinations in South Korea.', 'Features and content may be added, changed, suspended, or discontinued as the service evolves.']],
      ['2. Accounts', ['A social login may create an account automatically on first use.', 'You are responsible for keeping access to your account secure and must not use another person’s account.', 'Login may be temporarily unavailable due to a social provider outage or policy change.']],
      ['3. Acceptable use', ['Do not interfere with service operation or exploit security vulnerabilities.', 'Do not infringe privacy, copyright, or other rights.', 'Do not make abusive automated requests, scrape content without permission, or violate applicable law.']],
      ['4. Content and copyright', ['Unless otherwise stated, photos, text, and design are owned by the operator.', 'Content may not be copied, distributed, sold, or commercially used without prior permission.', 'Third-party destinations are governed by their respective terms.']],
      ['5. Travel information and links', ['Hours, prices, and location information may change. Confirm important details through official sources before visiting.', 'Third-party operators are responsible for external websites and transactions.']],
      ['6. Restrictions', ['Accounts may be restricted or removed for violations of these Terms, applicable law, or service security.', 'Urgent protective action may be taken without prior notice when necessary for security.']],
      ['7. Account deletion', ['You may delete your account at any time from the account dialog.', 'Deletion permanently removes member data, sessions, saved places, itineraries, and visits.', 'It does not delete an account held by Google or another social provider.']],
      ['8. Contact', ['Liability may be limited to the extent permitted by law for events outside reasonable control, including network and third-party service failures.', `Contact: ${CONTACT_EMAIL}`, 'Effective date: August 16, 2026']]
    ]
  }
}

const LegalPage = ({ type }) => {
  const { isKo } = useLanguage()
  const content = (isKo ? koContent : enContent)[type]
  useEffect(() => { window.scrollTo(0, 0) }, [type])
  return (
    <article className="legalPage">
      <Header />
      <main className="legalMain">
        <div className="legalHeading">
          <p className="preTitle14px600b54a2f">
              <span className="preTitle14px600b54a2fLine"></span>
              {content.eyebrow}
          </p>
          <h2 className="title28px40px700">
              {content.title}
          </h2>
          <p className="legalIntro">{content.intro}</p>
        </div>
        <div className="legalContent">
          {content.sections.map(([title, paragraphs]) => 
          <section key={title}>
            <h2>{title}</h2>
            <ul>{paragraphs.map((paragraph) => 
              <li key={paragraph}>{paragraph}</li>)}
            </ul>
          </section>
        )}
        </div>
      </main>
      <Footer />
    </article>
  )
}

export default LegalPage
