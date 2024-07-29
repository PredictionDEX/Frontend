import React from 'react'
import Meta from 'src/components/meta/Meta'

function Index() {
  return (
    <>
      <Meta
        title="PredictionDEX"
        description="PredictionDEX is the prediction platform, powered by RedChillies Labs"
        image="https://assets.zilchill.com/PDex.png"
      />
      <div className="d-flex w-100 justify-content-center align-items-center flex-column">
        <img
          src="/ComingSoon.png"
          height={400}
          width={600}
          className="img-fluid"
          alt="Coming Soon"
        />
        <h4 className="text-light">Stay Tuned for further updates.</h4>
      </div>
    </>
  )
}

export default Index
