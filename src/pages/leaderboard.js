/* eslint-disable react/no-array-index-key */
import React from 'react'
import Carousel from 'react-multi-carousel'
import PropTypes from 'prop-types'
import Meta from 'src/components/meta/Meta'
import styled from 'styled-components'
import 'react-multi-carousel/lib/styles.css'
import { useLeaderboard } from 'src/hooks/pages/useLeaderboard'
import { toBech32Address } from '@zilliqa-js/zilliqa'
import { useNavbar } from 'src/hooks/components/useNavbar'
import { Modal } from 'react-bootstrap'
import PrimaryButton from 'src/components/button/PrimaryButton'
import Config from 'src/config/config'


const GameWrapper = styled.section`
  margin-top: 110px;
`

const Header = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 79px;
  /* identical to box height, or 198% */

  display: flex;
  align-items: center;
  color: #ffffff;
`

const Card = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  border: 1px solid rgb(57 9 108);
  // background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
  // linear-gradient(93.53deg, #695FDC 4.11%, #6300BB 95.89%);
`

const TextNormal = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
`

const Button = styled.button`
  background: #ffffff;
  border-radius: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 14px 24px;
  height: 50px;
  
  color: #18181b;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  &:hover,
  &:focus{
    outline: 0px !important;
    border: 0px !important;
    box-shadow: none !important;
    background: rgba(105,95,220,1);
    color: white;
  }
  &:disabled:hover,
  &:disabled {
    background: #708090 !important;

    cursor: not-allowed !important;
  }
