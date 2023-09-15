import Card from "react-bootstrap/Card"
import { CompanyRelevancyResult } from "./types"
import { getFlagEmoji } from "./utils"

export interface Props {
  companyResults: CompanyRelevancyResult[]
}

function getColorFromScore(score: number): string {
  // use a color scale from gray to green
  const red = Math.round(255 - score/10 * 255);
  const green = Math.round(score/10 * 255);
  const blue = 0;
  return `rgb(${red},${green},${blue})`;
}

export const CompanyResultsList: React.FunctionComponent<Props> = ({ companyResults }: Props) => {
  return (
    <div className="d-flex flex-column gap-1">
      <span>Showing {companyResults.length} companies</span>
      {companyResults.map((companyResult) => {
        return (
          <Card key={companyResult.name}>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex flex-row gap-2">
                <div className="score" style={{ backgroundColor: getColorFromScore(companyResult.score) }}>{companyResult.score}</div>
                <div className="d-flex flex-row gap-4 align-content-center align-items-center ">
                  <div className="d-flex flex-row gap-4">
                    <div className="d-flex flex-row gap-2">
                      <span>{getFlagEmoji(companyResult.country)}</span>
                      <span className="fw-bold">{companyResult.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-start">{companyResult.explanation}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}