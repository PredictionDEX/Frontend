import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import PropTypes from 'prop-types'
import StatsCard from 'src/components/card/StatsCard'
import Meta from 'src/components/meta/Meta'
import { useStats } from 'src/hooks/components/useStats'
import { moneyConversion } from 'src/utils/utils'

const Stats = ({ gameName }) => {
    const { stats, loading, error } = useStats()
    if (loading && !error) {
        return <Skeleton count={5} />
    }
    return (<Row>
        <Meta title={`${gameName} | ZilChill`} />

        <Col sm={6} xs={6} md={3}>
            <StatsCard
                $statsValue={
                    String(
                        stats?.totalFootballHosted +
                        stats?.totalCricketHosted +
                        stats?.totalBasketballHosted + stats?.totalChessHosted
                    ) || 0
                }
                $statsTitle="Total Hosted Games"
                $blue
            />
        </Col>
        <Col sm={6} xs={6} md={3}>
            <StatsCard
                $statsValue={String(stats?.totalBets + stats?.totalChessHosted * 2) || 0}
                $statsTitle="Total Games Played"
            />
        </Col>
        <Col sm={6} xs={6} md={3}>
            <StatsCard
                $statsValue={String(
                    `${moneyConversion(stats?.totalBetted / 10 ** 12)} ZIL`
                )}
                $statsTitle="Total Zil Raised"
                $blue
            />
        </Col>
        <Col sm={6} xs={6} md={3}>
            <StatsCard
                $statsValue={String(
                    `${moneyConversion(stats?.totalDistributePool / 10 ** 12)} ZIL`
                )}
                $statsTitle="Total Prize Distributed"
            />
        </Col>
    </Row>
    )
}
Stats.propTypes = {
    gameName: PropTypes.string.isRequired
}
export default Stats
