import Head from 'next/head'
import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'


const Meta = ({ title, description, keywords, image }) => {
  const router = useRouter()
  const canonical = `https://${process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'staging.' : ''
    }predictiondex.com${router.asPath}`

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        content={
          description || 'PredictionDEX is a web3 betting platform to predict, trade & swap outcomes of future events. Powered by blockchain and BET token.'
        }
        name="description"
      />
      {keywords && <meta content={keywords} name="keywords" />}
      <meta content="follow, index" name="robots" />
      <meta
        name="twitter:card"
        content="summary_large_image
"
      />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={image} name="twitter:image" />
      <meta
        key="twitter:site"
        name="twitter:site"
        content="PredictionDEX is a web3 betting platform to predict, trade & swap outcomes of future events. Powered by blockchain and BET token."
      />

      <link href={canonical} rel="canonical" />
      <meta content={canonical} property="og:url" />
      <meta content={image} property="og:image" />
      <meta property="og:type" content="website" />
      <meta content={title} property="og:title" />
      <meta
        content="1234"
        property="fb:app_id
"
      />
      <meta property="og:site_name" content="PredictionDEX" />
      <meta
        name="og:description"
        property="og:description"
        content={description}
      />
      <link rel="icon" href="/PredictionDEX.png" type="image/x-icon" />
      <link rel="apple-touch-icon" href="/PredictionDEX.png" />
    </Head>
  )
}
Meta.defaultProps = {
  title: '',
  description: '',
  keywords: '',
  image: ''
}
Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string
}

export default Meta
