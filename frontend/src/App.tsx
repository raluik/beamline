import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { io } from "socket.io-client";
import axios from "axios";

import "./App.css";
import { CompanyResultsList } from "./company-results-list";
import { CompanyRelevancyResult } from "./types";
import { Alert, Spinner } from "react-bootstrap";

const ioClient = io(":3000", { transports: ["websocket"] });

function App() {
  const [locations, setLocations] = useState<string>("estonia");
  const [keywords, setKeywords] = useState<string>("green tech");
  const [relevanceKeywords, setRelevanceKeywords] =
    useState<string>("sustainability");
  const [minEmployeeCount, setMinEmployeeCount] = useState<string>("");
  const [maxEmployeeCount, setMaxEmployeeCount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState("");
  const [companyResults, setCompanyResults] = useState<
    CompanyRelevancyResult[]
  >([]);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    ioClient.on("connect", () => {
      console.log("connected");
      ioClient.emit("getState");
      ioClient.on("state", (state: { status: string; statusText: string }) => {
        console.log("STATE:", state);
        setBusy(state.status !== "Idle");
        setStatusText(state.statusText);
      });
    });
  }, []);

  async function handleSearchPressed(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    setLoading(true);
    setCompanyResults([]);
    setTotalCount(undefined);
    setError("");
    const query = {
      locations: locations ? locations.split(',') : undefined,
      keywords: keywords ? keywords.split(',') : undefined,
      relevanceKeywords: relevanceKeywords.split(','),
      minEmployeeCount: minEmployeeCount || undefined,
      maxEmployeeCount: maxEmployeeCount || undefined,
    };
    try {
      const res = await axios<{
        totalCount: number;
        organizations: CompanyRelevancyResult[];
      }>("http://localhost:3000/app/companies", { params: query });
      setCompanyResults(res.data.organizations);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formLocations">
          <Form.Label column sm="2">
            Locations
          </Form.Label>
          <Col sm="10">
            <Form.Control
              disabled={busy}
              placeholder="locations (for Apollo)"
              value={locations}
              onChange={({ target }) => setLocations(target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formKeywords">
          <Form.Label column sm="2">
            Keywords
          </Form.Label>
          <Col sm="10">
            <Form.Control
              disabled={busy}
              placeholder="preliminary search keywords (for Apollo)"
              value={keywords}
              onChange={({ target }) => setKeywords(target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formRelevanceKeywords">
          <Form.Label column sm="2">
            Relevance keywords
          </Form.Label>
          <Col sm="10">
            <Form.Control
              disabled={busy}
              placeholder="relevance keywords"
              value={relevanceKeywords}
              onChange={({ target }) => setRelevanceKeywords(target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formMinEmployeeCount">
          <Form.Label column sm="2">
            Minimum employee count
          </Form.Label>
          <Col sm="10">
            <Form.Control
              disabled={busy}
              type="number"
              placeholder="minimum employee count"
              min={0}
              value={minEmployeeCount}
              onChange={({ target }) =>
                setMinEmployeeCount(+target.value < 0 ? "" : target.value)
              }
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formMaxEmployeeCount">
          <Form.Label column sm="2">
            Maximum employee count
          </Form.Label>
          <Col sm="10">
            <Form.Control
              disabled={busy}
              type="number"
              placeholder="maximum employee count"
              min={0}
              value={maxEmployeeCount}
              onChange={({ target }) =>
                setMaxEmployeeCount(+target.value < 0 ? "" : target.value)
              }
            />
          </Col>
        </Form.Group>
        <Button
          disabled={busy || relevanceKeywords.length === 0}
          variant="primary"
          type="submit"
          onClick={handleSearchPressed}
        >
          <div className="d-flex gap-2 align-items-center ">
            <span>Search</span>
            {loading ? (
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : null}
          </div>
        </Button>
        <br />
        {statusText ? <span>{statusText}</span> : null}
      </Form>
      {error ? (
        <Alert dismissible variant="danger">
          {error}
        </Alert>
      ) : null}
      {totalCount !== undefined ? (
        <span>Found {totalCount} companies</span>
      ) : null}
      {companyResults.length > 0 ? (
        <CompanyResultsList
          companyResults={companyResults}
        ></CompanyResultsList>
      ) : null}
    </div>
  );
}

export default App;