`

const SliderCardTitle = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 30 px;
  color: #ffffff;
`

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0 16px;
  width: 100%;
  & td,
  & th {
    background: transparent;
    padding: 28px 20px;
    border-bottom: none;
  }
  & th {
    font-style: bold;
    font-weight: 700;
    font-size: 18px;
  }
  & td {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;
    color: #ffffff;
  }

  & td:first-child {
    border-left-style: solid;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  
  & td:last-child {
    border-right-style: solid;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }
  
  & tr {
    background: rgba(0, 0, 0, 0.9);
  }

  & tr.current-user {
    background: rgba(105, 95, 220, 1);
  }
  
  /* & tr.current-user:hover {
    background: rgb(37, 121, 156);
    background: linear-gradient(
      79deg,
      rgba(37, 121, 156, 1) 12%,
      rgba(13, 119, 135, 1) 26%,
      rgba(22, 157, 173, 1) 90%,
      rgba(13, 119, 135, 1) 100%
    );
  } */
  /* & tr:hover {
    background: #6300bb64;
  } */
  & thead tr {
    background: transparent;
  }
  & thead tr:hover {
    background: transparent;
  }
`

const CustomCarousel = styled(Carousel)`
  overflow: visible;
  margin-bottom: 50px;
  .react-multiple-carousel__arrow {
    bottom: -50px;
    z-index: 999;
    border: 1px solid #fff;
  }
  .react-multiple-carousel__arrow:hover {
    background: #2d096acf;
    color: #000;
  }
  .react-multi-carousel-dot-list {
    bottom: -37px;
  }
`

const sliderLabels = {
  mostActive: {
    title: 'Most Active',
    image: '/most-active.svg'
  },
  highestTotalAmounts: {
    title: 'Highest Total Amount',
    image: '/highest-bet.svg'
  },
  biggestSingleAmount: {
    title: 'Biggest Single Amount',
    image: '/highest-bet.svg'
  },
  biggestSale: {
    title: 'Biggest Sale in Single Day',
    image: '/biggest-sale.svg'
  },
  biggestMarketMaker: {
    title: 'Biggest Market Maker',
    image: '/biggest-market-maker.svg'
  },
  biggestDisputor: {
    title: 'Biggest Disputor',
    image: '/biggest-disputor.svg'
  },
  biggestSponsor: {
    title: 'Biggest Sponsor',
    image: '/biggest-sponsor.svg'
  },
  bestHosts: {
    title: 'Best Host',
    image: '/biggest-host.svg'
  },
  Esports: {
    title: 'Best ESports Predictor',
    image: '/biggest-sport-predictor.svg'
  },
  Sports: {
    title: 'Best Sports Predictor',
    image: '/biggest-sport-predictor.svg'
  },
  Science: {
    title: 'Best Science Predictor',
    image: '/biggest-sport-predictor.svg'
  },
  Crypto: {
    title: 'Best Crypto Predictor',
    image: '/biggest-crypto-depositor.svg'
  },
  Politics: {
    title: 'Best Politics Predictor',
    image: '/biggest-political-predictor.svg'
  },
  default: {
    title: 'Best Politics Predictor',
    image: '/biggest-political-predictor.svg'
  }
}

const getSliderLabel = category => sliderLabels[category] || sliderLabels.default

const padZero = (number, length) => {
  if (!number) return '0'.repeat(length)
  let str = number.toString()
  while (str.length < length) {
    str = `0${str}`
  }
  return str
}

const RewardModal = styled(Modal)`
  .modal-content {
    background: radial-gradient(circle at 6.6% 12%, rgb(64, 0, 126) 20.8%, rgb(43 0 85) 100.2%);
    padding: 15px 10px;
  }
  .modal-header {
    height: 40px;
    border: 0px;
    margin: 0px;
    color: #fff;
  }
  .modal-title {
    font-size: 150%;
    font-weight: 500;
  }
  .form-check-label {
    font-size: 80%;
  }
  .modal-body {
    font-size: 130%;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
  }
  .modal-footer {
    display: none;
  }
  h6 {
    margin: 0px;
    font-size: 60%;
    color: #fff;
    text-transform: uppercase;
    font-weight: 300;
  }
  p {
    color: #fff;
    margin: 0px;
    font-size: 80%;
    padding-top: 3px;
    font-weight: 600;
  }
`

const RewardModalContent = ({
  show,
  onHide,
  claimableRewards,
  onRewardClaim
}) => (<RewardModal
  centered
  size="md"
  show={show}
  onHide={onHide}
  backdrop="static"
>
  <Modal.Header closeButton>
    <Modal.Title>
      Claim Rewards
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="d-flex flex-column align-items-start text-light">
      <div className="d-flex flex-column align-items-start mt-4 ">
        Claimable Rewards: {claimableRewards.claimable.toFixed(2)} $BET ({claimableRewards.totalEpoch > 6 ? `6` : claimableRewards.totalEpoch} epochs)
      </div>
      <div className="d-flex flex-column align-items-start mt-4 ">
        Total Unclaimed: {claimableRewards.total.toFixed(2)} $BET ({claimableRewards.totalEpoch} epochs)
      </div>
      <small className="text-light mt-4 mb-4">
        * You can claim up to 6 epochs at once.
      </small>
      <div className="d-flex flex-column align-items-center">
        <PrimaryButton
          height="35px"
          className="mt-4 mt-lg-0"
          disabled={false}
          onClick={onRewardClaim}
          width="240px"
        >
          Claim
        </PrimaryButton>
      </div>
    </div>

  </Modal.Body>
</RewardModal>
)

RewardModalContent.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  claimableRewards: PropTypes.object.isRequired,
  onRewardClaim: PropTypes.func.isRequired
}

function Index() {
  const { leaderboard, trimWallet, timeRemaining, accumulationReward, showClaimReward, setShowClaimReward, claimableRewards, onRewardClaim, network } = useLeaderboard()
  const { walletAddress } = useNavbar()
  return (
    <GameWrapper>
      <Meta
        title="Leaderboard | PredictionDEX"
        description="PredictionDEX is the prediction platform, powered by RedChillies Labs"
        image="https://assets.zilchill.com/PDex.png"
      />
      <RewardModalContent
        show={showClaimReward}
        claimableRewards={claimableRewards}
        onRewardClaim={onRewardClaim}
        onHide={() => setShowClaimReward(false)}
      />
      <div className="d-flex w-100 flex-column mt-3">
        <Header
          className="text-light"
          style={{
            fontSize: '40px'
          }}
        >
          Leaderboard
        </Header>
        <div
          className="d-flex flex-row justify-content-space-between w-100"
          style={{
            marginBottom: '20px',
            gap: '20px'
          }}
        >
          <Card
            className="p-5 w-40 d-flex justify-content-between flex-column"
            style={{
              minWidth: '300px',
              maxHeight: '200px'
            }}
          >
            <TextNormal className="text-light">Welcome Back,</TextNormal>
            <Header className="text-light">
              {trimWallet(walletAddress.bech32)}
            </Header>
          </Card>
          <Card
            className="p-5 d-flex justify-content-between"
            style={{
              flexGrow: 1,
              height: '200px'
            }}
          >
            <div className="d-flex flex-column">
              <Button
                disabled={claimableRewards === 0}
                onClick={() => setShowClaimReward(true)}
              >Claim Your Rewards</Button>
              <div className="pt-3" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px'
              }}>
                <TextNormal className="text-light">Next Reward:</TextNormal>
                <Header className="text-light p-0 m-0 lh-0">{`${timeRemaining.days
                  ? `${padZero(timeRemaining.days, 2)} days `
                  : ''
                  }${padZero(timeRemaining.hours ?? '0', 2)}:${padZero(
                    timeRemaining.minutes ?? '0',
                    2
                  )}:${padZero(timeRemaining.seconds ?? '0', 2)}`}</Header>
              </div>
            </div>
            <div className="d-flex flex-column cursor-pointer">
              <TextNormal
                className="text-light d-flex justify-content-center align-items-center"
                style={{
                  height: '50px'
                }}
              >
                Accumulated Reward:
              </TextNormal>
              <a href={`https://viewblock.io/zilliqa/address/${Config[network].Accumulator.base16.toString().toLowerCase()}?network=${network}&type=tokens`} target="_blank" rel="noreferrer">
                <Header className="text-light">{(accumulationReward || 0).toFixed(2)} $BET</Header>
              </a>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <svg
                width={81}
                height="81"
                viewBox="0 0 81 81"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M77.9941 4.68647C74.4419 4.74951 70.8687 4.68647 67.3164 4.7285C66.7699 4.7285 66.5387 4.6024 66.6438 4.03498C66.6859 3.7828 66.6438 3.5096 66.6648 3.25741C67 0.725807 63.7514 0 61.1977 0H20.3408C17.8192 0 14.4995 0.584449 14.79 3.08928C14.832 3.36249 14.769 3.67772 14.832 3.95092C15.0002 4.6024 14.7479 4.74951 14.1384 4.7285C10.4601 4.70748 6.80276 4.70748 3.12444 4.70748C1.40088 4.7285 0.476044 5.6742 0.476044 7.39747C0.476044 8.76348 0.497063 10.1295 0.476044 11.4955C0.434006 13.8913 0.56012 16.266 1.12763 18.5988C3.56584 28.9174 12.4359 36.567 23.1976 37.5548C23.681 37.5968 24.0594 37.6178 24.4167 38.0802C26.7708 41.2325 29.6084 43.8384 33.2236 45.4776C33.5389 45.6247 33.644 45.7929 33.581 46.1501C33.4759 46.8226 33.4548 47.5161 33.3708 48.1886C32.4249 55.2078 29.6084 61.3654 24.9632 66.7033C24.6451 67.0531 24.9226 67.4809 25.3954 67.4809H40.6635C40.6988 67.4809 40.7293 67.5096 40.7379 67.5438C40.7465 67.5782 40.7772 67.6069 40.8126 67.6068C45.9476 67.5871 51.0825 67.586 56.2174 67.586C56.6728 67.586 56.9818 67.1724 56.6598 66.8504C55.3987 65.5685 54.3687 64.1184 53.4019 62.6263C50.3962 57.9188 48.5675 52.8121 47.979 47.2429C47.8108 45.7719 47.8318 45.7718 49.1771 45.0783C49.4503 44.9312 49.7235 44.7841 49.9968 44.616C52.7923 42.9768 55.0834 40.7702 57.0382 38.2063C57.2694 37.912 57.4375 37.5758 57.942 37.5758C59.098 37.5758 60.233 37.3866 61.347 37.1134C71.289 34.6126 77.7208 28.4971 80.3692 18.5357C80.4277 18.3118 80.4816 18.0867 80.5326 17.8607C80.8713 16.3595 80.9998 14.8177 80.9998 13.2786V10.1989C80.9998 7.72586 80.4668 4.65011 77.9941 4.68647ZM16.0091 30.6827C10.1027 27.4463 6.5085 22.5497 5.39449 15.8877C5.05818 13.8913 5.22634 11.8738 5.1843 9.85629C5.1843 9.54106 5.31041 9.43598 5.60468 9.45699C8.63141 9.45699 11.6792 9.45699 14.7059 9.45699C15.1893 9.45699 15.0842 9.79324 15.1053 10.0454C15.4416 13.3449 15.8619 16.6443 16.5766 19.8807C17.4804 24.0418 18.7626 28.0557 20.6122 31.8806C20.7191 32.13 20.4774 32.3907 20.2145 32.3236C18.6789 31.9315 17.3111 31.3894 16.0091 30.6827ZM50.27 20.28C49.3872 21.1837 48.5044 22.0663 47.6006 22.949C47.3484 23.2012 47.2223 23.4113 47.3064 23.8316C47.5376 24.9875 47.6427 26.1433 47.8739 27.2992C48.2522 29.2746 46.6548 30.7668 44.7631 30.0732C43.565 29.6319 42.472 28.9384 41.3159 28.371C40.9439 28.2057 40.5145 28.2141 40.1398 28.3732C39.1605 28.789 38.2277 29.3123 37.2803 29.8211C36.3134 30.3254 35.3466 30.4305 34.4848 29.779C33.665 29.1696 33.3708 28.2869 33.602 27.2151C33.8542 26.1013 33.9173 24.9454 34.1485 23.8316C34.2536 23.3903 34.0854 23.1591 33.8122 22.8859C32.9504 22.0453 32.1096 21.1837 31.2479 20.343C30.6173 19.7336 30.323 18.998 30.5752 18.1364C30.8485 17.1907 31.458 16.5392 32.467 16.3711C33.5599 16.182 34.6739 16.0349 35.788 15.8877C36.3975 15.8037 36.8389 15.6145 37.0911 14.9841C37.4695 14.0594 38.016 13.2188 38.3943 12.2941C38.6255 11.7687 38.9408 11.4114 39.3191 11.1382C40.149 10.6142 41.2895 10.5442 42.0969 11.1022C42.5007 11.3812 42.812 11.7945 43.0395 12.3361C43.3968 13.1767 43.9223 13.9543 44.2376 14.816C44.5108 15.5515 45.0153 15.7617 45.7089 15.8667C46.8019 16.0138 47.8739 16.182 48.9458 16.3501C49.8917 16.4972 50.4802 17.0856 50.7955 17.9683C51.1318 18.8509 50.9006 19.6285 50.27 20.28ZM72.9706 23.8737C70.0489 28.1608 66.1184 30.9769 61.1158 32.3429C60.8774 32.4224 60.701 32.1874 60.8133 31.9626C60.8679 31.8534 60.9387 31.7514 60.9897 31.6494C63.2808 26.7108 64.7311 21.5409 65.5929 16.161C65.9292 14.0594 66.2024 11.9789 66.3496 9.85629C66.3706 9.49903 66.5387 9.43598 66.833 9.43598C69.8177 9.43598 72.8024 9.43598 75.7871 9.43598C76.1024 9.43598 76.2495 9.47801 76.2705 9.85629C76.4807 14.837 75.8712 19.6075 72.9706 23.8737Z"
                  fill="#E2B030"
                />
                <path
                  d="M40.7062 75.067C40.7062 70.935 44.0769 67.5842 48.2088 67.5763C50.8155 67.5713 53.4223 67.5659 56.029 67.5647C56.6827 67.5644 57.2272 67.8984 57.2272 68.5522C57.2272 70.7588 57.2482 72.9444 57.2272 75.1511C57.2272 75.6554 57.3323 75.8446 57.8577 75.8025C58.4463 75.7605 59.0558 75.7815 59.6654 75.8025C60.9896 75.8236 61.9564 76.8323 61.9564 78.1563C61.9564 79.5013 60.9896 80.531 59.6654 80.531C47.075 80.531 34.4846 80.531 21.8942 80.531C20.507 80.531 19.4771 79.5013 19.4771 78.1773C19.4771 76.8533 20.507 75.8446 21.8942 75.8236C22.6509 75.8025 23.4076 75.8236 24.1643 75.8025C29.419 75.8025 34.6948 75.8025 39.9495 75.8236C40.5381 75.8236 40.7062 75.6554 40.7062 75.067Z"
                  fill="#0E0E0E"
                />
                <path
                  d="M57.227 67.5851C57.227 70.0649 57.185 72.5658 57.248 75.0456C57.2691 75.634 56.8907 75.8022 55.7347 75.8022C47.621 75.7859 39.5073 75.7822 31.3936 75.7814C27.4343 75.781 24.2135 72.5529 24.2482 68.5938C24.2482 67.7614 25.1622 67.459 25.9946 67.459C36.3502 67.459 46.7235 67.459 57.0778 67.459C57.1486 67.459 57.227 67.5142 57.227 67.5851Z"
                  fill="#444340"
                />
                <path
                  d="M50.27 20.2813C49.3872 21.185 48.5044 22.0676 47.6006 22.9503C47.3483 23.2025 47.2222 23.4126 47.3063 23.833C47.5375 24.9888 47.6426 26.1447 47.8738 27.3005C48.2522 29.276 46.6547 30.7681 44.763 30.0746C43.5649 29.6332 42.4719 28.9397 41.3159 28.3723C40.9439 28.207 40.5144 28.2154 40.1397 28.3745C39.1604 28.7903 38.2277 29.3137 37.2802 29.8224C36.3134 30.3268 35.3465 30.4318 34.4847 29.7803C33.665 29.1709 33.3707 28.2882 33.6019 27.2165C33.8542 26.1026 33.9172 24.9468 34.1484 23.833C34.2535 23.3916 34.0854 23.1605 33.8121 22.8873C32.9503 22.0466 32.1096 21.185 31.2478 20.3444C30.6172 19.7349 30.323 18.9994 30.5752 18.1377C30.8484 17.192 31.458 16.5406 32.4669 16.3724C33.5599 16.1833 34.6739 16.0362 35.7879 15.8891C36.3975 15.805 36.8388 15.6159 37.0911 14.9854C37.4694 14.0607 38.0159 13.2201 38.3943 12.2954C38.5747 11.8658 38.8184 11.5416 39.1153 11.2998C40.0052 10.575 41.428 10.5243 42.2939 11.2776C42.6035 11.5471 42.8504 11.9084 43.0395 12.3585C43.3968 13.1991 43.9223 13.9767 44.2375 14.8383C44.5108 15.5738 45.0152 15.784 45.7089 15.8891C46.8019 16.0362 47.8738 16.2043 48.9458 16.3724C49.8916 16.5195 50.4802 17.108 50.7955 17.9906C51.1318 18.8523 50.9006 19.6298 50.27 20.2813Z"
                  fill="#AB8525"
                />
              </svg>
            </div>
          </Card>
        </div>
        <div className="w-full" style={{}}>
          <CustomCarousel
            additionalTransfrom={0}
            containerClass="container-padding-bottom"
            arrows
            autoPlay
            autoPlaySpeed={2000}
            centerMode={false}
            className=""
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
              desktop: {
                breakpoint: {
                  max: 3000,
                  min: 1024
                },
                items: 4,
                partialVisibilityGutter: 40
              },
              mobile: {
                breakpoint: {
                  max: 464,
                  min: 0
                },
                items: 1,
                partialVisibilityGutter: 30
              },
              tablet: {
                breakpoint: {
                  max: 1024,
                  min: 464
                },
                items: 2,
                partialVisibilityGutter: 30
              }
            }}
            rewind
            rewindWithAnimation
            rtl={false}
            shouldResetAutoplay
            showDots
            sliderClass=""
            swipeable
          >
            {leaderboard?.sliderData?.map((item, index) => (
              <Card
                key={index}
                className=""
                style={{
                  minWidth: '300px',
                  height: '155px',
                  padding: '0 27px',
                  margin: '0 10px'
                }}
              >
                <div className="d-flex justify-content-between flex-column">
                  <div
                    className="d-flex flex-row align-items-center"
                    style={{
                      gap: '10px'
                    }}
                  >
                    <img
                      height={32}
                      width={32}
                      src={getSliderLabel(item.type).image}
                      alt=""
                    />
                    <Header className="text-light">{item.winningPoint || item.points}</Header>
                  </div>
                  <SliderCardTitle className="text-light">
                    {trimWallet(toBech32Address(item.user || item.walletAddress), 7)}
                    {/* {toBech32Address(item.user)} */}
                  </SliderCardTitle>
                  <TextNormal className="text-light font-weight-bold">
                    {getSliderLabel(item.type).title}
                  </TextNormal>
                </div>
              </Card>
            ))}
          </CustomCarousel>
        </div>
        <Table className="table table-dark ">
          <thead>
            <tr>
              <th scope="col">Ranking</th>
              <th scope="col">Wallet Address</th>
              <th scope="col">Total Host Count</th>
              <th scope="col">Total Bet Count</th>
              <th scope="col">Potential Rewards</th>
              <th scope="col">Total XP</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.topPlayers.map((item, index) => (
              <tr className={item.isCurrentUser && 'current-user'} key={index}>
                <th scope="row">{item.rank ?? '-'}</th>
                <td>{trimWallet(toBech32Address(item.user))}</td>
                <td>{item.totalHosts ?? '-'}</td>
                <td>{item.totalBets ?? '-'}</td>
                <td>{item?.reward ? `${item.reward} $BET` : '-'}</td>
                <td>{item.winningPoint}</td>
              </tr>
            ))}
            {/* {leaderboard.topPlayers.filter(each=>!each.isCurrentUser).map((item, index) => <tr key={index}>
              <th scope="row">{item.rank}</th>
              <td>{trimWallet(toBech32Address(item.user))}</td>
              <td>{item.host}</td>
              <td>{item.bet}</td>
              <td>100 $BET</td>
              <td>{item.winningPoint}</td>
            </tr>)} */}
          </tbody>
        </Table>
        {/* <img
          src="/ComingSoon.png"
          height="400px"
          width="600px"
          className="img-fluid"
        />
        <h4 className="text-light">Stay Tuned for further updates.</h4> */}
      </div>
    </GameWrapper>
  )
}

export default Index
