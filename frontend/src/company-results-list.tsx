import Card from "react-bootstrap/Card"
import Image from 'react-bootstrap/Image';
import { CompanyRelevancyResult } from "./types"
import { getFlagEmoji } from "./utils"
import { Anchor } from "react-bootstrap";

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
                <div className="d-flex flex-row gap-4 align-content-center align-items-center ">
                  <div className="d-flex flex-row gap-4">
                    <div className="d-flex flex-row gap-2 align-items-center ">
                      <Image width="48" height="48" src={companyResult.logo} className="rounded-1 "></Image>
                      <span className="fw-bold">{companyResult.name}</span>
                      <span>{getFlagEmoji(companyResult.country)}</span>
                      <Anchor href={companyResult.website}>{companyResult.website}</Anchor>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row chat gap-2 align-items-center " style={{ backgroundColor: getColorFromScore(companyResult.score) }}>
                <div className="score">{companyResult.score}</div>
                <div className="text-start">{companyResult.explanation}</div>
              </div>
              <div className="text-start">{companyResult.description}</div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}