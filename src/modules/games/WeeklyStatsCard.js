import React from 'react'
import WeeklyCard from 'src/components/card/WeeklyCard'
import { formatGameNameFromCamelCase } from 'src/utils/utils'

const WeeklyStatsCard = ({ gameName, gamesHosted, betsVolume, betsNumber }) => (
    <WeeklyCard className="card">
      <div className="card-body">
        <div className="row">
          <div className=" d-flex justify-content-center align-items-center justify-content-md-start col-xs-6 col-sm-6 col-md-12 col-lg-3">
            <div className=" d-flex justify-content-center align-items-center  ms-3  mt-md-3">
              <img src={`/${gameName.replace(' ', "")}Icon.png`} height="60px" width="60px" alt="gameImage" />
              <h2 className="ms-3">
                {gameName === 'Worldcup' ? 'World Cup 2022' : formatGameNameFromCamelCase(gameName)}
              </h2>
            </div>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mt-4 mt-lg-0">
            <div className="stats__card">
              <h6>Total Hosted / Week</h6>
              <h4>{gamesHosted}</h4>
            </div>
          </div>
          <div className="col-sm-6 col-md-4 col-lg-3 mt-4 mt-lg-0">
            <div className="stats__card">
              <h6>Volume Traded / Week</h6>
              <h4>{betsVolume} BET</h4>
            </div>
          </div>
          <div className="col-sm-6 col-md-4 col-lg-3  mt-4 mt-lg-0">
            <div className="stats__card">
              <h6>Total Bets / Week</h6>
              <h4>{betsNumber}</h4>
            </div>
          </div>
        </div>
      </div>
    </WeeklyCard>
  )

export default WeeklyStatsCard
