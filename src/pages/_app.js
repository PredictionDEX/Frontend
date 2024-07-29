import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { Provider, useSelector } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Layout from 'src/layout/Layout'
import Store from 'src/store/store'
import { useZilpay } from 'src/hooks/mixins/useZilpay'
import Image from 'next/image'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'src/assets/index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'src/assets/swiper.css'
import Script from 'next/script'
import Router from 'next/router'
import NProgress from 'nprogress'


const ToastContainerStyles = styled(ToastContainer)`
  @media only screen and (max-width: 600px) {
    .Toastify__toast-body {
      padding: 1px;
      height: 10px;
    }
  }
`
const MaintainancePage = styled.section`
  height: 100vh;
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h1 {
    color: #fff;
    font-size: 400%;
  }
  h6 {
    color: #fff;
    font-size: 160%;
  }
`

Router.onRouteChangeStart = () => {
  NProgress.start()
}

Router.onRouteChangeComplete = () => NProgress.done()

Router.onRouteChangeError = () => NProgress.done()

function MyApp({ Component, pageProps }) {
  return <>
        {process.env.NEXT_PUBLIC_NETWORK === 'mainnet' && <>\
        <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-X87D9LGNE6"
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X87D9LGNE6', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
        </>}
    { process.env.NEXT_PUBLIC_IN_MAINTAINANCE === 'true' ? (
    <MaintainancePage>
      <Image src="/PredictionDEX.png" height="100px" width="100px" alt="Logo" />
      <h1>PredictionDEX</h1>
      <img src="/UnderMain.gif" className="img-fluid" height="400px" alt='GifMain' />
      <h6 className="text-light">
        We are undergoing a scheduled maintainance on the platform. We will be
        live very soon.
      </h6>
    </MaintainancePage>
  ) : (
    <Provider store={Store}>
      <WalletWrapper>
        <Layout>
          <Component {...pageProps} />
          <ToastContainerStyles />
        </Layout>
      </WalletWrapper>
    </Provider>
  )}
  </>
}

const WalletWrapper = props => {
  const { children } = props
  const { zilPay, watch } = useZilpay()
  const { auth } = useSelector(state => ({
    auth: state.auth
  }))
  const { network, walletAddress } = auth

  useEffect(() => {
    const connection = localStorage.getItem('zilchill-zp')
    if (
      zilPay &&
      zilPay.wallet.isEnable &&
      zilPay.wallet.isConnect &&
      connection
    ) {
      watch()
    }
  }, [network, walletAddress])
  return children
}

MyApp.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired
}

export default MyApp
