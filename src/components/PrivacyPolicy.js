import React from 'react';

const PrivacyPolicy = ({ language }) => {
  const styles = {
    privacyPolicyContainer: {
      backgroundColor: '#333', // Light grey background
      color: '#f0f0f0', // Dark grey text color
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '800px',
      margin: 'auto',
      marginTop: '20px',
      fontFamily: language === 'en' ? 'inherit' :  'Sawarabi Mincho',
    },
    heading: {
      textAlign: 'center',
      fontSize: '24px',
      marginBottom: '20px',
    },
    section: {
      marginBottom: '20px',
    },
  };

  return (
    <div className="privacy-policy" style={styles.privacyPolicyContainer}>
      <h1 style={styles.heading}>{language === 'en' ? 'Privacy Policy' : 'プライバシーポリシー'}</h1>
      <p style={styles.section}>
        {language === 'en' ? (
          <>
            Your privacy is important to us. This privacy policy explains how we collect, use,
            disclose, and safeguard your information when you use our website and Chrome
            extension.
          </>
        ) : (
          <>
            ユーザーのプライバシーは私たちにとって重要です。このプライバシーポリシーは、私たちのウェブサイトとChrome拡張機能を使用する際に、お客様の情報を収集し、使用し、開示し、保護する方法について説明しています。
          </>
        )}
      </p>

      <h2 style={styles.heading}>{language === 'en' ? 'Information We Collect' : '収集する情報'}</h2>
      <p style={styles.section}>
        {language === 'en' ? (
          <>
            We collect information you provide directly to us, such as your email address when
            signing up or your messages when using our chat application. We also collect
            information automatically when you navigate through our website or use our extension,
            such as your IP address and browser type.
          </>
        ) : (
          <>
            私たちは、直接お客様から収集する情報（たとえば、サインアップ時のメールアドレスや、チャットアプリケーションの使用時のメッセージなど）を収集します。また、ウェブサイトを閲覧したり、拡張機能を使用した際に自動的に収集する情報（IPアドレスやブラウザの種類など）もあります。
          </>
        )}
      </p>

      <h2 style={styles.heading}>{language === 'en' ? 'How We Use Your Information' : '情報の利用方法'}</h2>
      <p style={styles.section}>
        {language === 'en' ? (
          <>
            We use the information we collect to provide, maintain, and improve our services,
            personalize your experience, and ensure the security of our platform. Your email
            address is used for communication purposes, and chat message data is securely stored to
            facilitate seamless communication.
          </>
        ) : (
          <>
            収集した情報は、サービスの提供、維持、および改善、ユーザー体験の個別化、およびプラットフォームのセキュリティを確保するために使用します。お客様のメールアドレスはコミュニケーション目的で使用され、チャットメッセージのデータはシームレスなコミュニケーションを促進するために安全に保存されます。
          </>
        )}
      </p>

      <h2 style={styles.heading}>{language === 'en' ? 'Information Sharing' : '情報の共有'}</h2>
      <p style={styles.section}>
        {language === 'en' ? (
          <>
            We do not sell, trade, or otherwise transfer your information to outside parties unless
            we provide you with advance notice. This does not include website hosting partners and
            other parties who assist us in operating our website, conducting our business, or
            serving our users, so long as those parties agree to keep this information
            confidential.
          </>
        ) : (
          <>
            私たちは、お客様の情報を外部の第三者に売却、交換、またはその他の方法で転送することはありません。ただし、事前に通知を行う場合を除きます。これには、ウェブサイトのホスティングパートナーや、私たちのウェブサイトの運営、ビジネスの遂行、またはユーザーへのサービス提供を支援する他のパーティーが含まれますが、これらのパーティーがこの情報を機密情報として保持することに同意する限りです。
          </>
        )}
      </p>

      <h2 style={styles.heading}>{language === 'en' ? 'Contact Us' : 'お問い合わせ'}</h2>
      <p style={styles.section}>
        {language === 'en' ? (
          <>
            If you have any questions about this Privacy Policy, please contact us at
            thomas@vrarri.com.
          </>
        ) : (
          <>
            このプライバシーポリシーに関するご質問がある場合は、thomas@vrarri.com までお問い合わせください。
          </>
        )}
      </p>
    </div>
  );
};

export default PrivacyPolicy;
