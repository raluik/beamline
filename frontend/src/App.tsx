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

/*
locations
keywords
chatGptKeywords
minEmployeeCount
maxEmployeeCount
*/

const TEST_DATA: CompanyRelevancyResult[] = [
  {
    name: "Let's Do It World",
    industry: "civic & social organization",
    country: "Estonia",
    seo: "Join the movement for clean planet! Register your organisation to create cleanup events, join cleanup events and help make a change for a better world. Be an example.",
    description:
      "Let's Do It World is the world's biggest civic movement, including over 190 countries and millions of volunteers, whom all stand for a cleaner world. \n\nWorld Cleanup Day is an annual event organized by Let's Do It World. The next World Cleanup Day will take place on the 16th of September 2023, when once again millions of people will unite together to take another step towards a cleaner world.",
    score: 6,
    explanation:
      "The company focuses on civic and social organization and aims to create a cleaner world through cleanup events and promoting environmental change.",
  },
  {
    name: "The Oceancy",
    industry: "nonprofit organization management",
    country: "Estonia",
    seo: "Our mission is to teach, train and empower individuals, communities, and companies to take the next right steps in saving our oceans by carrying out restoration projects and promoting sustainable tourism while spreading oceanic conservation awareness through educational activities and scientific research.",
    description:
      "We are an international NGO that directly carries out conservation and restoration projects through practical and direct action in collaboration with our experienced marine biologists and communities all around the world. We currently have coral reef, mangrove forest, and seagrass bed restoration projects in many countries around the globe.\n\nWe also promote sustainable guidelines for and certify tourist attractions, activities, and amenities (hotels, resorts, dive centers, whale-watching boats, etc.) in sustainability, and help them in their endeavors to become global leaders in sustainable tourism.\n\nWe initiate further action by educating our audiences about ocean conservation topics, to promote the highest green standards and inspire positive environmental change on a global scale.\n\nOur Mission:\nOur mission is to teach, train and empower individuals, communities, and companies to take the next right steps in saving our oceans by carrying out restoration projects and promoting sustainable tourism while spreading oceanic conservation awareness through educational activities and scientific research.\n\nOur Vision:\nWe believe that empowering local, and often underrepresented, communities to directly carry out and manage their own ecosystem restoration projects can be a leading force towards combating climate change, building up communities, and empowering everyone to protect our planet.\n\nAt the Oceancy we believe that sustainability is a key component of our future. We are passionate about working towards a new era where the protection of nature and wildlife has a predominant role in our daily lives. Our number one enemy as a species and a planet is climate change. We know that all of this is no simple task, but we believe that we can win this battle if we act together, now!\n\nJoin our community at the Oceancy to re-think and design a new way of combatting problems like climate change through direct action towards sustainability.",
    score: 7.5,
    explanation:
      "The company is a nonprofit organization management that carries out conservation projects and promotes sustainable tourism while spreading oceanic conservation awareness.",
  },
  {
    name: "Askel Sustainability Solutions",
    industry: "environmental services",
    country: "United States of America",
    seo: "We are a sustainability reporting and ESG compliance agency providing solutions for all your corporate sustainability requirements.",
    description:
      "We are a sustainability reporting and ESG compliance agency providing end-to-end solutions for sustainability reporting, ESG due diligence, drafting of corporate policies, whistleblowing channel services, and related trainings.",
    score: 5,
    explanation:
      "The company provides sustainability reporting and ESG compliance solutions, aligning with the energy efficiency theme.",
  },
  {
    name: "Group Futurista",
    industry: "events services",
    country: "Estonia",
    seo: "",
    description:
      "The 21st century has seen a complete change in the way life operates on this planet. We are at the cusp of the 4th Industrial Revolution that will be based on the code, data or information based social and economic system. In the digital age of intelligent machines, rampant mechanization and automation of all biological and physical phenomena, technology is literally a body invader, penetrating consciousness, reshaping perception, circulating bodies and desire in cybernetic loops of information. Human subjectivity has become so deeply and inextricably embedded with technology that the 'post human'​ is born at the interstices of data and flesh, erasing the traditional demarcation between man and machine. This calls for alternative ways of thinking about humanity and its environments, new way of embracing change and a new way of understanding ourselves.\nWith diminishing workforce and rise of the machines in different sectors, a range of innovations in different sectors have come in the market that was only a dream few years ago. For example, Designer DNA's, Precision Medicine, Digital Health, AI, Blockchain Based Systems, Clinical Wearables in Pharmaceuticial/ Medicine industry. Autonomous Cars, Hyperloop Trains, computer driven pods, Flying Taxis, Renewable energy, energy storage, and much more.\nIndustry 4.0. is propositioned on developments that will call for these unprecedented changes in processes and businesses which in turn will affect law, politics, relationships. To tackle these changes, our events will invite leading entrepreneurs, vendors, scientists, innovators, futurists and industry experts from global organizations, institutions and universities to share case studies, research and technological innovations. These changes would require us to integrate cutting-edge technology and science with humanities and think about major world issues from a broader lens that cover such ideas.",
    score: 4,
    explanation:
      "The company provides events services and focuses on innovation and technological advancements that promote energy efficiency.",
  },
  {
    name: "Impact Day",
    industry: "events services",
    country: "Estonia",
    seo: "The largest sustainability festival in the Baltics with over 2000 participants. Impact Day 2023 takes place on the 5-6 October in Tallinn, Estonia.",
    description:
      "Impact Day is the largest sustainability festival in the Baltics, where you will find like-minded people, fresh ideas and knowledge on how to go even further with your words and actions.\n\nThe festival brings together people who want to act for a better life around us, people who are really taking steps towards a better future. It truly is a pinnacle event of social entrepreneurship.\n\nImpact Day will feature various practical workshops, discussions, panels, and pitching competitions. The event culminates with an awesome cultural program.\n\nReasons to be here:\n\n➖ Get inspired. Prepare yourself for some really great examples and case studies from both Estonian and foreign experts.\n➖ Acquire new skills. One of the three stages is completely dedicated to the development of you (and/or the company)!\n➖ Networking & collaborations. Meet (social) entrepreneurs, investors, interested parties as well as organizers of various development programs.\n➖ Advertise your activities among others. Come and charm the Impact Day participants with your fascinating influential solutions!\n➖ Be a part of like-minded people: you don't have to feel like a single worrier and alone with your great ideas - in Põhjala tehas you are surrounded by like-minded people.\n➖ Understand how you can make an even greater positive impact. For example do you know all the aspects of keeping your (business') ecological footprint as small as possible and how to make activities more responsible?\n\nIn numbers:\n\n⭐ October 5-6, 2023 at Tallinn\n⭐ Created together by 30+ organizations\n⭐ 3 stages full of inspiring content\n⭐ Over 100 brilliant speakers\n⭐ Impact Show\n\nAct for impact!",
    score: 7,
    explanation:
      "The company is the largest sustainability festival in the Baltics, promoting social entrepreneurship and offering workshops and discussions on sustainable practices.",
  },
  {
    name: "Fab City Foundation",
    industry: "architecture & planning",
    country: "Estonia",
    seo: "Join Fab City Global Initiative. Learn about the sustainable cities movement to get involved in shaping the future of urban innovation.",
    description:
      "Fab City started as a challenge for a city to produce (almost) everything it consumes. The provocation has grown into a global movement, which is facilitated by the Fab City Foundation, a Network of 41 cities and a Collective of experts.\n\nThe Fab City Foundation supports the Fab City global initiative through the development of projects and educational programs that are focused on building the capacity of cities and their communities. Based in e-Estonia, the Foundation is location independent and supports distributed programs and projects the world over.",
    score: 8.5,
    explanation:
      "The company promotes sustainable cities and supports the development of projects and educational programs focused on urban innovation.",
  },
  {
    name: "AS Graanul Invest",
    industry: "oil & energy",
    country: "Estonia",
    seo: "Graanul Invest is world leading biomass and bioenergy producer. We believe that our leadership in biomass is key to meeting the global climate challenge.",
    description:
      "Graanul Invest is world leading biomass and bioenergy producer. We believe that our leadership in biomass is key to meeting the global climate challenge.\n\nGraanul Invest Group has been developing the bioenergy field for over 18 years and lead the industry with some of the most advanced process and technologies.\n\nGraanul Invest is an international group with 12 modern pellets plants in the Baltics and US and six combined heat-and power plants in Estonia and Latvia. The Group employs 500 people.\n\nGraanul Invest is the most reliable biomass and bioenergy producer and supplier in the world.",
    score: 9,
    explanation:
      "The company is a leading biomass and bioenergy producer, actively working towards meeting the global climate challenge and promoting renewable energy.",
  },
  {
    name: "Fairown",
    industry: "information technology & services",
    country: "Estonia",
    seo: "Fairown is a fintech company helping banks, brands, and retailers offer products as a service. Unlike BNPL solutions, we provide a unique payment platform, which allows environmentally conscious businesses to offer products for monthly subscriptions, and manage product renewal cycles.",
    description:
      "Fairown is a fintech company that helps banks, brands, and retailers offer products as a service. Fairown provides a unique payment platform, allowing environmentally conscious businesses to offer products for monthly subscriptions, and manages product renewal cycles. The platform enables companies to increase sales and improve customer loyalty in a sustainable way. \n \nFairown currently operates in eight markets across Europe. Its service is used by over 50,000 consumers. Fairown's customers include multinational technology company Apple, German power tools manufacturer STIHL, and Komplett, the largest e-commerce player in the Nordics, amongst other leading brands that are shifting from a linear to a circular economy. Fairown's subscription service is awarded by leading financial experts at Asset Finance Connect.",
    score: 6.5,
    explanation:
      "The company is a fintech company that helps businesses offer products as a service, promoting a circular economy and sustainable consumption.",
  },
  {
    name: "Innopolis Engineering™ (EE)",
    industry: "civil engineering",
    country: "Estonia",
    seo: "Innopolis Engineering is a Scandinavian & Baltic Architecture and Engineering Company.",
    description:
      "Innopolis Engineering™ is a Nordic & Baltic Architecture and Engineering Company. We specialize in providing full-service digital construction design solutions in Nordic and Baltic region. During the last 15 years we have designed a small cities worth of sustainable and energy efficient buildings all over our region of operation.",
    score: 7,
    explanation:
      "The company specializes in providing digital construction design solutions for sustainable and energy-efficient buildings in the Nordic and Baltic region.",
  },
];

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
      locations: locations ? locations.split(/[ ,]/) : undefined,
      keywords: keywords ? keywords.split(/[ ,]/) : undefined,
      relevanceKeywords: relevanceKeywords.split(" "),
      minEmployeeCount: minEmployeeCount || undefined,
      maxEmployeeCount: maxEmployeeCount || undefined,
    };
    try {
      const res = await axios<{
        totalCount: number;
        organizations: CompanyRelevancyResult[];
      }>("http://localhost:3000/app/companies", { params: query });
      console.log("RSP: ", res.data);

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
